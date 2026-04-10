"""Tests for list_budgets_as_of in routers/budgets.py with mocked CSV data."""

from __future__ import annotations

import pytest

from routers import budgets

PLAN_ID = "plan-test-1"


def _budget_row(
    bid: str,
    category_id: str,
    start_date: str,
    end_date: str,
    amount: str = "10000",
) -> dict[str, str]:
    return {
        "id": bid,
        "budget_plan_id": PLAN_ID,
        "category_id": category_id,
        "amount": amount,
        "currency": "EUR",
        "period": "monthly",
        "start_date": start_date,
        "end_date": end_date,
    }


class TestListBudgetsAsOf:
    def test_single_active_budget(self, monkeypatch: pytest.MonkeyPatch) -> None:
        rows = [_budget_row("b1", "cat-a", "2026-01-01", "")]
        monkeypatch.setattr(budgets, "read_csv", lambda _path: rows)
        out = budgets.list_budgets_as_of(
            as_of="2026-03-15",
            budget_plan_id=PLAN_ID,
        )
        assert len(out) == 1
        assert out[0]["id"] == "b1"

    def test_start_date_after_as_of_excluded(self, monkeypatch: pytest.MonkeyPatch) -> None:
        rows = [_budget_row("b1", "cat-a", "2026-06-01", "")]
        monkeypatch.setattr(budgets, "read_csv", lambda _path: rows)
        assert budgets.list_budgets_as_of(
            as_of="2026-03-15",
            budget_plan_id=PLAN_ID,
        ) == []

    def test_end_date_before_as_of_excluded(self, monkeypatch: pytest.MonkeyPatch) -> None:
        rows = [_budget_row("b1", "cat-a", "2026-01-01", "2026-02-28")]
        monkeypatch.setattr(budgets, "read_csv", lambda _path: rows)
        assert budgets.list_budgets_as_of(
            as_of="2026-03-15",
            budget_plan_id=PLAN_ID,
        ) == []

    def test_end_date_equals_as_of_included(self, monkeypatch: pytest.MonkeyPatch) -> None:
        rows = [_budget_row("b1", "cat-a", "2026-01-01", "2026-03-15")]
        monkeypatch.setattr(budgets, "read_csv", lambda _path: rows)
        out = budgets.list_budgets_as_of(
            as_of="2026-03-15",
            budget_plan_id=PLAN_ID,
        )
        assert len(out) == 1
        assert out[0]["id"] == "b1"

    def test_start_date_equals_as_of_included(self, monkeypatch: pytest.MonkeyPatch) -> None:
        rows = [_budget_row("b1", "cat-a", "2026-03-15", "")]
        monkeypatch.setattr(budgets, "read_csv", lambda _path: rows)
        out = budgets.list_budgets_as_of(
            as_of="2026-03-15",
            budget_plan_id=PLAN_ID,
        )
        assert len(out) == 1

    def test_two_budgets_same_category_latest_start_wins(
        self,
        monkeypatch: pytest.MonkeyPatch,
    ) -> None:
        rows = [
            _budget_row("b-old", "cat-x", "2026-01-01", ""),
            _budget_row("b-new", "cat-x", "2026-02-01", ""),
        ]
        monkeypatch.setattr(budgets, "read_csv", lambda _path: rows)
        out = budgets.list_budgets_as_of(
            as_of="2026-03-15",
            budget_plan_id=PLAN_ID,
        )
        assert len(out) == 1
        assert out[0]["id"] == "b-new"
        assert out[0]["start_date"] == "2026-02-01"

    def test_empty_end_date_treated_as_current(self, monkeypatch: pytest.MonkeyPatch) -> None:
        rows = [_budget_row("b1", "cat-a", "2026-01-01", "")]
        monkeypatch.setattr(budgets, "read_csv", lambda _path: rows)
        out = budgets.list_budgets_as_of(
            as_of="2026-12-31",
            budget_plan_id=PLAN_ID,
        )
        assert len(out) == 1

    def test_no_budgets(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.setattr(budgets, "read_csv", lambda _path: [])
        assert budgets.list_budgets_as_of(
            as_of="2026-01-01",
            budget_plan_id=PLAN_ID,
        ) == []
