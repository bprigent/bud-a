/**
 * Label for account dropdowns: nickname, bank, and owner so duplicate nicknames are distinguishable.
 */
export function accountSelectOptionLabel(account, members = []) {
  const m = members.find((x) => x.id === account.member_id);
  const owner = m ? `${m.first_name} ${m.last_name || ''}`.trim() : '';
  const nick = account.nickname?.trim() || '';
  const bank = account.bank_name?.trim() || '';
  const primary = nick || bank || 'Account';
  const bankPart = bank && bank !== primary ? bank : '';
  if (owner) {
    if (bankPart) return `${primary} — ${bankPart} · ${owner}`;
    return `${primary} · ${owner}`;
  }
  if (bankPart) return `${primary} — ${bankPart}`;
  return primary;
}

/**
 * Operations toolbar account filter (and matching dropdowns): "nickname — bank (First)".
 * `account` may include `label` instead of `nickname` (e.g. savings-history API rows).
 */
export function operationsAccountFilterLabel(account, members = []) {
  const memMap = {};
  (members || []).forEach((mem) => {
    memMap[mem.id] = mem.first_name;
  });
  const nick = (account.nickname ?? account.label ?? '').trim() || '';
  const bank = (account.bank_name ?? '').trim() || '';
  const first = (memMap[account.member_id] || '').split(' ')[0] || '';
  return `${nick} — ${bank} (${first})`;
}

/** Short label for tables/badges: nickname, else bank name. */
export function accountDisplayName(account) {
  const nick = account.nickname?.trim() || '';
  const bank = account.bank_name?.trim() || '';
  return nick || bank || 'Account';
}

import { API_BASE_URL } from '../config.js';

/**
 * Absolute URL for a file stored under `data/images/bank-logos/` (served by GET /api/data-images/bank-logos/…).
 * Only the basename is used (path segments are stripped) to avoid traversal.
 */
export function bankLogoFileUrl(filename) {
  const base = (filename || '').trim().split(/[/\\]/).pop();
  if (!base) return null;
  return `${API_BASE_URL}/api/data-images/bank-logos/${encodeURIComponent(base)}`;
}

/**
 * Logo URL for UI: external `image_url` if set, else `logo` filename under data/images/bank-logos via API.
 */
export function accountImageSrc(account) {
  const url = (account.image_url || '').trim();
  if (url) return url;
  const file = (account.logo || '').trim();
  if (file) return bankLogoFileUrl(file);
  return null;
}
