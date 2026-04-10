/** API origin for fetch() and static assets served by the backend (e.g. bank logos under data/images). */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

/** Default currency code (ISO 4217) used for new operations, budgets, and display. */
export const DEFAULT_CURRENCY = import.meta.env.VITE_DEFAULT_CURRENCY || 'EUR';

/** List of currency codes available in dropdowns throughout the app. */
export const CURRENCIES = (import.meta.env.VITE_CURRENCIES || 'EUR,USD,GBP,CHF,CAD,AUD,JPY')
  .split(',')
  .map((c) => c.trim());
