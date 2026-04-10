import { TYPE_BADGES } from '../constants/operations';

export default function TypeBadge({ type }) {
  const badge = TYPE_BADGES[type] || { className: '', label: type || '—' };
  return (
    <span className={`type-badge ${badge.className}`}>{badge.label}</span>
  );
}
