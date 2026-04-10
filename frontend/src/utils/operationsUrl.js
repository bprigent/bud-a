/**
 * Build a /operations URL with query params. Omits falsy values.
 */
export function buildOperationsUrl(params = {}) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  const qs = sp.toString();
  return qs ? `/operations?${qs}` : '/operations';
}
