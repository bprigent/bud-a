/**
 * Compact member display: initials on a badge. Uses member.color when set; otherwise a stable fallback hue.
 * Full name in title tooltip.
 */

import { parseMemberHexColor } from '../utils/memberColor';

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % 360;
}

function hexToRgb(hex) {
  const s = hex.replace('#', '');
  if (s.length !== 6) return null;
  const n = parseInt(s, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Lightness-based text: dark on light fills, white on saturated/dark fills */
function contrastTextOnHexBackground(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'var(--color-text-primary)';
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const lin = (x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.45 ? '#1a1a1a' : '#ffffff';
}

function memberInitials(m) {
  const first = (m.first_name || '').trim();
  const last = (m.last_name || '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first.length >= 2) return first.slice(0, 2).toUpperCase();
  if (first) return first[0].toUpperCase();
  return '?';
}

function memberTitle(m) {
  if (!m) return '';
  const full = `${m.first_name || ''} ${m.last_name || ''}`.trim();
  return full || m.id;
}

export default function MemberBadge({ member, memberId, members }) {
  const m = member ?? members?.find((x) => x.id === memberId);
  if (!m) {
    return (
      <span className="member-badge member-badge--unknown" title={memberId || 'Unknown'}>
        ?
      </span>
    );
  }

  const dataHex = parseMemberHexColor(m.color);
  if (dataHex) {
    const fg = contrastTextOnHexBackground(dataHex);
    return (
      <span
        className="member-badge"
        style={{
          '--badge-bg': dataHex,
          '--badge-fg': fg,
          '--badge-border': `color-mix(in srgb, ${dataHex} 72%, #000000)`,
        }}
        title={memberTitle(m)}
      >
        {memberInitials(m)}
      </span>
    );
  }

  const hue = hashHue(m.id);
  return (
    <span
      className="member-badge"
      style={{ '--member-badge-hue': hue }}
      title={memberTitle(m)}
    >
      {memberInitials(m)}
    </span>
  );
}
