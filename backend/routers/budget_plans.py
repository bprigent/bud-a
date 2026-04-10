"""CRUD for named budget plans (tabs on the Budget page)."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from csv_utils import delete_row, generate_id, read_csv, update_row, write_row

router = APIRouter(prefix="/api/budget-plans", tags=["budget-plans"])

CSV_FILE = "budget_plans.csv"


class BudgetPlanCreate(BaseModel):
    name: str
    kind: str = "spending"


class BudgetPlanUpdate(BaseModel):
    name: str | None = None
    kind: str | None = None


def _count_budgets_for_plan(plan_id: str) -> int:
    rows = read_csv("budgets.csv")
    return sum(1 for r in rows if (r.get("budget_plan_id") or "").strip() == plan_id)


@router.get("/")
def list_budget_plans() -> list[dict[str, str]]:
    rows = read_csv(CSV_FILE)
    rows.sort(key=lambda r: (r.get("name") or "").lower())
    return rows


@router.post("/", status_code=201)
def create_budget_plan(body: BudgetPlanCreate) -> dict[str, str]:
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="name is required")
    k = (body.kind or "spending").strip().lower()
    if k not in ("spending", "savings"):
        raise HTTPException(status_code=400, detail="kind must be spending or savings")
    row = {"id": generate_id(), "name": name, "kind": k}
    return write_row(CSV_FILE, row)


@router.put("/{plan_id}")
def update_budget_plan(plan_id: str, body: BudgetPlanUpdate) -> dict[str, str]:
    updates: dict[str, str] = {}
    if body.name is not None:
        name = body.name.strip()
        if not name:
            raise HTTPException(status_code=400, detail="name cannot be empty")
        updates["name"] = name
    if body.kind is not None:
        k = body.kind.strip().lower()
        if k not in ("spending", "savings"):
            raise HTTPException(status_code=400, detail="kind must be spending or savings")
        updates["kind"] = k
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = update_row(CSV_FILE, plan_id, updates)
    if result is None:
        raise HTTPException(status_code=404, detail="Budget plan not found")
    return result


@router.delete("/{plan_id}")
def delete_budget_plan(plan_id: str) -> dict[str, str]:
    if _count_budgets_for_plan(plan_id) > 0:
        raise HTTPException(
            status_code=400,
            detail="Remove or reassign budgets in this plan before deleting it",
        )
    if not delete_row(CSV_FILE, plan_id):
        raise HTTPException(status_code=404, detail="Budget plan not found")
    return {"detail": "Budget plan deleted"}
