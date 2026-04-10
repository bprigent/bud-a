"""End-to-end API tests: full stack except a real browser (CSV + HTTP + WebSocket).

Covers routes not exercised by mocked unit tests: CRUD, FK validation, reports,
budget history, matching rules, and error paths."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

pytestmark = pytest.mark.e2e


def test_full_household_flow(client: TestClient) -> None:
    """Create member → category → account → expense → reports → budget → matching rule."""
    r = client.post(
        "/api/members/",
        json={
            "first_name": "Jamie",
            "last_name": "Budget",
            "email": "j@example.com",
            "phone": "",
            "color": "#abc",
        },
    )
    assert r.status_code == 201
    member = r.json()
    mid = member["id"]

    r = client.post(
        "/api/categories/",
        json={"name": "Groceries", "emoji": "🛒", "description": "Food"},
    )
    assert r.status_code == 201
    cat = r.json()
    cid = cat["id"]

    r = client.post(
        "/api/accounts/",
        json={
            "member_id": mid,
            "bank_name": "Test Bank",
            "account_number": "123",
            "nickname": "Checking",
            "currency": "USD",
            "opening_balance": 0,
        },
    )
    assert r.status_code == 201
    acc = r.json()
    aid = acc["id"]

    r = client.post(
        "/api/operations/",
        json={
            "type": "expense",
            "date": "2026-03-15",
            "member_id": mid,
            "from_account_id": aid,
            "to_account_id": "",
            "label": "Supermarket",
            "category_id": cid,
            "amount": 4599,
            "currency": "USD",
        },
    )
    assert r.status_code == 201
    op = r.json()
    oid = op["id"]

    rep = client.get("/api/reports/monthly", params={"month": "2026-03"})
    assert rep.status_code == 200
    body = rep.json()
    assert body["total_expenses"] == 4599
    assert body["net"] == -4599
    assert "transfers" in body
    assert isinstance(body["transfers"], list)
    assert body["total_transfers"] == 0
    assert any(x["category_id"] == cid for x in body["expenses_by_category"])

    bal = client.get("/api/reports/account-balances")
    assert bal.status_code == 200
    rows = bal.json()["accounts"]
    assert len(rows) == 1
    assert rows[0]["balance"] == -4599

    plans = client.get("/api/budget-plans/").json()
    assert len(plans) >= 1
    plan_id = next(p["id"] for p in plans if p.get("name") == "Monthly budget")

    r = client.post(
        "/api/budgets/",
        json={
            "budget_plan_id": plan_id,
            "category_id": cid,
            "amount": 50000,
            "currency": "USD",
            "period": "monthly",
            "start_date": "2026-03-01",
            "end_date": "",
        },
    )
    assert r.status_code == 201
    budget = r.json()
    bid = budget["id"]

    cur = client.get("/api/budgets/current")
    assert cur.status_code == 200
    assert len(cur.json()) == 1

    as_of = client.get("/api/budgets/as-of", params={"as_of": "2026-03-20"})
    assert as_of.status_code == 200
    assert len(as_of.json()) == 1

    rule = client.post(
        "/api/matching-rules/",
        json={"category_id": cid, "pattern": "WHOLE FOODS"},
    )
    assert rule.status_code == 201
    rid = rule.json()["id"]

    rules = client.get("/api/matching-rules/")
    assert rules.status_code == 200
    assert len(rules.json()) == 1

    # Cleanup reads
    assert client.get(f"/api/members/{mid}").status_code == 200
    assert client.get(f"/api/categories/{cid}").status_code == 200
    assert client.get(f"/api/accounts/{aid}").status_code == 200
    assert client.get(f"/api/operations/{oid}").status_code == 200
    assert client.get(f"/api/budgets/{bid}").status_code == 200

    assert client.delete(f"/api/matching-rules/{rid}").status_code == 200
    assert client.delete(f"/api/operations/{oid}").status_code == 200
    assert client.delete(f"/api/budgets/{bid}").status_code == 200
    assert client.delete(f"/api/accounts/{aid}").status_code == 200
    assert client.delete(f"/api/categories/{cid}").status_code == 200
    assert client.delete(f"/api/members/{mid}").status_code == 200


def test_operations_list_filters(client: TestClient) -> None:
    """Create rows and exercise list query params."""
    m = client.post(
        "/api/members/",
        json={
            "first_name": "A",
            "last_name": "B",
            "email": "a@b.c",
        },
    ).json()
    c = client.post("/api/categories/", json={"name": "Cat"}).json()
    a = client.post(
        "/api/accounts/",
        json={
            "member_id": m["id"],
            "bank_name": "B",
            "account_number": "1",
        },
    ).json()
    client.post(
        "/api/operations/",
        json={
            "type": "expense",
            "date": "2026-04-10",
            "member_id": m["id"],
            "from_account_id": a["id"],
            "label": "x",
            "category_id": c["id"],
            "amount": 100,
        },
    )
    r = client.get("/api/operations/", params={"month": "2026-04"})
    assert r.status_code == 200
    assert len(r.json()) == 1
    r = client.get(
        "/api/operations/",
        params={"member_id": m["id"], "category_id": c["id"], "account_id": a["id"]},
    )
    assert len(r.json()) == 1


def test_category_delete_blocked_when_referenced(client: TestClient) -> None:
    m = client.post(
        "/api/members/",
        json={"first_name": "A", "last_name": "B", "email": "a@b.c"},
    ).json()
    c = client.post("/api/categories/", json={"name": "Cat"}).json()
    a = client.post(
        "/api/accounts/",
        json={
            "member_id": m["id"],
            "bank_name": "B",
            "account_number": "1",
        },
    ).json()
    client.post(
        "/api/operations/",
        json={
            "type": "expense",
            "date": "2026-01-01",
            "member_id": m["id"],
            "from_account_id": a["id"],
            "label": "x",
            "category_id": c["id"],
            "amount": 1,
        },
    )
    r = client.delete(f"/api/categories/{c['id']}")
    assert r.status_code == 409
    assert "operations" in r.json()["detail"]


def test_budget_amount_update_closes_old_row(client: TestClient) -> None:
    c = client.post("/api/categories/", json={"name": "Bud"}).json()
    plan_id = next(p["id"] for p in client.get("/api/budget-plans/").json() if p.get("name") == "Monthly budget")
    r = client.post(
        "/api/budgets/",
        json={
            "budget_plan_id": plan_id,
            "category_id": c["id"],
            "amount": 10000,
            "currency": "EUR",
            "start_date": "2026-01-01",
            "end_date": "",
        },
    )
    assert r.status_code == 201
    bid = r.json()["id"]

    r2 = client.put(f"/api/budgets/{bid}", json={"amount": 20000})
    assert r2.status_code == 200
    new_id = r2.json()["id"]
    assert new_id != bid

    all_b = client.get("/api/budgets/")
    assert len(all_b.json()) == 2


def test_invalid_operation_foreign_keys(client: TestClient) -> None:
    r = client.post(
        "/api/operations/",
        json={
            "type": "expense",
            "date": "2026-01-01",
            "member_id": "00000000-0000-0000-0000-000000000001",
            "label": "x",
            "category_id": "00000000-0000-0000-0000-000000000002",
            "amount": 1,
        },
    )
    assert r.status_code == 400


def test_websocket_accepts_connection(client: TestClient) -> None:
    with client.websocket_connect("/ws") as ws:
        ws.send_text("ping")


def test_404_paths(client: TestClient) -> None:
    fake = "00000000-0000-0000-0000-000000000099"
    assert client.get(f"/api/members/{fake}").status_code == 404
    assert client.get(f"/api/categories/{fake}").status_code == 404
    assert client.get(f"/api/accounts/{fake}").status_code == 404
    assert client.get(f"/api/operations/{fake}").status_code == 404
    assert client.get(f"/api/budgets/{fake}").status_code == 404
