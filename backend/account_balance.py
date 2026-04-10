"""Derive account balances from operations plus optional opening / statement snapshots."""

from __future__ import annotations

from typing import Any

from csv_utils import safe_int


def account_operation_effect(operation: dict[str, Any], account_id: str) -> int:
    """Signed cents this operation applies to ``account_id`` (0 if none)."""
    amt = safe_int(operation.get("amount"))
    if amt == 0:
        return 0
    from_id = (operation.get("from_account_id") or "").strip()
    to_id = (operation.get("to_account_id") or "").strip()
    typ = (operation.get("type") or "").strip()

    if typ == "expense" and from_id == account_id:
        return -amt
    if typ == "income" and to_id == account_id:
        return amt
    if typ == "money_movement":
        if from_id == account_id:
            return -amt
        if to_id == account_id:
            return amt
    return 0


def derived_balance_for_account(
    account: dict[str, str],
    operations: list[dict[str, str]],
) -> int:
    """Current balance in cents.

    If ``opening_balance_date`` is set: ``opening_balance`` (cents) at the start of
    that date plus all operation effects on or after that date.

    Otherwise: sum of operation effects over all time (no opening term).
    """
    aid = account["id"]
    cutoff = (account.get("opening_balance_date") or "").strip()
    opening = safe_int(account.get("opening_balance"))

    total = 0
    for o in operations:
        if cutoff and (o.get("date") or "") < cutoff:
            continue
        total += account_operation_effect(o, aid)

    if cutoff:
        return opening + total
    return total


def statement_variance(derived_cents: int, account: dict[str, str]) -> int | None:
    """``derived - statement`` if a statement balance is stored, else ``None``."""
    raw = (account.get("statement_balance") or "").strip()
    if raw == "":
        return None
    return derived_cents - safe_int(raw)
