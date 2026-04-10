"""Reporting endpoints for monthly summaries."""

import re
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from account_balance import derived_balance_for_account, statement_variance, account_operation_effect
from budget_plan_service import get_monthly_dashboard_plan_id
from config import DEFAULT_CURRENCY
from csv_utils import read_csv, safe_int

router = APIRouter(prefix="/api/reports", tags=["reports"])


def _optional_query_plan_id(raw: str | None) -> str | None:
    """Normalize query param; non-string defaults (e.g. Query() when calling the route outside FastAPI) mean absent."""
    if raw is None:
        return None
    if isinstance(raw, str):
        s = raw.strip()
        return s if s else None
    return None


@router.get("/monthly")
def monthly_report(
    month: str = Query(..., description="Month in YYYY-MM format, e.g. 2026-03"),
    budget_plan_id: str | None = Query(
        None,
        description="Budget plan for budget vs actual; defaults to Monthly budget, else first plan",
    ),
) -> dict:
    """Return a monthly summary including totals, breakdowns by category/member,
    and budget vs actual comparisons."""
    if not re.match(r"^\d{4}-\d{2}$", month):
        raise HTTPException(400, detail="Invalid month format, expected YYYY-MM")

    # Load data
    operations = read_csv("operations.csv")
    categories = read_csv("categories.csv")
    members = read_csv("members.csv")
    budgets = read_csv("budgets.csv")
    accounts = read_csv("accounts.csv")

    # Build lookup maps
    cat_map: dict[str, str] = {c["id"]: c["name"] for c in categories}
    cat_emoji: dict[str, str] = {
        c["id"]: (c.get("emoji") or "").strip() for c in categories
    }
    account_labels = _account_label_map(accounts)
    member_map: dict[str, str] = {
        m["id"]: f"{m['first_name']} {m['last_name']}" for m in members
    }

    # Filter by month
    month_ops = [o for o in operations if o["date"].startswith(month)]
    month_expenses = [o for o in month_ops if o["type"] == "expense"]
    month_income = [o for o in month_ops if o["type"] == "income"]
    month_transfers = [o for o in month_ops if o["type"] == "money_movement"]

    # Totals
    total_expenses = sum(safe_int(e["amount"]) for e in month_expenses)
    total_income = sum(safe_int(i["amount"]) for i in month_income)
    net = total_income - total_expenses

    # Expenses by category
    expenses_by_category: dict[str, int] = {}
    for e in month_expenses:
        cat_id = e["category_id"]
        expenses_by_category[cat_id] = (
            expenses_by_category.get(cat_id, 0) + safe_int(e["amount"])
        )
    expenses_by_category_list = [
        {
            "category_id": cid,
            "category_name": cat_map.get(cid, "Unknown"),
            "category_emoji": cat_emoji.get(cid, ""),
            "amount": amt,
        }
        for cid, amt in expenses_by_category.items()
    ]

    # Expenses by member
    expenses_by_member: dict[str, int] = {}
    for e in month_expenses:
        mid = e["member_id"]
        expenses_by_member[mid] = (
            expenses_by_member.get(mid, 0) + safe_int(e["amount"])
        )
    expenses_by_member_list = [
        {
            "member_id": mid,
            "member_name": member_map.get(mid, "Unknown"),
            "amount": amt,
        }
        for mid, amt in expenses_by_member.items()
    ]

    # Income by category
    income_by_category: dict[str, int] = {}
    for i in month_income:
        cat_id = i["category_id"]
        income_by_category[cat_id] = (
            income_by_category.get(cat_id, 0) + safe_int(i["amount"])
        )
    income_by_category_list = [
        {
            "category_id": cid,
            "category_name": cat_map.get(cid, "Unknown"),
            "category_emoji": cat_emoji.get(cid, ""),
            "amount": amt,
        }
        for cid, amt in income_by_category.items()
    ]

    total_transfers = sum(safe_int(t["amount"]) for t in month_transfers)

    # Transfers (money_movement) with a category — count toward budget "actual" for that category
    # (e.g. savings plan goals funded by moving cash between accounts).
    transfers_by_category: dict[str, int] = {}
    for t in month_transfers:
        cid = (t.get("category_id") or "").strip()
        if not cid:
            continue
        transfers_by_category[cid] = transfers_by_category.get(cid, 0) + safe_int(t["amount"])

    transfers_sorted = sorted(
        month_transfers,
        key=lambda o: (o.get("date") or "", o.get("id") or ""),
        reverse=True,
    )
    transfers_list: list[dict[str, Any]] = []
    for t in transfers_sorted:
        from_id = (t.get("from_account_id") or "").strip() or None
        to_id = (t.get("to_account_id") or "").strip() or None
        amt = safe_int(t["amount"])
        transfers_list.append(
            {
                "id": t["id"],
                "date": t.get("date") or "",
                "from": {"id": from_id, "label": _label_for_account(account_labels, from_id)},
                "to": {"id": to_id, "label": _label_for_account(account_labels, to_id)},
                "amount": amt,
            }
        )

    # Budget vs actual (current budgets only, one named plan — default: Monthly budget → Main → first)
    explicit_plan_id = _optional_query_plan_id(budget_plan_id)
    plan_id = explicit_plan_id or get_monthly_dashboard_plan_id()
    plan_rows = read_csv("budget_plans.csv")
    plan_name = "Budget"
    plan_kind = "spending"
    for p in plan_rows:
        if (p.get("id") or "").strip() == plan_id:
            plan_name = (p.get("name") or "").strip() or "Budget"
            raw_k = (p.get("kind") or "").strip().lower()
            plan_kind = raw_k if raw_k in ("spending", "savings") else "spending"
            break
    else:
        if explicit_plan_id is not None:
            raise HTTPException(status_code=400, detail="Invalid budget_plan_id")

    current_budgets = [
        b
        for b in budgets
        if not b.get("end_date", "").strip()
        and (b.get("budget_plan_id") or "").strip() == plan_id
    ]
    budget_vs_actual = []
    for b in current_budgets:
        cat_id = b["category_id"]
        budget_amount = safe_int(b["amount"])
        actual_spent = expenses_by_category.get(cat_id, 0) + transfers_by_category.get(
            cat_id, 0
        )
        budget_vs_actual.append(
            {
                "category_id": cat_id,
                "category_name": cat_map.get(cat_id, "Unknown"),
                "category_emoji": cat_emoji.get(cat_id, ""),
                "budget_amount": budget_amount,
                "actual_spent": actual_spent,
                "remaining": budget_amount - actual_spent,
                "currency": b.get("currency", DEFAULT_CURRENCY),
            }
        )

    return {
        "month": month,
        "total_expenses": total_expenses,
        "total_income": total_income,
        "net": net,
        "expenses_by_category": expenses_by_category_list,
        "expenses_by_member": expenses_by_member_list,
        "income_by_category": income_by_category_list,
        "total_transfers": total_transfers,
        "transfers": transfers_list,
        "budget_vs_actual": budget_vs_actual,
        "budget_plan": {"id": plan_id, "name": plan_name, "kind": plan_kind},
        "accounts": _compute_account_balance_rows(month=month),
    }


