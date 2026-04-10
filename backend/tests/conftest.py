"""Shared fixtures for Bud-A backend tests."""

import pytest


@pytest.fixture
def sample_member_id() -> str:
    return "11111111-1111-1111-1111-111111111111"


@pytest.fixture
def sample_category_id() -> str:
    return "22222222-2222-2222-2222-222222222222"


@pytest.fixture
def sample_account_id() -> str:
    return "33333333-3333-3333-3333-333333333333"


@pytest.fixture
def sample_other_account_id() -> str:
    return "44444444-4444-4444-4444-444444444444"


@pytest.fixture
def sample_operations(
    sample_member_id: str,
    sample_category_id: str,
    sample_account_id: str,
    sample_other_account_id: str,
) -> list[dict[str, str]]:
    return [
        {
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "date": "2026-03-15",
            "type": "expense",
            "amount": "5000",
            "from_account_id": sample_account_id,
            "to_account_id": "",
            "category_id": sample_category_id,
            "member_id": sample_member_id,
        },
        {
            "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "date": "2026-03-20",
            "type": "income",
            "amount": "10000",
            "from_account_id": "",
            "to_account_id": sample_account_id,
            "category_id": sample_category_id,
            "member_id": sample_member_id,
        },
    ]


@pytest.fixture
def sample_accounts(sample_account_id: str) -> list[dict[str, str]]:
    return [
        {
            "id": sample_account_id,
            "nickname": "Checking",
            "bank_name": "Test Bank",
            "member_id": "",
            "currency": "USD",
            "opening_balance": "",
            "opening_balance_date": "",
            "statement_balance": "",
            "statement_date": "",
            "logo": "",
            "image_url": "",
        }
    ]


@pytest.fixture
def sample_categories(sample_category_id: str) -> list[dict[str, str]]:
    return [
        {
            "id": sample_category_id,
            "name": "Groceries",
        }
    ]


@pytest.fixture
def sample_members(sample_member_id: str) -> list[dict[str, str]]:
    return [
        {
            "id": sample_member_id,
            "first_name": "Alex",
            "last_name": "Tester",
        }
    ]


@pytest.fixture
def sample_budget_plan_id() -> str:
    return "dddddddd-dddd-dddd-dddd-dddddddddddd"


@pytest.fixture
def sample_budgets(sample_category_id: str, sample_budget_plan_id: str) -> list[dict[str, str]]:
    return [
        {
            "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
            "budget_plan_id": sample_budget_plan_id,
            "category_id": sample_category_id,
            "amount": "50000",
            "currency": "USD",
            "period": "monthly",
            "start_date": "2026-01-01",
            "end_date": "",
        }
    ]
