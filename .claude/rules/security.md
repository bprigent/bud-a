# Security Rules

- Never log, print, or expose financial amounts in error messages or debug output
- Never commit CSV data files, private keys, or encryption secrets to git
- Validate all user inputs before processing (amounts, dates, categories)
- Use parameterized queries if a database is ever introduced
- Sanitize merchant names and descriptions (no script injection in displayed data)
- Encryption keys must never appear in code — load from environment or secure file