@router.get("/account-balances")
def account_balances() -> dict:
    """Current balance per account (see ``_compute_account_balance_rows``)."""

    return {"accounts": _compute_account_balance_rows()}


@router.get("/savings-history")
def savings_history() -> dict:
    """Weekly balance history for all accounts.

    For each week (Monday) from the earliest operation to now,
    compute the cumulative balance per account.
    """
    from datetime import date, timedelta

    accounts = read_csv("accounts.csv")
    operations = read_csv("operations.csv")

    if not accounts:
        return {"points": [], "accounts": []}

    all_ids = {a["id"] for a in accounts}

    # Find the earliest relevant date across operations and opening balances.
    dates: list[str] = []
    for o in operations:
        d = (o.get("date") or "").strip()
        if len(d) >= 10:
            from_id = (o.get("from_account_id") or "").strip()
            to_id = (o.get("to_account_id") or "").strip()
            if from_id in all_ids or to_id in all_ids:
                dates.append(d[:10])
    for a in accounts:
        obd = (a.get("opening_balance_date") or "").strip()
        if len(obd) >= 10:
            dates.append(obd[:10])

    if not dates:
        return {"points": [], "accounts": []}

    earliest_str = min(dates)
    earliest = date.fromisoformat(earliest_str)
    # Snap to previous Monday
    earliest = earliest - timedelta(days=earliest.weekday())

    today = date.today()

    # Build list of weekly Mondays
    weeks: list[date] = []
    d = earliest
    while d <= today:
        weeks.append(d)
        d += timedelta(days=7)
    # Always include the current week
    if not weeks or weeks[-1] + timedelta(days=6) < today:
        weeks.append(d)

    # Pre-sort operations by date for slightly cleaner logic
    sorted_ops = sorted(operations, key=lambda o: o.get("date") or "")

    # Build account metadata list for the frontend filter
    account_label_map = _account_label_map(accounts)
    accounts_meta: list[dict[str, str | None | bool]] = []
    for a in accounts:
        aid = a["id"]
        mid = (a.get("member_id") or "").strip() or None
        accounts_meta.append({
            "id": aid,
            "label": account_label_map.get(aid, "Account"),
            "bank_name": (a.get("bank_name") or "").strip() or None,
            "member_id": mid,
            "is_savings": (a.get("is_savings") or "").strip().lower() == "true",
        })

    # For each week, compute cumulative balance per account through Sunday of that week
    result: list[dict[str, Any]] = []
    for monday in weeks:
        sunday = monday + timedelta(days=6)
        sunday_str = sunday.isoformat()
        row: dict[str, Any] = {"date": monday.isoformat()}
        total = 0
        for a in accounts:
            aid = a["id"]
            cutoff = (a.get("opening_balance_date") or "").strip()
            opening = safe_int(a.get("opening_balance") or "0")

            acc_total = 0
            for o in sorted_ops:
                od = (o.get("date") or "").strip()
                if not od:
                    continue
                if od > sunday_str:
                    break
                if cutoff and od < cutoff:
                    continue
                acc_total += account_operation_effect(o, aid)

            balance = (opening + acc_total) if cutoff else acc_total
            row[aid] = balance
            total += balance

        row["total"] = total
        result.append(row)

    return {"points": result, "accounts": accounts_meta}


