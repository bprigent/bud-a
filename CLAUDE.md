# Bud-A: AI-Powered Budget App

## Project Overview
A household budgeting system powered by Claude Code. Runs locally with a JS frontend, Python backend, and CSV-based data storage. The AI layer (this Claude Code agent) handles receipt parsing, spending categorization, and financial insights.

## Architecture
- **Frontend**: JavaScript (latest) — lives in `frontend/`
- **Backend**: Python — lives in `backend/`
- **Data**: CSV files stored locally in `data/` (not tracked by git)
- **AI Layer**: Claude Code agent in `.claude/`
- **Backup**: Asymmetric encryption (public key encrypts, private key decrypts)

## Build & Run Commands
- Frontend: `cd frontend && npm install && npm run dev`
- Backend: `cd backend && pip install -r requirements.txt && python main.py`
- Tests (frontend): `cd frontend && npm test`
- Tests (backend): `cd backend && pytest`

## Code Style
- Python: follow PEP 8, use type hints, prefer f-strings
- JavaScript: ES modules, 2-space indentation, async/await over callbacks
- Keep functions small and focused — one responsibility per function

## Data Conventions
- All financial data lives in `data/` as CSV files (see README.md for full schema)
- CSVs use headers on first row
- Every table has a UUID `id` column as primary key
- Tables are linked by foreign keys (e.g., `member_id`, `account_id`, `category_id`)
- Amounts are stored in cents (integers) to avoid floating-point issues
- Currency uses ISO 4217 codes (USD, EUR, etc.)
- Dates use ISO 8601 format (YYYY-MM-DD)
- Categories are managed in `data/categories.csv` — always reference by `category_id`, never by raw string
- 5 tables: members, accounts, categories, operations, budgets
- Operations have a `type` column: `expense`, `income`, or `money_movement`

## Git Rules
- Never commit the `data/` folder or any CSV financial data
- Never commit private keys or encryption secrets
- Frontend and backend folders are tracked
- Use descriptive commit messages

## Security
- No financial data in logs or error messages
- Backup files are encrypted before any cloud upload
- Private keys never leave the local machine

## Agent Guidelines
- When parsing receipts, extract: date, merchant, items, total, category, member, account
- Always look up categories in `data/categories.csv` — use existing ones before creating new
- Always confirm with the user before modifying financial data
- Round displayed amounts to 2 decimal places for the user
- When creating records, generate a UUID for the `id` column
- When updating budgets, set `end_date` on old row and create a new row
