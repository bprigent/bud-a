"""Fixtures for API end-to-end tests (real CSV I/O, isolated temp data dir)."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

import csv_utils
import watcher as watcher_mod
from routers import matching_rules as matching_rules_mod


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch, tmp_path) -> TestClient:
    """FastAPI TestClient with CSV data under ``tmp_path`` (no real ``data/`` writes)."""
    monkeypatch.setattr(csv_utils, "DATA_DIR", tmp_path)
    monkeypatch.setattr(watcher_mod, "DATA_DIR", tmp_path)
    monkeypatch.setattr(watcher_mod, "start_watcher", lambda: None)

    skill_dir = tmp_path / "_skill_expense_matching"
    skill_dir.mkdir()
    monkeypatch.setattr(matching_rules_mod, "SKILL_DIR", skill_dir)
    monkeypatch.setattr(matching_rules_mod, "SKILL_FILE", skill_dir / "SKILL.md")

    from csv_utils import HEADERS, _write_all

    for fname in HEADERS:
        _write_all(fname, [])

    # Import app after DATA_DIR and skill paths are patched
    from main import app

    with TestClient(app) as c:
        yield c
