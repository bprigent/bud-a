export function memberFullName(memberId, members) {
  const m = members?.find((x) => x.id === memberId);
  if (!m) return memberId || '—';
  return `${m.first_name} ${m.last_name || ''}`.trim();
}

export function accountById(accounts, id) {
  return accounts?.find((a) => a.id === id);
}
