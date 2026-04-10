---
name: fastapi-patterns
description: FastAPI patterns and conventions for this budget app backend. Use when creating or modifying API endpoints in backend/.
user-invocable: false
---

# FastAPI Patterns

## Router Structure

Every resource gets its own file in `backend/routers/` with a standard layout:

```python
"""Docstring describing these endpoints."""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from csv_utils import (
    delete_row, generate_id, get_row_by_id,
    read_csv, update_row, validate_foreign_key, write_row,
)

router = APIRouter(prefix="/api/<resource>", tags=["<resource>"])
CSV_FILE = "<resource>.csv"
```

## Pydantic Models

Two models per resource:

```python
class ResourceCreate(BaseModel):
    """Fields required to create a new record."""
    date: str
    member_id: str
    amount: int
    currency: str = "USD"  # change to your local currency (ISO 4217); defaults for optional fields

class ResourceUpdate(BaseModel):
    """All fields optional for partial updates."""
    date: str | None = None
    member_id: str | None = None
    amount: int | None = None
    currency: str | None = None
```

Use `model_dump(exclude_none=True)` to get only the fields the user sent.

## Standard Endpoints

Every CRUD router implements these 5 endpoints:

| Method | Path | Status | Returns |
|---|---|---|---|
| GET | `/` | 200 | `list[dict]` with optional query filters |
| GET | `/{id}` | 200 / 404 | Single `dict` |
| POST | `/` | 201 | Created `dict` |
| PUT | `/{id}` | 200 / 404 | Updated `dict` |
| DELETE | `/{id}` | 200 / 404 | `{"detail": "... deleted"}` |

## Foreign Key Validation

Always validate before writing. Use a helper function:

```python
def _validate_fks(
    member_id: str | None = None,
    account_id: str | None = None,
    category_id: str | None = None,
) -> None:
    if member_id and not validate_foreign_key("members.csv", "id", member_id):
        raise HTTPException(status_code=400, detail="Invalid member_id")
    # ... same for other FKs
```

## Query Filters

Use `Query` parameters for list endpoints:

```python
@router.get("/")
def list_items(
    month: str | None = Query(None, description="Filter by YYYY-MM"),
    member_id: str | None = Query(None),
) -> list[dict[str, str]]:
    rows = read_csv(CSV_FILE)
    if month:
        rows = [r for r in rows if r["date"].startswith(month)]
    if member_id:
        rows = [r for r in rows if r["member_id"] == member_id]
    return rows
```

## Error Handling

- 400 for validation failures (bad FK, empty update, invalid data)
- 404 for missing records
- Always use `HTTPException` with a descriptive `detail` message
- Never expose financial amounts in error messages

## WebSocket Integration

The file watcher (`backend/watcher.py`) automatically detects CSV changes and notifies connected WebSocket clients. No extra code needed — just write to CSV via `csv_utils` and the frontend refreshes automatically.

## Testing

Run backend tests with `cd backend && pytest`. Test each endpoint:
- Happy path (create, read, update, delete)
- 404 on missing IDs
- 400 on invalid foreign keys
- Filter parameters work correctly
