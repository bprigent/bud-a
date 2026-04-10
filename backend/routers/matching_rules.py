"""CRUD endpoints for category matching rules.

Rules map text patterns to categories. When rules change, the
expense-matching skill file is regenerated with all rules embedded.
"""

import fcntl
import json
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

import csv_utils
from csv_utils import read_csv

router = APIRouter(prefix="/api/matching-rules", tags=["matching-rules"])

_ROOT = Path(__file__).resolve().parent.parent.parent
SKILL_DIR = _ROOT / ".claude" / "skills" / "expense-matching"
SKILL_FILE = SKILL_DIR / "SKILL.md"


def _rules_path() -> Path:
    """Resolve at call time so tests can patch ``csv_utils.DATA_DIR``."""
    return csv_utils.DATA_DIR / "matching_rules.json"


class RuleCreate(BaseModel):
    category_id: str
    pattern: str


class RuleUpdate(BaseModel):
    category_id: str | None = None
    pattern: str | None = None


def _lock_path() -> Path:
    return _rules_path().parent / "matching_rules.json.lock"


def _read_rules() -> list[dict]:
    path = _rules_path()
    if not path.exists():
        return []
    lock = _lock_path()
    lock.touch(exist_ok=True)
    with open(lock, "r") as lf:
        fcntl.flock(lf, fcntl.LOCK_SH)
        try:
            with open(path, "r") as f:
                return json.load(f)
        finally:
            fcntl.flock(lf, fcntl.LOCK_UN)


def _write_rules(rules: list[dict]) -> None:
    path = _rules_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    lock = _lock_path()
    lock.touch(exist_ok=True)
    with open(lock, "r") as lf:
        fcntl.flock(lf, fcntl.LOCK_EX)
        try:
            tmp = path.with_suffix(".tmp")
            with open(tmp, "w") as f:
                json.dump(rules, f, indent=2)
            os.replace(tmp, path)
        finally:
            fcntl.flock(lf, fcntl.LOCK_UN)
    _regenerate_skill(rules)


def _regenerate_skill(rules: list[dict]) -> None:
    """Rebuild the expense-matching skill with all rules embedded."""
    categories = read_csv("categories.csv")
    cat_map = {c["id"]: c["name"] for c in categories}

    SKILL_DIR.mkdir(parents=True, exist_ok=True)

    lines = [
        "---",
        "name: expense-matching",
        "description: Auto-categorize expenses using matching rules and category descriptions",
        "user-invocable: false",
        "---",
        "",
        "# Expense Matching",
        "",
        "When categorizing a bank transaction or expense, follow this process:",
        "",
        "## Step 1: Check matching rules",
        "",
        "Check each pattern (case-insensitive) against the transaction label.",
        "Use the first match found.",
        "",
        "| Pattern | Category | Category ID |",
        "|---------|----------|-------------|",
    ]

    for rule in rules:
        cat_name = cat_map.get(rule["category_id"], "Unknown")
        lines.append(f"| `{rule['pattern']}` | {cat_name} | `{rule['category_id']}` |")

    if not rules:
        lines.append("| *(no rules configured)* | — | — |")

    lines.append("")
    lines.append("## Step 2: Use category descriptions")
    lines.append("")
    lines.append("If no matching rule applies, use the category descriptions below")
    lines.append("to infer the best category from the transaction label.")
    lines.append("")
    lines.append("| Category | Description | Category ID |")
    lines.append("|----------|-------------|-------------|")

    for c in categories:
        emoji = c.get("emoji", "")
        name = c.get("name", "")
        desc = c.get("description", "")
        lines.append(f"| {emoji} {name} | {desc} | `{c['id']}` |")

    lines.append("")
    lines.append("## Step 3: Ask the user")
    lines.append("")
    lines.append("If neither rules nor descriptions give a confident match, ask the user to pick a category.")
    lines.append("")

    with open(SKILL_FILE, "w") as f:
        f.write("\n".join(lines) + "\n")


@router.get("/")
def list_rules() -> list[dict]:
    """List all matching rules."""
    return _read_rules()


@router.post("/", status_code=201)
def create_rule(rule: RuleCreate) -> dict:
    """Create a new matching rule."""
    categories = read_csv("categories.csv")
    cat_ids = {c["id"] for c in categories}
    if rule.category_id not in cat_ids:
        raise HTTPException(status_code=400, detail="Invalid category_id")

    rules = _read_rules()
    new_rule = {
        "id": str(uuid.uuid4()),
        "category_id": rule.category_id,
        "pattern": rule.pattern.strip(),
    }
    rules.append(new_rule)
    _write_rules(rules)
    return new_rule


@router.patch("/{rule_id}")
def update_rule(rule_id: str, body: RuleUpdate) -> dict:
    """Update a matching rule (partial)."""
    categories = read_csv("categories.csv")
    cat_ids = {c["id"] for c in categories}

    rules = _read_rules()
    for i, r in enumerate(rules):
        if r["id"] != rule_id:
            continue
        new_cat = body.category_id if body.category_id is not None else r["category_id"]
        new_pat = body.pattern.strip() if body.pattern is not None else r["pattern"]
        if new_cat not in cat_ids:
            raise HTTPException(status_code=400, detail="Invalid category_id")
        if not new_pat:
            raise HTTPException(status_code=400, detail="Pattern cannot be empty")
        updated = {**r, "category_id": new_cat, "pattern": new_pat}
        rules[i] = updated
        _write_rules(rules)
        return updated

    raise HTTPException(status_code=404, detail="Rule not found")


@router.delete("/{rule_id}")
def delete_rule(rule_id: str) -> dict:
    """Delete a matching rule by id."""
    rules = _read_rules()
    new_rules = [r for r in rules if r["id"] != rule_id]
    if len(new_rules) == len(rules):
        raise HTTPException(status_code=404, detail="Rule not found")
    _write_rules(new_rules)
    return {"detail": "Rule deleted"}
