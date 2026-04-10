---
name: new-endpoint
description: Scaffold a new FastAPI CRUD router with Pydantic models and CSV integration
argument-hint: [resource-name]
disable-model-invocation: true
---

# New Endpoint Scaffolder

Create a complete CRUD router for a new resource in the budget app backend.

## Steps

1. **Read existing patterns** — look at `backend/routers/operations.py` and `backend/csv_utils.py`

2. **Define the CSV schema** — add headers to the `HEADERS` dict in `backend/csv_utils.py`:
   ```python
   "$ARGUMENTS.csv": ["id", ...],
   ```

3. **Create the router** at `backend/routers/$ARGUMENTS.py`:
   - Import from `csv_utils`: `read_csv`, `write_row`, `update_row`, `delete_row`, `get_row_by_id`, `generate_id`, `validate_foreign_key`
   - Define `ResourceCreate(BaseModel)` with required fields
   - Define `ResourceUpdate(BaseModel)` with all fields optional (`None`)
   - Create a foreign key validation helper if needed
   - Implement 5 endpoints:
     - `GET /` — list all, with optional query filters
     - `GET /{id}` — get single by id
     - `POST /` — create (validate FKs, generate UUID, return 201)
     - `PUT /{id}` — partial update (validate FKs)
     - `DELETE /{id}` — delete by id
   - Use `APIRouter(prefix="/api/$ARGUMENTS", tags=["$ARGUMENTS"])`

4. **Register the router** in `backend/main.py`:
   ```python
   from routers import $ARGUMENTS
   app.include_router($ARGUMENTS.router)
   ```

5. **Add API functions** in `frontend/src/api.js` if the frontend needs to call these endpoints

## Conventions

- Amounts are integers in cents
- Dates are ISO 8601 strings
- Currency defaults to `"EUR"`
- Every record has a UUID `id` column
- Validate all foreign keys before writing
- Type hints on every function signature
- Docstrings on every endpoint
