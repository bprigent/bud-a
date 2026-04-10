"""Utility module for reading and writing CSV files safely with file locking."""

import csv
import fcntl
import os
import uuid
from pathlib import Path
from typing import Any

# Override for isolated / E2E runs: BUD_DATA_DIR=/path/to/data
_env_data = os.environ.get("BUD_DATA_DIR")
DATA_DIR = (
    Path(_env_data).resolve()
    if _env_data
    else Path(__file__).resolve().parent.parent / "data"
)

HEADERS: dict[str, list[str]] = {
    "members.csv": ["id", "first_name", "last_name", "email", "phone", "color"],
    "accounts.csv": [
        "id",
        "member_id",
        "bank_name",
        "account_number",
        "nickname",
        "type",
        "currency",
        "opening_balance",
        "opening_balance_date",
        "statement_balance",
        "statement_date",
        "logo",
        "image_url",
        "is_savings",
    ],
    "categories.csv": ["id", "name", "emoji", "description"],
    "operations.csv": [
        "id", "type", "date", "member_id", "from_account_id", "to_account_id",
        "label", "category_id", "amount", "currency",
    ],
    "budget_plans.csv": ["id", "name", "kind"],
    "budgets.csv": [
        "id",
        "budget_plan_id",
        "category_id",
        "amount",
        "currency",
        "period",
        "start_date",
        "end_date",
    ],
}


def ensure_file(filename: str) -> Path:
    """Ensure the CSV file exists with proper headers."""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(HEADERS[filename])
    return filepath


def generate_id() -> str:
    """Generate a new UUID for a record."""
    return str(uuid.uuid4())


def read_csv(filename: str) -> list[dict[str, str]]:
    """Read all rows from a CSV file and return as a list of dicts."""
    filepath = ensure_file(filename)
    headers = HEADERS.get(filename)
    with open(filepath, "r", newline="") as f:
        fcntl.flock(f, fcntl.LOCK_SH)
        try:
            reader = csv.DictReader(f)
            file_fieldnames = reader.fieldnames
            rows = list(reader)
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)

    if not headers:
        return rows

    pad = {h: "" for h in headers}
    norm_rows: list[dict[str, str]] = []
    for r in rows:
        merged = {**pad}
        for k, v in r.items():
            if k in headers:
                merged[k] = "" if v is None else str(v)
        norm_rows.append(merged)

    return norm_rows


def _lock_path(filename: str) -> Path:
    """Return the advisory lock file path for a CSV."""
    return DATA_DIR / (filename + ".lock")


def _write_all(filename: str, rows: list[dict[str, str]]) -> None:
    """Overwrite the entire CSV with the given rows (atomic)."""
    filepath = ensure_file(filename)
    headers = HEADERS[filename]
    lock = _lock_path(filename)
    lock.touch(exist_ok=True)
    with open(lock, "r") as lf:
        fcntl.flock(lf, fcntl.LOCK_EX)
        try:
            tmp = filepath.with_suffix(".tmp")
            with open(tmp, "w", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=headers)
                writer.writeheader()
                writer.writerows(rows)
            os.replace(tmp, filepath)
        finally:
            fcntl.flock(lf, fcntl.LOCK_UN)


def write_row(filename: str, row_dict: dict[str, Any]) -> dict[str, str]:
    """Append a new row to a CSV file. Returns the written row."""
    filepath = ensure_file(filename)
    headers = HEADERS[filename]
    sanitized: dict[str, str] = {h: str(row_dict.get(h, "")) for h in headers}
    lock = _lock_path(filename)
    lock.touch(exist_ok=True)
    with open(lock, "r") as lf:
        fcntl.flock(lf, fcntl.LOCK_EX)
        try:
            with open(filepath, "a", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=headers)
                writer.writerow(sanitized)
        finally:
            fcntl.flock(lf, fcntl.LOCK_UN)
    return sanitized


def update_row(
    filename: str, row_id: str, updates: dict[str, Any]
) -> dict[str, str] | None:
    """Update a row by id. Returns the updated row or None if not found."""
    headers = HEADERS[filename]
    rows = read_csv(filename)
    updated_row: dict[str, str] | None = None
    for row in rows:
        if row["id"] == row_id:
            for key, value in updates.items():
                if key in headers and key != "id":
                    row[key] = str(value)
            updated_row = row
            break
    if updated_row is None:
        return None
    _write_all(filename, rows)
    return updated_row


def delete_row(filename: str, row_id: str) -> bool:
    """Remove a row by id. Returns True if found and deleted."""
    rows = read_csv(filename)
    new_rows = [r for r in rows if r["id"] != row_id]
    if len(new_rows) == len(rows):
        return False
    _write_all(filename, new_rows)
    return True


def get_row_by_id(filename: str, row_id: str) -> dict[str, str] | None:
    """Get a single row by id."""
    rows = read_csv(filename)
    for row in rows:
        if row["id"] == row_id:
            return row
    return None


def validate_foreign_key(filename: str, field: str, value: str) -> bool:
    """Check that a foreign key value exists in the referenced table."""
    rows = read_csv(filename)
    return any(row[field] == value for row in rows)


def safe_int(value: str | int | None) -> int:
    """Convert a value to int, returning 0 on failure."""
    try:
        return int(value)  # type: ignore[arg-type]
    except (ValueError, TypeError):
        return 0
