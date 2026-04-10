# Contributing to Bud-A

Thanks for your interest in contributing! This is a small, growing team — all changes go through review before merging.

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### Setup

1. Fork the repository and clone your fork
2. Run `./start.sh` — it handles dependencies, virtual environment, and first-time `.env` setup
3. The app will be available at `http://localhost:5173` (frontend) and `http://localhost:8000` (backend)

## Workflow

1. Create a branch from `main` using the convention:
   - `feature/short-description` for new features
   - `fix/short-description` for bug fixes
   - `chore/short-description` for maintenance tasks
2. Make your changes
3. Push your branch and open a pull request against `main`
4. All PRs require approval before merging — the reviewer list is managed by the project owner

## Code Style

- **Python**: Follow PEP 8, use type hints, prefer f-strings
- **JavaScript**: ES modules, 2-space indentation, async/await over callbacks
- **CSS**: Use styled-components only — no plain CSS files, inline styles, or CSS modules

## Linting

Run the frontend linter before submitting your PR:

```bash
cd frontend && npm run lint
```

Fix all warnings and errors before pushing.

## Testing

Every PR must include tests for new or changed code, with **100% coverage on the code you add**. Run tests locally before submitting:

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && pytest
```

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add monthly export feature
fix: correct currency rounding on dashboard
chore: update frontend dependencies
docs: add API endpoint documentation
test: add coverage for budget service
```

Keep messages short and descriptive. Use the body for extra context if needed.

## What Not to Commit

- The `data/` folder or any CSV financial data
- `.env` files (use `.env.example` as a template)
- Private keys or encryption secrets
- `node_modules/`, `__pycache__/`, or build artifacts

## Communication

- **Questions or feedback**: Fill out the [feedback form](https://forms.gle/bud-a-feedback)
- **Email**: hello@bprigent.com
