---
paths:
  - "backend/**"
---

# Backend Rules

- Follow PEP 8, use type hints on all function signatures
- Use f-strings for string formatting
- Handle file I/O errors gracefully (file not found, permission denied, corrupted CSV)
- Use `csv` module or `pandas` for CSV operations — never manual string splitting
- All API responses return JSON with consistent structure: `{ "data": ..., "error": ... }`
- Log operations but never log actual financial amounts
