"""CRUD endpoints for household members."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from csv_utils import delete_row, generate_id, get_row_by_id, read_csv, update_row, write_row

router = APIRouter(prefix="/api/members", tags=["members"])

CSV_FILE = "members.csv"


class MemberCreate(BaseModel):
    first_name: str = Field(max_length=200)
    last_name: str = Field(max_length=200)
    email: str = Field(max_length=254)
    phone: str = Field(default="", max_length=50)
    color: str = Field(default="", max_length=20)


class MemberUpdate(BaseModel):
    first_name: str | None = Field(default=None, max_length=200)
    last_name: str | None = Field(default=None, max_length=200)
    email: str | None = Field(default=None, max_length=254)
    phone: str | None = Field(default=None, max_length=50)
    color: str | None = Field(default=None, max_length=20)


@router.get("/")
def list_members() -> list[dict[str, str]]:
    """List all members."""
    return read_csv(CSV_FILE)


@router.get("/{member_id}")
def get_member(member_id: str) -> dict[str, str]:
    """Get a single member by id."""
    row = get_row_by_id(CSV_FILE, member_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return row


@router.post("/", status_code=201)
def create_member(member: MemberCreate) -> dict[str, str]:
    """Create a new member."""
    row = {
        "id": generate_id(),
        "first_name": member.first_name,
        "last_name": member.last_name,
        "email": member.email,
        "phone": member.phone,
        "color": member.color,
    }
    return write_row(CSV_FILE, row)


@router.put("/{member_id}")
def update_member(member_id: str, member: MemberUpdate) -> dict[str, str]:
    """Update a member by id."""
    updates = member.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = update_row(CSV_FILE, member_id, updates)
    if result is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return result


@router.delete("/{member_id}")
def delete_member(member_id: str) -> dict[str, str]:
    """Delete a member by id."""
    if get_row_by_id(CSV_FILE, member_id) is None:
        raise HTTPException(status_code=404, detail="Member not found")
    ops = read_csv("operations.csv")
    if any(o["member_id"] == member_id for o in ops):
        raise HTTPException(status_code=409, detail="Cannot delete: member has operations")
    accts = read_csv("accounts.csv")
    if any(a["member_id"] == member_id for a in accts):
        raise HTTPException(status_code=409, detail="Cannot delete: member has accounts")
    delete_row(CSV_FILE, member_id)
    return {"detail": "Member deleted"}
