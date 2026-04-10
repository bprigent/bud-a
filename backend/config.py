"""App-level configuration read from environment variables."""

import os

DEFAULT_CURRENCY: str = os.environ.get("DEFAULT_CURRENCY", "EUR")

ALLOWED_CURRENCIES: set[str] = {"EUR", "USD", "GBP", "CHF", "CAD", "AUD", "JPY"}
