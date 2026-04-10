"""Tests for account_balance.py — pure financial math, no I/O."""

import pytest

from csv_utils import safe_int
from account_balance import (
    account_operation_effect,
    derived_balance_for_account,
    statement_variance,
)


class TestSafeInt:
    def test_valid_string(self) -> None:
        assert safe_int("2063") == 2063

    def test_valid_int(self) -> None:
        assert safe_int(2063) == 2063

    def test_empty_string(self) -> None:
        assert safe_int("") == 0

    def test_none(self) -> None:
        assert safe_int(None) == 0

    def test_float_string(self) -> None:
        assert safe_int("20.63") == 0

    def test_non_numeric(self) -> None:
        assert safe_int("abc") == 0


class TestAccountOperationEffect:
    def test_expense_from_matching_account(self) -> None:
        op = {
            "type": "expense",
            "amount": "100",
            "from_account_id": "a1",
            "to_account_id": "",
        }
        assert account_operation_effect(op, "a1") == -100

    def test_expense_from_other_account(self) -> None:
        op = {
            "type": "expense",
            "amount": "100",
            "from_account_id": "other",
            "to_account_id": "",
        }
        assert account_operation_effect(op, "a1") == 0

    def test_income_to_matching_account(self) -> None:
        op = {
            "type": "income",
            "amount": "250",
            "from_account_id": "",
            "to_account_id": "a1",
        }
        assert account_operation_effect(op, "a1") == 250

    def test_income_to_other_account(self) -> None:
        op = {
            "type": "income",
            "amount": "250",
            "from_account_id": "",
            "to_account_id": "other",
        }
        assert account_operation_effect(op, "a1") == 0

    def test_money_movement_from_account(self) -> None:
        op = {
            "type": "money_movement",
            "amount": "300",
            "from_account_id": "a1",
            "to_account_id": "a2",
        }
        assert account_operation_effect(op, "a1") == -300

    def test_money_movement_to_account(self) -> None:
        op = {
            "type": "money_movement",
            "amount": "300",
            "from_account_id": "a1",
            "to_account_id": "a2",
        }
        assert account_operation_effect(op, "a2") == 300

    def test_money_movement_unrelated_account(self) -> None:
        op = {
            "type": "money_movement",
            "amount": "300",
            "from_account_id": "a1",
            "to_account_id": "a2",
        }
        assert account_operation_effect(op, "a9") == 0

    def test_zero_amount_operation(self) -> None:
        op = {
            "type": "expense",
            "amount": "0",
            "from_account_id": "a1",
            "to_account_id": "",
        }
        assert account_operation_effect(op, "a1") == 0

    def test_missing_blank_account_fields(self) -> None:
        op = {
            "type": "expense",
            "amount": "50",
            "from_account_id": "",
            "to_account_id": "",
        }
        assert account_operation_effect(op, "a1") == 0

    def test_whitespace_in_account_id_stripped(self) -> None:
        op = {
            "type": "expense",
            "amount": "77",
            "from_account_id": "  a1  ",
            "to_account_id": "",
        }
        assert account_operation_effect(op, "a1") == -77