def _account_label_map(accounts: list[dict[str, str]]) -> dict[str, str]:
    """Map account id → display label (nickname, else bank name, else \"Account\")."""
    out: dict[str, str] = {}
    for a in accounts:
        aid = (a.get("id") or "").strip()
        if not aid:
            continue
        nick = (a.get("nickname") or "").strip()
        bank = (a.get("bank_name") or "").strip()
        out[aid] = nick or bank or "Account"
    return out


def _label_for_account(
    account_labels: dict[str, str],
    account_id: str | None,
) -> str:
    if not account_id:
        return "—"
    return account_labels.get(account_id, "Unknown")


def _compute_account_balance_rows(
    month: str | None = None,
) -> list[dict[str, str | int | None]]:
    accounts = read_csv("accounts.csv")
    operations = read_csv("operations.csv")
    members = read_csv("members.csv")
    member_map: dict[str, str] = {
        m["id"]: f"{m['first_name']} {m['last_name']}".strip() for m in members
    }

    # Pre-filter operations for the month delta (if a month is given).
    month_ops: list[dict[str, str]] = []
    if month:
        prefix = month  # e.g. "2026-04"
        month_ops = [o for o in operations if (o.get("date") or "").startswith(prefix)]

    rows: list[dict[str, str | int | None]] = []
    for a in accounts:
        aid = a["id"]
        nick = (a.get("nickname") or "").strip()
        bank = (a.get("bank_name") or "").strip()
        label = nick or bank or "Account"
        mid = (a.get("member_id") or "").strip()
        owner_name = member_map.get(mid, "") or None
        derived = derived_balance_for_account(a, operations)
        var = statement_variance(derived, a)
        stmt_raw = (a.get("statement_balance") or "").strip()
        stmt_bal = safe_int(stmt_raw) if stmt_raw != "" else None
        logo_raw = (a.get("logo") or "").strip()
        image_url_raw = (a.get("image_url") or "").strip()

        # Net effect of operations in this month on this account.
        month_delta: int | None = None
        if month:
            month_delta = sum(account_operation_effect(o, aid) for o in month_ops)

        rows.append(
            {
                "account_id": aid,
                "member_id": mid or None,
                "label": label,
                "bank_name": bank or None,
                "owner_name": owner_name,
                "logo": logo_raw or None,
                "image_url": image_url_raw or None,
                "balance": derived,
                "month_delta": month_delta,
                "currency": (a.get("currency") or "").strip() or DEFAULT_CURRENCY,
                "statement_balance": stmt_bal,
                "statement_date": (a.get("statement_date") or "").strip() or None,
                "variance": var,
                "is_savings": (a.get("is_savings") or "").strip().lower() == "true",
            }
        )

    rows.sort(key=lambda r: (str(r["label"]).lower(), str(r["account_id"])))
    return rows


