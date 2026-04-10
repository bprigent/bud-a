"""CRUD endpoints for bank accounts."""

from datetime import date as date_type

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator

from config import ALLOWED_CURRENCIES

from csv_utils import (
    delete_row,
    generate_id,
    get_row_by_id,
    read_csv,
    update_row,
    validate_foreign_key,
    write_row,
)

router = APIRouter(prefix="/api/accounts", tags=["accounts"])

CSV_FILE = "accounts.csv"


class AccountCreate(BaseModel):
    member_id: str
    bank_name: str = Field(max_length=200)
    account_number: str = Field(max_length=100)
    nickname: str = Field(default="", max_length=200)
    type: str = "checking"
    currency: str = "EUR"
    opening_balance: int = 0
    opening_balance_date: str = ""
    statement_balance: int | None = None
    statement_date: str = ""
    logo: str = ""
    image_url: str = ""
    is_savings: bool = False

    @field_validator("opening_balance_date", "statement_date")
    @classmethod
    def validate_dates(cls, v: str) -> str:
        if v:
            date_type.fromisoformat(v)
        return v

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, v: str) -> str:
        if v.upper() not in ALLOWED_CURRENCIES:
            raise ValueError(f"Unsupported currency: {v}")
        return v.upper()


class AccountUpdate(BaseModel):
    member_id: str | None = None
    bank_name: str | None = Field(default=None, max_length=200)
    account_number: str | None = Field(default=None, max_length=100)
    nickname: str | None = Field(default=None, max_length=200)
    type: str | None = None
    currency: str | None = None
    opening_balance: int | None = None
    opening_balance_date: str | None = None
    statement_balance: int | None = None
    statement_date: str | None = None
    logo: str | None = None
    image_url: str | None = None
    is_savings: bool | None = None

    @field_validator("opening_balance_date", "statement_date")
    @classmethod
    def validate_dates(cls, v: str | None) -> str | None:
        if v:
            date_type.fromisoformat(v)
        return v

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, v: str | None) -> str | None:
        if v and v.upper() not in ALLOWED_CURRENCIES:
            raise ValueError(f"Unsupported currency: {v}")
        return v.upper() if v else v


def _validate_fks(member_id: str | None) -> None:
    if member_id and not validate_foreign_key("members.csv", "id", member_id):
        raise HTTPException(status_code=400, detail="Invalid member_id")


def _serialize_updates(updates: dict) -> dict[str, str]:
    """Convert Pydantic values to CSV string cells; ``None`` clears optional fields."""
    out: dict[str, str] = {}
    for key, value in updates.items():
        if value is None:
            out[key] = ""
        elif isinstance(value, bool):
            out[key] = "true" if value else ""
        elif isinstance(value, int):
            out[key] = str(value)
        else:
            out[key] = str(value)
    return out


@router.get("/")
def list_accounts() -> list[dict[str, str]]:
    """List all accounts."""
    return read_csv(CSV_FILE)


@router.get("/{account_id}")
def get_account(account_id: str) -> dict[str, str]:
    """Get a single account by id."""
    row = get_row_by_id(CSV_FILE, account_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return row


@router.post("/", status_code=201)
def create_account(account: AccountCreate) -> dict[str, str]:
    """Create a new account."""
    _validate_fks(account.member_id)
    row = {
        "id": generate_id(),
        "member_id": account.member_id,
        "bank_name": account.bank_name,
        "account_number": account.account_number,
        "nickname": account.nickname,
        "type": account.type,
        "currency": account.currency,
        "opening_balance": str(account.opening_balance),
        "opening_balance_date": account.opening_balance_date or "",
        "statement_balance": ""
        if account.statement_balance is None
        else str(account.statement_balance),
        "statement_date": account.statement_date or "",
        "logo": account.logo or "",
        "image_url": account.image_url or "",
        "is_savings": "true" if account.is_savings else "",
    }
    return write_row(CSV_FILE, row)


@router.put("/{account_id}")
def update_account(account_id: str, account: AccountUpdate) -> dict[str, str]:
    """Update an account by id."""
    updates = account.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    _validate_fks(updates.get("member_id"))
    serialized = _serialize_updates(updates)
    result = update_row(CSV_FILE, account_id, serialized)
    if result is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return result


@router.delete("/{account_id}")
def delete_account(account_id: str) -> dict[str, str]:
    """Delete an account by id."""
    if get_row_by_id(CSV_FILE, account_id) is None:
        raise HTTPException(status_code=404, detail="Account not found")
    ops = read_csv("operations.csv")
    if any(o.get("from_account_id") == account_id or o.get("to_account_id") == account_id for o in ops):
        raise HTTPException(status_code=409, detail="Cannot delete: account has operations")
    delete_row(CSV_FILE, account_id)
    return {"detail": "Account deleted"}