class TestDerivedBalanceForAccount:
    def test_no_opening_multiple_expenses(self) -> None:
        acc = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        ops = [
            {"type": "expense", "amount": "100", "from_account_id": "a1", "date": "2026-01-01"},
            {"type": "expense", "amount": "200", "from_account_id": "a1", "date": "2026-01-02"},
        ]
        assert derived_balance_for_account(acc, ops) == -300

    def test_no_opening_mixed_ops(self) -> None:
        acc = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        ops = [
            {"type": "income", "amount": "5000", "to_account_id": "a1", "date": "2026-01-01"},
            {"type": "expense", "amount": "1000", "from_account_id": "a1", "date": "2026-01-02"},
        ]
        assert derived_balance_for_account(acc, ops) == 4000

    def test_opening_balance_date_ops_before_cutoff_ignored(self) -> None:
        acc = {
            "id": "a1",
            "opening_balance": "100000",
            "opening_balance_date": "2026-03-01",
        }
        ops = [
            {"type": "expense", "amount": "5000", "from_account_id": "a1", "date": "2026-02-28"},
            {"type": "expense", "amount": "3000", "from_account_id": "a1", "date": "2026-03-05"},
        ]
        assert derived_balance_for_account(acc, ops) == 100000 - 3000

    def test_opening_balance_date_ops_on_exact_cutoff_included(self) -> None:
        acc = {
            "id": "a1",
            "opening_balance": "0",
            "opening_balance_date": "2026-03-01",
        }
        ops = [
            {"type": "expense", "amount": "100", "from_account_id": "a1", "date": "2026-03-01"},
        ]
        assert derived_balance_for_account(acc, ops) == -100

    def test_opening_balance_date_all_ops_before_cutoff(self) -> None:
        acc = {
            "id": "a1",
            "opening_balance": "50000",
            "opening_balance_date": "2026-06-01",
        }
        ops = [
            {"type": "expense", "amount": "9999", "from_account_id": "a1", "date": "2026-05-31"},
        ]
        assert derived_balance_for_account(acc, ops) == 50000

    def test_opening_zero_one_expense(self) -> None:
        acc = {"id": "a1", "opening_balance": "0", "opening_balance_date": ""}
        ops = [
            {"type": "expense", "amount": "42", "from_account_id": "a1", "date": "2026-01-01"},
        ]
        assert derived_balance_for_account(acc, ops) == -42

    def test_empty_operations_no_opening(self) -> None:
        acc = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        assert derived_balance_for_account(acc, []) == 0

    def test_empty_operations_with_opening(self) -> None:
        acc = {
            "id": "a1",
            "opening_balance": "12345",
            "opening_balance_date": "2026-01-01",
        }
        assert derived_balance_for_account(acc, []) == 12345

    def test_account_with_no_transactions(self) -> None:
        acc = {"id": "z1", "opening_balance": "", "opening_balance_date": ""}
        ops = [
            {"type": "expense", "amount": "10", "from_account_id": "other", "date": "2026-01-01"},
        ]
        assert derived_balance_for_account(acc, ops) == 0

    def test_large_amounts_no_overflow(self) -> None:
        acc = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        big = str(10**12)
        ops = [
            {"type": "income", "amount": big, "to_account_id": "a1", "date": "2026-01-01"},
            {"type": "income", "amount": big, "to_account_id": "a1", "date": "2026-01-02"},
        ]
        assert derived_balance_for_account(acc, ops) == 2 * 10**12


class TestStatementVariance:
    def test_no_statement_balance_set(self) -> None:
        acc = {"statement_balance": ""}
        assert statement_variance(1000, acc) is None

    def test_derived_equals_statement(self) -> None:
        acc = {"statement_balance": "5000"}
        assert statement_variance(5000, acc) == 0

    def test_derived_greater_than_statement(self) -> None:
        acc = {"statement_balance": "4000"}
        assert statement_variance(5000, acc) == 1000

    def test_derived_less_than_statement(self) -> None:
        acc = {"statement_balance": "6000"}
        assert statement_variance(5000, acc) == -1000

    def test_statement_balance_whitespace_only(self) -> None:
        acc = {"statement_balance": "   "}
        assert statement_variance(100, acc) is None

    def test_statement_balance_zero(self) -> None:
        acc = {"statement_balance": "0"}
        assert statement_variance(5000, acc) == 5000


