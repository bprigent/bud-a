/** Normalize #rgb / #rrggbb from members.csv */
export function parseMemberHexColor(raw) {
  const s = (raw || '').trim();
  if (!s) return null;
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s.toLowerCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(s)) {
    const [, r, g, b] = s;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

/** Resolved hex for UI chrome (e.g. account logo ring) when member has a stored color. */
export function memberHexColor(members, memberId) {
  if (!memberId || !members?.length) return null;
  const m = members.find((x) => x.id === memberId);
  return m ? parseMemberHexColor(m.color) : null;
}
