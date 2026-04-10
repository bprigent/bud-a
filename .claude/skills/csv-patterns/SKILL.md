---
name: csv-patterns
description: CSV data layer patterns for this budget app. Use when reading, writing, or modifying CSV files in backend/ or data/.
user-invocable: false
---

# CSV Data Patterns

This app uses local CSV files in `data/` as its data store — no database. All CSV operations go through `backend/csv_utils.py`.

## Core Functions

| Function | Purpose |
|---|---|
| `read_csv(filename)` | Read all rows as `list[dict[str, str]]` with shared file lock |
| `write_row(filename, row_dict)` | Append one row with exclusive lock |
| `update_row(filename, row_id, updates)` | Update fields by id (reads all, rewrites file) |
| `delete_row(filename, row_id)` | Remove row by id (reads all, rewrites without row) |
| `get_row_by_id(filename, row_id)` | Find single row by id |
| `validate_foreign_key(filename, field, value)` | Check a FK reference exists |
| `generate_id()` | Create a new UUID string |

## File Locking

- Reads use `fcntl.LOCK_SH` (shared lock — multiple concurrent reads OK)
- Writes use `fcntl.LOCK_EX` (exclusive lock — blocks other reads/writes)
- Always use the `csv_utils` functions — never read/write CSV files directly

## Data Conventions

- All values stored as strings in CSV
- Amounts stored as integer cents (`2500` = $25.00)
- Dates as ISO 8601 (`YYYY-MM-DD`)
- Currency as ISO 4217 (`EUR`, `USD`)
- IDs are UUIDs
- Empty string `""` means null/not set

## Adding a New Table

1. Add headers to `HEADERS` dict in `csv_utils.py`
2. The file auto-creates with headers on first access (`_ensure_file`)
3. Create a router in `backend/routers/`
4. Register it in `backend/main.py`

## Common Pitfalls

- **Don't parse amounts as float** — always `int()`. Amounts are cents
- **Don't manually split CSV lines** — always use `csv` module via `csv_utils`
- **Don't forget file locking** — concurrent access from API + CLI agent can corrupt data
- **Don't delete budget rows** — set `end_date` and create a new row instead
- **Don't log amounts** — security rule: no financial data in logs

## Filtering Pattern

CSV has no query engine. Filter in Python after reading:

```python
rows = read_csv("operations.csv")
# Filter by month
filtered = [r for r in rows if r["date"].startswith("2026-03")]
# Filter by foreign key
filtered = [r for r in rows if r["category_id"] == some_id]
```

## Joining Tables

Build lookup dicts for efficient joins:

```python
categories = read_csv("categories.csv")
cat_map = {c["id"]: c["name"] for c in categories}

operations = read_csv("operations.csv")
for e in operations:
    e["category_name"] = cat_map.get(e["category_id"], "Unknown")
```