class TestOpeningBalanceEqualization:
    """Verify that adding an opening-balance income operation on a chosen date
    produces the expected current (derived) balance for the account.

    This mirrors the real workflow: the user knows the true bank balance today,
    so we back-calculate the income operation amount needed on Jan 1st so that
    ``derived_balance_for_account`` equals the target.
    """

    @staticmethod
    def _make_op(
        typ: str,
        amount: int,
        date: str,
        from_id: str = "",
        to_id: str = "",
    ) -> dict[str, str]:
        return {
            "type": typ,
            "amount": str(amount),
            "from_account_id": from_id,
            "to_account_id": to_id,
            "date": date,
        }

    def test_opening_plus_expenses_equals_target(self) -> None:
        """opening_income − expenses == target_balance"""
        acc = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        target_cents = 11542177  # 115,421.77 EUR

        existing_ops = [
            self._make_op("expense", 500000, "2026-01-15", from_id="a1"),
            self._make_op("expense", 200000, "2026-02-10", from_id="a1"),
            self._make_op("income", 300000, "2026-02-28", to_id="a1"),
        ]
        # Net of existing ops: -500000 -200000 +300000 = -400000
        net_existing = sum(account_operation_effect(o, "a1") for o in existing_ops)
        assert net_existing == -400000

        # Required opening balance = target − net_existing
        opening_amount = target_cents - net_existing
        opening_op = self._make_op("income", opening_amount, "2026-01-01", to_id="a1")

        all_ops = [opening_op] + existing_ops
        assert derived_balance_for_account(acc, all_ops) == target_cents

    def test_opening_with_only_expenses(self) -> None:
        """Account with only outflows — opening must cover them all plus target."""
        acc = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        target_cents = 5000000  # 50,000.00 EUR

        existing_ops = [
            self._make_op("expense", 1000000, "2026-01-20", from_id="a1"),
            self._make_op("expense", 2000000, "2026-02-15", from_id="a1"),
        ]
        net_existing = sum(account_operation_effect(o, "a1") for o in existing_ops)
        opening_amount = target_cents - net_existing
        opening_op = self._make_op("income", opening_amount, "2026-01-01", to_id="a1")

        all_ops = [opening_op] + existing_ops
        assert derived_balance_for_account(acc, all_ops) == target_cents

    def test_opening_with_money_movements(self) -> None:
        """Money moving between accounts affects balance correctly."""
        acc = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        target_cents = 7500000

        existing_ops = [
            self._make_op("expense", 100000, "2026-01-10", from_id="a1"),
            self._make_op("money_movement", 500000, "2026-02-01", from_id="a1", to_id="a2"),
            self._make_op("money_movement", 200000, "2026-03-01", from_id="a2", to_id="a1"),
        ]
        # Net: -100000 -500000 +200000 = -400000
        net_existing = sum(account_operation_effect(o, "a1") for o in existing_ops)
        assert net_existing == -400000

        opening_amount = target_cents - net_existing
        opening_op = self._make_op("income", opening_amount, "2026-01-01", to_id="a1")

        all_ops = [opening_op] + existing_ops
        assert derived_balance_for_account(acc, all_ops) == target_cents

    def test_opening_when_account_has_no_operations(self) -> None:
        """Opening balance alone should equal target when no ops exist."""
        acc = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        target_cents = 9827634

        opening_op = self._make_op("income", target_cents, "2026-01-01", to_id="a1")
        assert derived_balance_for_account(acc, [opening_op]) == target_cents

    def test_opening_with_account_opening_balance_field(self) -> None:
        """When the account CSV already has an opening_balance, the income op
        must compensate for that as well."""
        acc = {
            "id": "a1",
            "opening_balance": "150000",
            "opening_balance_date": "2026-01-01",
        }
        target_cents = 3000000

        existing_ops = [
            self._make_op("expense", 50000, "2026-01-15", from_id="a1"),
        ]
        # derived = 150000 + opening_op_effect + (-50000) should == 3000000
        # opening_op_effect = 3000000 - 150000 - (-50000) = 2900000
        csv_opening = 150000
        net_existing = sum(account_operation_effect(o, "a1") for o in existing_ops)
        opening_amount = target_cents - csv_opening - net_existing

        opening_op = self._make_op("income", opening_amount, "2026-01-01", to_id="a1")
        all_ops = [opening_op] + existing_ops
        assert derived_balance_for_account(acc, all_ops) == target_cents

    def test_multiple_accounts_independent(self) -> None:
        """Opening balance for one account doesn't affect another."""
        acc_a = {"id": "a1", "opening_balance": "", "opening_balance_date": ""}
        acc_b = {"id": "a2", "opening_balance": "", "opening_balance_date": ""}
        target_a = 10000000
        target_b = 5000000

        shared_ops = [
            self._make_op("money_movement", 300000, "2026-02-01", from_id="a1", to_id="a2"),
        ]

        net_a = sum(account_operation_effect(o, "a1") for o in shared_ops)
        net_b = sum(account_operation_effect(o, "a2") for o in shared_ops)

        opening_a = self._make_op("income", target_a - net_a, "2026-01-01", to_id="a1")
        opening_b = self._make_op("income", target_b - net_b, "2026-01-01", to_id="a2")

        all_ops = [opening_a, opening_b] + shared_ops
        assert derived_balance_for_account(acc_a, all_ops) == target_a
        assert derived_balance_for_account(acc_b, all_ops) == target_b

    def test_real_world_checking_account_scenario(self) -> None:
        """Simulates the actual case: checking account with many ops,
        target balance of 115,421.77 EUR."""
        acc = {"id": "chk1", "opening_balance": "", "opening_balance_date": ""}
        target_cents = 11542177

        existing_ops = [
            self._make_op("expense", 206300, "2026-01-22", from_id="chk1"),
            self._make_op("expense", 9300, "2026-01-22", from_id="chk1"),
            self._make_op("income", 450000, "2026-01-25", to_id="chk1"),
            self._make_op("expense", 150000, "2026-02-01", from_id="chk1"),
            self._make_op("expense", 89900, "2026-02-15", from_id="chk1"),
            self._make_op("money_movement", 500000, "2026-03-01", from_id="chk1", to_id="sav1"),
            self._make_op("income", 350000, "2026-03-15", to_id="chk1"),
        ]

        net_existing = sum(account_operation_effect(o, "chk1") for o in existing_ops)
        opening_amount = target_cents - net_existing
        opening_op = self._make_op("income", opening_amount, "2026-01-01", to_id="chk1")

        all_ops = [opening_op] + existing_ops
        assert derived_balance_for_account(acc, all_ops) == target_cents
