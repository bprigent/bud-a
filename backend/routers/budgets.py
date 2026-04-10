"""CRUD endpoints for budgets."""

from datetime import date as date_type

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, field_validator

from budget_plan_service import get_default_plan_id
from config import ALLOWED_CURRENCIES, DEFAULT_CURRENCY
from csv_utils import (
    _write_all,
    delete_row,
    generate_id,
    get_row_by_id,
    read_csv,
    update_row,
    validate_foreign_key,
    write_row,
    HEADERS,
)

router = APIRouter(prefix="/api/budgets", tags=["budgets"])

CSV_FILE = "budgets.csv"


class BudgetCreate(BaseModel):
    budget_plan_id: str
    category_id: str
    amount: int
    currency: str = DEFAULT_CURRENCY
    period: str = "monthly"
    start_date: str = ""
    end_date: str = ""

    @field_validator("start_date", "end_date")
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


class BudgetUpdate(BaseModel):
    budget_plan_id: str | None = None
    category_id: str | None = None
    amount: int | None = None
    currency: str | None = None
    period: str | None = None
    start_date: str | None = None
    end_date: str | None = None

    @field_validator("start_date", "end_date")
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


def _validate_fks(category_id: str | None) -> None:
    if category_id and not validate_foreign_key("categories.csv", "id", category_id):
        raise HTTPException(status_code=400, detail="Invalid category_id")


def _validate_plan_id(budget_plan_id: str | None) -> None:
    if budget_plan_id and not validate_foreign_key("budget_plans.csv", "id", budget_plan_id):
        raise HTTPException(status_code=400, detail="Invalid budget_plan_id")


def _rows_for_plan(rows: list[dict[str, str]], budget_plan_id: str) -> list[dict[str, str]]:
    return [r for r in rows if (r.get("budget_plan_id") or "").strip() == budget_plan_id]


@router.get("/current")
def list_current_budgets(
    budget_plan_id: str | None = Query(None, description="Filter to this plan; defaults to Monthly budget"),
) -> list[dict[str, str]]:
    """List only budgets where end_date is empty (currently active)."""
    plan_id = budget_plan_id or get_default_plan_id()
    rows = read_csv(CSV_FILE)
    rows = _rows_for_plan(rows, plan_id)
    return [r for r in rows if not r.get("end_date", "").strip()]


@router.get("/as-of")
def list_budgets_as_of(
    as_of: str = Query(..., description="Date in YYYY-MM-DD format"),
    budget_plan_id: str | None = Query(None, description="Filter to this plan; defaults to Monthly budget"),
) -> list[dict[str, str]]:
    """List budgets that were active on a given date.

    A budget is active on a date if start_date <= date and
    (end_date is empty or end_date >= date).
    When multiple budgets exist for the same category, only the
    latest one (by start_date) is returned.
    """
    try:
        date_type.fromisoformat(as_of)
    except ValueError:
        raise HTTPException(400, detail="Invalid as_of format, expected YYYY-MM-DD")
    plan_id = budget_plan_id or get_default_plan_id()
    rows = read_csv(CSV_FILE)
    rows = _rows_for_plan(rows, plan_id)
    active = [
        r for r in rows
        if r.get("start_date", "").strip()
        and r["start_date"] <= as_of
        and (not r.get("end_date", "").strip() or r["end_date"] >= as_of)
    ]
    # Keep only the latest budget per category
    by_cat: dict[str, dict[str, str]] = {}
    for r in active:
        cat = r["category_id"]
        if cat not in by_cat or r["start_date"] > by_cat[cat]["start_date"]:
            by_cat[cat] = r
    return list(by_cat.values())


@router.get("/")
def list_budgets(
    budget_plan_id: str | None = Query(None, description="Filter to this plan; defaults to Monthly budget"),
    all_plans: bool = Query(
        False,
        description="If true, return all budget rows across named plans (e.g. Study view)",
    ),
) -> list[dict[str, str]]:
    """List budgets: one plan (default Monthly budget), or every row when all_plans is true."""
    rows = read_csv(CSV_FILE)
    if all_plans:
        return rows
    plan_id = budget_plan_id or get_default_plan_id()
    return _rows_for_plan(rows, plan_id)


@router.get("/{budget_id}")
def get_budget(budget_id: str) -> dict[str, str]:
    """Get a single budget by id."""
    row = get_row_by_id(CSV_FILE, budget_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    return row


@router.post("/", status_code=201)
def create_budget(budget: BudgetCreate) -> dict[str, str]:
    """Create a new budget."""
    _validate_plan_id(budget.budget_plan_id)
    _validate_fks(budget.category_id)
    start = budget.start_date if budget.start_date else date_type.today().isoformat()
    row = {
        "id": generate_id(),
        "budget_plan_id": budget.budget_plan_id,
        "category_id": budget.category_id,
        "amount": str(budget.amount),
        "currency": budget.currency,
        "period": budget.period,
        "start_date": start,
        "end_date": budget.end_date,
    }
    return write_row(CSV_FILE, row)


@router.put("/{budget_id}")
def update_budget(budget_id: str, budget: BudgetUpdate) -> dict[str, str]:
    """Update a budget by id.

    When the amount changes, the old row gets an end_date (today) and a new
    row is created with the updated amount, preserving budget history.
    """
    existing = get_row_by_id(CSV_FILE, budget_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Budget not found")

    updates = budget.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    _validate_fks(updates.get("category_id"))
    plan_update = updates.get("budget_plan_id")
    if plan_update is not None:
        _validate_plan_id(plan_update)

    # If amount is changing, close old budget and create new one atomically
    if "amount" in updates and str(updates["amount"]) != existing["amount"]:
        today = date_type.today().isoformat()
        rows = read_csv(CSV_FILE)
        for row in rows:
            if row["id"] == budget_id:
                row["end_date"] = today
                break
        new_row = {
            "id": generate_id(),
            "budget_plan_id": updates.get("budget_plan_id", existing.get("budget_plan_id", "")),
            "category_id": updates.get("category_id", existing["category_id"]),
            "amount": str(updates["amount"]),
            "currency": updates.get("currency", existing["currency"]),
            "period": updates.get("period", existing.get("period", "monthly")),
            "start_date": today,
            "end_date": "",
        }
        headers = HEADERS[CSV_FILE]
        rows.append({h: str(new_row.get(h, "")) for h in headers})
        _write_all(CSV_FILE, rows)
        return new_row

    # Otherwise, just update in place
    result = update_row(CSV_FILE, budget_id, updates)
    if result is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    return result


@router.delete("/{budget_id}")
def delete_budget(budget_id: str) -> dict[str, str]:
    """Delete a budget by id."""
    if not delete_row(CSV_FILE, budget_id):
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"detail": "Budget deleted"}
