"""Budget plans (named budgets) — default plan and migration for legacy rows."""

from __future__ import annotations

from csv_utils import _write_all, generate_id, read_csv, write_row

BUDGET_PLANS_FILE = "budget_plans.csv"
BUDGETS_FILE = "budgets.csv"
# Default plan for monthly dashboard and API when no plan is specified.
MONTHLY_DASHBOARD_PLAN_NAME = "Monthly budget"
# Seed plan when budget_plans.csv is empty (no "Main" — use the monthly plan name).
DEFAULT_SEED_PLAN_NAME = MONTHLY_DASHBOARD_PLAN_NAME


def _plan_name_key(name: str) -> str:
    return (name or "").strip().lower()


def get_monthly_dashboard_plan_id() -> str:
    """Budget plan used for the monthly report when none is specified.

    Prefers a plan named "Monthly budget", else the first row.
    """
    ensure_budget_data_migrated()
    plans = read_csv(BUDGET_PLANS_FILE)
    if not plans:
        raise RuntimeError("No budget plans after migration")
    by_name: dict[str, dict[str, str]] = {}
    for p in plans:
        k = _plan_name_key(p.get("name", ""))
        if k and k not in by_name:
            by_name[k] = p
    preferred = _plan_name_key(MONTHLY_DASHBOARD_PLAN_NAME)
    if preferred in by_name:
        return by_name[preferred]["id"]
    return plans[0]["id"]


def get_default_plan_id() -> str:
    """Default plan when the API omits budget_plan_id (same resolution as monthly dashboard)."""
    return get_monthly_dashboard_plan_id()


def ensure_budget_data_migrated() -> None:
    """Ensure legacy budget rows have a plan id.

    Creates a single default plan (named like the monthly dashboard plan) only when
    budget_plans.csv is empty. Orphan budget rows attach to the "Monthly budget"
    plan if present, else the first existing plan.
    """
    plans = read_csv(BUDGET_PLANS_FILE)
    anchor_id: str | None = None

    if not plans:
        anchor_id = generate_id()
        write_row(
            BUDGET_PLANS_FILE,
            {"id": anchor_id, "name": DEFAULT_SEED_PLAN_NAME, "kind": "spending"},
        )
    else:
        for p in plans:
            if _plan_name_key(p.get("name", "")) == _plan_name_key(MONTHLY_DASHBOARD_PLAN_NAME):
                anchor_id = p["id"]
                break
        if anchor_id is None:
            anchor_id = plans[0]["id"]

    rows = read_csv(BUDGETS_FILE)
    changed = False
    for row in rows:
        if not (row.get("budget_plan_id") or "").strip():
            row["budget_plan_id"] = anchor_id
            changed = True
    if changed:
        _write_all(BUDGETS_FILE, rows)

    _normalize_budget_plan_kinds()


def _normalize_budget_plan_kinds() -> None:
    """Ensure every plan has kind spending|savings; default Savings plan name → savings."""
    plans = read_csv(BUDGET_PLANS_FILE)
    if not plans:
        return
    changed = False
    for p in plans:
        raw = (p.get("kind") or "").strip().lower()
        if raw in ("spending", "savings"):
            continue
        if _plan_name_key(p.get("name", "")) == "savings plan":
            p["kind"] = "savings"
        else:
            p["kind"] = "spending"
        changed = True
    if changed:
        _write_all(BUDGET_PLANS_FILE, plans)
