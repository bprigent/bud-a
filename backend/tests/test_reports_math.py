"""Tests for routers/reports.py monthly_report and _compute_account_balance_rows."""

from __future__ import annotations

from typing import Any

import pytest

from routers import reports

DEFAULT_PLAN_ID = "default-plan-test"


def _make_read_csv(
    operations: list[dict[str, str]] | None = None,
    categories: list[dict[str, str]] | None = None,
    members: list[dict[str, str]] | None = None,
    budgets: list[dict[str, str]] | None = None,
    accounts: list[dict[str, str]] | None = None,
    budget_plans: list[dict[str, str]] | None = None,
) -> Any:
    operations = operations or []
    categories = categories or []
    members = members or []
    budgets = budgets or []
    accounts = accounts or []
    budget_plans = budget_plans if budget_plans is not None else []

    def fake_read_csv(path: str) -> list[dict[str, str]]:
        if path == "operations.csv":
            return operations
        if path == "categories.csv":
            return categories
        if path == "members.csv":
            return members
        if path == "budgets.csv":
            return budgets
        if path == "accounts.csv":
            return accounts
        if path == "budget_plans.csv":
            return budget_plans
        return []

    return fake_read_csv


class TestMonthlyTotals:
    def test_expenses_only(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c1"
        ops = [
            {
                "id": "o1",
                "date": "2026-03-10",
                "type": "expense",
                "amount": "3000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
            {
                "id": "o2",
                "date": "2026-03-15",
                "type": "expense",
                "amount": "2000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=ops),
        )
        r = reports.monthly_report(month="2026-03")
        assert r["total_expenses"] == 5000
        assert r["total_income"] == 0
        assert r["net"] == -5000

    def test_income_only(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c1"
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "income",
                "amount": "8000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "",
                "to_account_id": "a1",
            },
        ]
        monkeypatch.setattr(reports, "read_csv", _make_read_csv(operations=ops))
        r = reports.monthly_report(month="2026-03")
        assert r["total_income"] == 8000
        assert r["total_expenses"] == 0
        assert r["net"] == 8000

    def test_mixed_operations(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c1"
        ops = [
            {
                "id": "o1",
                "date": "2026-03-05",
                "type": "income",
                "amount": "10000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "",
                "to_account_id": "a1",
            },
            {
                "id": "o2",
                "date": "2026-03-06",
                "type": "expense",
                "amount": "3500",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(reports, "read_csv", _make_read_csv(operations=ops))
        r = reports.monthly_report(month="2026-03")
        assert r["total_income"] == 10000
        assert r["total_expenses"] == 3500
        assert r["net"] == 6500

    def test_money_movement_excluded_from_totals(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c1"
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "money_movement",
                "amount": "99999",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "a2",
            },
            {
                "id": "o2",
                "date": "2026-03-02",
                "type": "expense",
                "amount": "100",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(reports, "read_csv", _make_read_csv(operations=ops))
        r = reports.monthly_report(month="2026-03")
        assert r["total_expenses"] == 100
        assert r["total_income"] == 0
        assert r["net"] == -100
        assert r["total_transfers"] == 99999
        assert len(r["transfers"]) == 1
        assert r["transfers"][0]["amount"] == 99999
        assert r["transfers"][0]["id"] == "o1"
        assert r["transfers"][0]["from"]["label"] == "Unknown"
        assert r["transfers"][0]["to"]["label"] == "Unknown"

    def test_empty_month(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.setattr(reports, "read_csv", _make_read_csv(operations=[]))
        r = reports.monthly_report(month="2026-04")
        assert r["total_expenses"] == 0
        assert r["total_income"] == 0
        assert r["net"] == 0
        assert r["total_transfers"] == 0
        assert r["transfers"] == []

    def test_operations_from_other_months_filtered(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c1"
        ops = [
            {
                "id": "o1",
                "date": "2026-02-28",
                "type": "expense",
                "amount": "9000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
            {
                "id": "o2",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "100",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(reports, "read_csv", _make_read_csv(operations=ops))
        r = reports.monthly_report(month="2026-03")
        assert r["total_expenses"] == 100


class TestByCategoryAggregation:
    def test_two_expenses_same_category(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-agg"
        cats = [{"id": cat, "name": "Food"}]
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "1000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
            {
                "id": "o2",
                "date": "2026-03-02",
                "type": "expense",
                "amount": "500",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=ops, categories=cats),
        )
        r = reports.monthly_report(month="2026-03")
        by_cat = {x["category_id"]: x for x in r["expenses_by_category"]}
        assert by_cat[cat]["amount"] == 1500
        assert by_cat[cat]["category_name"] == "Food"

    def test_two_expenses_different_categories(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cats = [
            {"id": "c1", "name": "A"},
            {"id": "c2", "name": "B"},
        ]
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "100",
                "category_id": "c1",
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
            {
                "id": "o2",
                "date": "2026-03-02",
                "type": "expense",
                "amount": "200",
                "category_id": "c2",
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=ops, categories=cats),
        )
        r = reports.monthly_report(month="2026-03")
        amounts = {x["category_id"]: x["amount"] for x in r["expenses_by_category"]}
        assert amounts == {"c1": 100, "c2": 200}

    def test_unknown_category_id(self, monkeypatch: pytest.MonkeyPatch) -> None:
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "50",
                "category_id": "missing-cat",
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(reports, "read_csv", _make_read_csv(operations=ops, categories=[]))
        r = reports.monthly_report(month="2026-03")
        assert r["expenses_by_category"][0]["category_name"] == "Unknown"

    def test_income_by_category(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-inc"
        cats = [{"id": cat, "name": "Salary", "emoji": "💰"}]
        ops = [
            {
                "id": "o1",
                "date": "2026-03-15",
                "type": "income",
                "amount": "5000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "",
                "to_account_id": "a1",
            },
            {
                "id": "o2",
                "date": "2026-03-20",
                "type": "income",
                "amount": "3000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "",
                "to_account_id": "a1",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=ops, categories=cats),
        )
        r = reports.monthly_report(month="2026-03")
        inc = {x["category_id"]: x for x in r["income_by_category"]}
        assert inc[cat]["amount"] == 8000
        assert inc[cat]["category_name"] == "Salary"
        assert inc[cat]["category_emoji"] == "💰"

    def test_transfers_list_one_per_operation(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-xfer"
        cats = [{"id": cat, "name": "Between accounts"}]
        accounts = [
            {"id": "a1", "nickname": "Checking", "bank_name": "", "member_id": "m1"},
            {"id": "a2", "nickname": "Savings", "bank_name": "", "member_id": "m1"},
        ]
        ops = [
            {
                "id": "o1",
                "date": "2026-03-15",
                "type": "money_movement",
                "amount": "10000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "a2",
            },
            {
                "id": "o2",
                "date": "2026-03-20",
                "type": "money_movement",
                "amount": "5000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "a2",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=ops, categories=cats, accounts=accounts),
        )
        r = reports.monthly_report(month="2026-03")
        assert r["total_transfers"] == 15000
        assert len(r["transfers"]) == 2
        assert r["transfers"][0]["id"] == "o2"
        assert r["transfers"][0]["amount"] == 5000
        assert r["transfers"][0]["to"]["label"] == "Savings"
        assert r["transfers"][0]["from"]["label"] == "Checking"
        assert r["transfers"][1]["id"] == "o1"
        assert r["transfers"][1]["amount"] == 10000

    def test_transfer_em_dash_when_from_account_blank(
        self, monkeypatch: pytest.MonkeyPatch
    ) -> None:
        """Missing from side shows em dash label; to side resolves from accounts."""
        cat = "c-xfer"
        cats = [{"id": cat, "name": "Xfer"}]
        accounts = [
            {"id": "a1", "nickname": "Pot", "bank_name": "", "member_id": "m1"},
        ]
        ops = [
            {
                "id": "o1",
                "date": "2026-03-10",
                "type": "money_movement",
                "amount": "500",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "",
                "to_account_id": "a1",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=ops, categories=cats, accounts=accounts),
        )
        r = reports.monthly_report(month="2026-03")
        assert len(r["transfers"]) == 1
        t0 = r["transfers"][0]
        assert t0["from"]["id"] is None
        assert t0["from"]["label"] == "—"
        assert t0["to"]["id"] == "a1"
        assert t0["to"]["label"] == "Pot"

    def test_transfers_same_date_sorted_by_id_desc(
        self, monkeypatch: pytest.MonkeyPatch
    ) -> None:
        """Tie-breaker when dates match: lexicographically larger id first."""
        cat = "c"
        accounts = [
            {"id": "a1", "nickname": "A", "bank_name": "", "member_id": "m1"},
            {"id": "a2", "nickname": "B", "bank_name": "", "member_id": "m1"},
        ]
        ops = [
            {
                "id": "o-early",
                "date": "2026-03-15",
                "type": "money_movement",
                "amount": "100",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "a2",
            },
            {
                "id": "o-late",
                "date": "2026-03-15",
                "type": "money_movement",
                "amount": "200",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "a2",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=ops, categories=[], accounts=accounts),
        )
        r = reports.monthly_report(month="2026-03")
        assert [x["id"] for x in r["transfers"]] == ["o-late", "o-early"]


class TestByMemberAggregation:
    def test_two_expenses_same_member(self, monkeypatch: pytest.MonkeyPatch) -> None:
        members = [{"id": "m-x", "first_name": "Sam", "last_name": "Lee"}]
        cat = "c1"
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "400",
                "category_id": cat,
                "member_id": "m-x",
                "from_account_id": "a1",
                "to_account_id": "",
            },
            {
                "id": "o2",
                "date": "2026-03-02",
                "type": "expense",
                "amount": "600",
                "category_id": cat,
                "member_id": "m-x",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=ops, members=members),
        )
        r = reports.monthly_report(month="2026-03")
        assert len(r["expenses_by_member"]) == 1
        assert r["expenses_by_member"][0]["amount"] == 1000
        assert r["expenses_by_member"][0]["member_name"] == "Sam Lee"

    def test_unknown_member_id(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c1"
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "25",
                "category_id": cat,
                "member_id": "ghost",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(reports, "read_csv", _make_read_csv(operations=ops, members=[]))
        r = reports.monthly_report(month="2026-03")
        assert r["expenses_by_member"][0]["member_name"] == "Unknown"


class TestBudgetVsActual:
    def test_under_budget(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-bud"
        cats = [{"id": cat, "name": "Rent"}]
        budgets = [
            {
                "id": "b1",
                "budget_plan_id": DEFAULT_PLAN_ID,
                "category_id": cat,
                "amount": "100000",
                "currency": "USD",
                "period": "monthly",
                "start_date": "2026-01-01",
                "end_date": "",
            },
        ]
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "40000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(
                operations=ops,
                categories=cats,
                budgets=budgets,
                budget_plans=[{"id": DEFAULT_PLAN_ID, "name": "Monthly budget"}],
            ),
        )
        r = reports.monthly_report(month="2026-03", budget_plan_id=DEFAULT_PLAN_ID)
        bva = r["budget_vs_actual"][0]
        assert bva["remaining"] == 60000
        assert bva["remaining"] > 0

    def test_exactly_at_budget(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-bud"
        cats = [{"id": cat, "name": "X"}]
        budgets = [
            {
                "id": "b1",
                "budget_plan_id": DEFAULT_PLAN_ID,
                "category_id": cat,
                "amount": "5000",
                "currency": "EUR",
                "period": "monthly",
                "start_date": "2026-01-01",
                "end_date": "",
            },
        ]
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "5000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(
                operations=ops,
                categories=cats,
                budgets=budgets,
                budget_plans=[{"id": DEFAULT_PLAN_ID, "name": "Monthly budget"}],
            ),
        )
        r = reports.monthly_report(month="2026-03", budget_plan_id=DEFAULT_PLAN_ID)
        assert r["budget_vs_actual"][0]["remaining"] == 0

    def test_over_budget(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-bud"
        cats = [{"id": cat, "name": "Y"}]
        budgets = [
            {
                "id": "b1",
                "budget_plan_id": DEFAULT_PLAN_ID,
                "category_id": cat,
                "amount": "1000",
                "currency": "USD",
                "period": "monthly",
                "start_date": "2026-01-01",
                "end_date": "",
            },
        ]
        ops = [
            {
                "id": "o1",
                "date": "2026-03-01",
                "type": "expense",
                "amount": "5000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(
                operations=ops,
                categories=cats,
                budgets=budgets,
                budget_plans=[{"id": DEFAULT_PLAN_ID, "name": "Monthly budget"}],
            ),
        )
        r = reports.monthly_report(month="2026-03", budget_plan_id=DEFAULT_PLAN_ID)
        assert r["budget_vs_actual"][0]["remaining"] == -4000
        assert r["budget_vs_actual"][0]["remaining"] < 0

    def test_category_has_budget_no_expenses(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-only"
        cats = [{"id": cat, "name": "Savings"}]
        budgets = [
            {
                "id": "b1",
                "budget_plan_id": DEFAULT_PLAN_ID,
                "category_id": cat,
                "amount": "25000",
                "currency": "USD",
                "period": "monthly",
                "start_date": "2026-01-01",
                "end_date": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(
                operations=[],
                categories=cats,
                budgets=budgets,
                budget_plans=[{"id": DEFAULT_PLAN_ID, "name": "Monthly budget"}],
            ),
        )
        r = reports.monthly_report(month="2026-03", budget_plan_id=DEFAULT_PLAN_ID)
        bva = r["budget_vs_actual"][0]
        assert bva["actual_spent"] == 0
        assert bva["remaining"] == 25000
        assert bva["budget_amount"] == 25000

    def test_budget_actual_includes_categorized_transfers(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-sav"
        cats = [{"id": cat, "name": "Fixed Income"}]
        budgets = [
            {
                "id": "b1",
                "budget_plan_id": DEFAULT_PLAN_ID,
                "category_id": cat,
                "amount": "50000",
                "currency": "EUR",
                "period": "monthly",
                "start_date": "2026-01-01",
                "end_date": "",
            },
        ]
        ops = [
            {
                "id": "t1",
                "date": "2026-03-01",
                "type": "money_movement",
                "amount": "50000",
                "category_id": cat,
                "member_id": "m1",
                "from_account_id": "a1",
                "to_account_id": "a2",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(
                operations=ops,
                categories=cats,
                budgets=budgets,
                budget_plans=[{"id": DEFAULT_PLAN_ID, "name": "Monthly budget"}],
            ),
        )
        r = reports.monthly_report(month="2026-03", budget_plan_id=DEFAULT_PLAN_ID)
        bva = r["budget_vs_actual"][0]
        assert bva["actual_spent"] == 50000
        assert bva["remaining"] == 0

    def test_budget_with_end_date_excluded(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-old"
        cats = [{"id": cat, "name": "Old"}]
        budgets = [
            {
                "id": "b-old",
                "budget_plan_id": DEFAULT_PLAN_ID,
                "category_id": cat,
                "amount": "99999",
                "currency": "USD",
                "period": "monthly",
                "start_date": "2025-01-01",
                "end_date": "2026-02-01",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(
                operations=[],
                categories=cats,
                budgets=budgets,
                budget_plans=[{"id": DEFAULT_PLAN_ID, "name": "Monthly budget"}],
            ),
        )
        r = reports.monthly_report(month="2026-03", budget_plan_id=DEFAULT_PLAN_ID)
        assert r["budget_vs_actual"] == []

    def test_budget_with_empty_end_date_included(self, monkeypatch: pytest.MonkeyPatch) -> None:
        cat = "c-act"
        cats = [{"id": cat, "name": "Active"}]
        budgets = [
            {
                "id": "b1",
                "budget_plan_id": DEFAULT_PLAN_ID,
                "category_id": cat,
                "amount": "12345",
                "currency": "EUR",
                "period": "monthly",
                "start_date": "2026-01-01",
                "end_date": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(
                operations=[],
                categories=cats,
                budgets=budgets,
                budget_plans=[{"id": DEFAULT_PLAN_ID, "name": "Monthly budget"}],
            ),
        )
        r = reports.monthly_report(month="2026-03", budget_plan_id=DEFAULT_PLAN_ID)
        assert len(r["budget_vs_actual"]) == 1
        assert r["budget_vs_actual"][0]["budget_amount"] == 12345
        assert r["budget_vs_actual"][0]["currency"] == "EUR"


class TestComputeAccountBalanceRows:
    def test_derived_balance_and_variance(self, monkeypatch: pytest.MonkeyPatch) -> None:
        acc_id = "acc-main"
        accounts = [
            {
                "id": acc_id,
                "nickname": "Main",
                "bank_name": "",
                "member_id": "",
                "currency": "USD",
                "opening_balance": "",
                "opening_balance_date": "",
                "statement_balance": "100",
                "statement_date": "",
                "logo": "",
                "image_url": "",
            },
        ]
        operations = [
            {
                "type": "income",
                "amount": "500",
                "from_account_id": "",
                "to_account_id": acc_id,
                "date": "2026-01-01",
            },
        ]
        members: list[dict[str, str]] = []
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=operations, accounts=accounts, members=members),
        )
        rows = reports._compute_account_balance_rows()
        assert len(rows) == 1
        row = rows[0]
        assert row["account_id"] == acc_id
        assert row["balance"] == 500
        assert row["statement_balance"] == 100
        assert row["variance"] == 400

    def test_rows_sorted_by_label(self, monkeypatch: pytest.MonkeyPatch) -> None:
        accounts = [
            {
                "id": "z-id",
                "nickname": "Zebra",
                "bank_name": "",
                "member_id": "",
                "currency": "USD",
                "opening_balance": "",
                "opening_balance_date": "",
                "statement_balance": "",
                "statement_date": "",
                "logo": "",
                "image_url": "",
            },
            {
                "id": "a-id",
                "nickname": "Alpha",
                "bank_name": "",
                "member_id": "",
                "currency": "USD",
                "opening_balance": "",
                "opening_balance_date": "",
                "statement_balance": "",
                "statement_date": "",
                "logo": "",
                "image_url": "",
            },
        ]
        monkeypatch.setattr(
            reports,
            "read_csv",
            _make_read_csv(operations=[], accounts=accounts, members=[]),
        )
        rows = reports._compute_account_balance_rows()
        assert [r["label"] for r in rows] == ["Alpha", "Zebra"]
