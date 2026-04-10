---
paths:
  - "data/**"
---

# Data Safety Rules

- NEVER delete or overwrite existing CSV data without explicit user confirmation
- Always append new records rather than rewriting entire files when possible
- Create a backup before any bulk data modification
- Validate CSV structure before writing (correct number of columns, proper headers)
- Store amounts as integers (cents) to avoid floating-point precision issues
- Use ISO 8601 dates (YYYY-MM-DD) consistently
- Every new row must have a UUID `id` — generate with `uuid.uuid4()` (Python) or `crypto.randomUUID()` (JS)
- Validate foreign keys before writing: `member_id` must exist in members.csv, `account_id` in accounts.csv, `category_id` in categories.csv
- When updating a budget, never delete the old row — set its `end_date` and create a new row
- Currency must be a valid ISO 4217 code
