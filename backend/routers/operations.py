"""CRUD endpoints for operations (expenses, income, money movements)."""

from enum import Enum

import re
from datetime import date as date_type

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field, field_validator, model_validator

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

router = APIRouter(prefix="/api/operations", tags=["operations"])

CSV_FILE = "operations.csv"


class OperationType(str, Enum):
    expense = "expense"
    income = "income"
    money_movement = "money_movement"


class OperationCreate(BaseModel):
    type: OperationType
    date: str
    member_id: str
    from_account_id: str = ""
    to_account_id: str = ""
    label: str = Field(max_length=500)
    category_id: str
    amount: int
    currency: str = "EUR"

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        date_type.fromisoformat(v)
        return v

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, v: str) -> str:
        if v.upper() not in ALLOWED_CURRENCIES:
            raise ValueError(f"Unsupported currency: {v}")
        return v.upper()

    @model_validator(mode="after")
    def validate_accounts(self) -> "OperationCreate":
        t = self.type
        if t == OperationType.expense and not self.from_account_id:
            raise ValueError("expense requires from_account_id")
        if t == OperationType.income and not self.to_account_id:
            raise ValueError("income requires to_account_id")
        if t == OperationType.money_movement:
            if not self.from_account_id or not self.to_account_id:
                raise ValueError("money_movement requires both from_account_id and to_account_id")
        return self


class OperationUpdate(BaseModel):
    type: OperationType | None = None
    date: str | None = None
    member_id: str | None = None
    from_account_id: str | None = None
    to_account_id: str | None = None
    label: str | None = Field(default=None, max_length=500)
    category_id: str | None = None
    amount: int | None = None
    currency: str | None = None

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: str | None) -> str | None:
        if v:
            date_type.fromisoformat(v)
        return v

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, v: str | None) -> str | None:
        if v and v.upper() not in ALLOWED_CURRENCIES:
            raise ValueError(f"Unsupported currency: {v}")
        return v.upper() if v else v


def _validate_fks(
    member_id: str | None = None,
    from_account_id: str | None = None,
    to_account_id: str | None = None,
    category_id: str | None = None,
) -> None:
    if member_id and not validate_foreign_key("members.csv", "id", member_id):
        raise HTTPException(status_code=400, detail="Invalid member_id")
    if from_account_id and not validate_foreign_key("accounts.csv", "id", from_account_id):
        raise HTTPException(status_code=400, detail="Invalid from_account_id")
    if to_account_id and not validate_foreign_key("accounts.csv", "id", to_account_id):
        raise HTTPException(status_code=400, detail="Invalid to_account_id")
    if category_id and not validate_foreign_key("categories.csv", "id", category_id):
        raise HTTPException(status_code=400, detail="Invalid category_id")


@router.get("/")
def list_operations(
    month: str | None = Query(None, description="Filter by month, e.g. 2026-03"),
    member_id: str | None = Query(None),
    category_id: str | None = Query(None),
    account_id: str | None = Query(None, description="Match from_account_id or to_account_id"),
    op_type: str | None = Query(None, alias="type", description="Filter by type: expense, income, money_movement"),
    start_date: str | None = Query(None, description="Filter from date, e.g. 2026-01-01"),
    end_date: str | None = Query(None, description="Filter to date, e.g. 2026-03-31"),
) -> list[dict[str, str]]:
    """List all operations, optionally filtered."""
    if month and not re.match(r"^\d{4}-\d{2}$", month):
        raise HTTPException(400, detail="Invalid month format, expected YYYY-MM")
    if start_date:
        try:
            date_type.fromisoformat(start_date)
        except ValueError:
            raise HTTPException(400, detail="Invalid start_date format, expected YYYY-MM-DD")
    if end_date:
        try:
            date_type.fromisoformat(end_date)
        except ValueError:
            raise HTTPException(400, detail="Invalid end_date format, expected YYYY-MM-DD")
    rows = read_csv(CSV_FILE)
    if month:
        rows = [r for r in rows if r["date"].startswith(month)]
    if start_date:
        rows = [r for r in rows if r["date"] >= start_date]
    if end_date:
        rows = [r for r in rows if r["date"] <= end_date]
    if member_id:
        rows = [r for r in rows if r["member_id"] == member_id]
    if category_id:
        rows = [r for r in rows if r["category_id"] == category_id]
    if account_id:
        rows = [
            r for r in rows
            if r.get("from_account_id") == account_id
            or r.get("to_account_id") == account_id
        ]
    if op_type:
        rows = [r for r in rows if r["type"] == op_type]
    return rows


@router.get("/{operation_id}")
def get_operation(operation_id: str) -> dict[str, str]:
    """Get a single operation by id."""
    row = get_row_by_id(CSV_FILE, operation_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Operation not found")
    return row


@router.post("/", status_code=201)
def create_operation(operation: OperationCreate) -> dict[str, str]:
    """Create a new operation."""
    _validate_fks(
        operation.member_id,
        operation.from_account_id,
        operation.to_account_id,
        operation.category_id,
    )
    row = {
        "id": generate_id(),
        "type": operation.type.value,
        "date": operation.date,
        "member_id": operation.member_id,
        "from_account_id": operation.from_account_id,
        "to_account_id": operation.to_account_id,
        "label": operation.label,
        "category_id": operation.category_id,
        "amount": str(operation.amount),
        "currency": operation.currency,
    }
    return write_row(CSV_FILE, row)


@router.put("/{operation_id}")
def update_operation(operation_id: str, operation: OperationUpdate) -> dict[str, str]:
    """Update an operation by id."""
    updates = operation.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    if "type" in updates:
        updates["type"] = updates["type"].value
    _validate_fks(
        updates.get("member_id"),
        updates.get("from_account_id"),
        updates.get("to_account_id"),
        updates.get("category_id"),
    )
    result = update_row(CSV_FILE, operation_id, updates)
    if result is None:
        raise HTTPException(status_code=404, detail="Operation not found")
    return result


@router.delete("/{operation_id}")
def delete_operation(operation_id: str) -> dict[str, str]:
    """Delete an operation by id."""
    if not delete_row(CSV_FILE, operation_id):
        raise HTTPException(status_code=404, detail="Operation not found")
    return {"detail": "Operation deleted"}
