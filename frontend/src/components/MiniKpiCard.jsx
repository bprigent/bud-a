import { getCurrencySymbol } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import Redacted from './Redacted';

/**
 * Compact KPI tile: optional tiny icon, label, amount (cents), and currency (ISO code or suffix like "%").
 * Currency codes render as narrow symbols (e.g. EUR → €). Omit `icon` for a text-only header row.
 */
/** When set, colors the amount row: good = green, bad = red (e.g. budget gap). */
const AMOUNT_TONE_CLASS = {
  good: 'mini-kpi--amount-good',
  bad: 'mini-kpi--amount-bad',
};

export default function MiniKpiCard({
  icon,
  label,
  /** Integer count — when set, bottom row shows this number only (no currency). */
  count,
  amountCents,
  currency = DEFAULT_CURRENCY,
  className = '',
  title,
  amountTone,
}) {
  const toneClass = amountTone && AMOUNT_TONE_CLASS[amountTone] ? AMOUNT_TONE_CLASS[amountTone] : '';
  const hasIcon = icon != null && icon !== false && icon !== '';
  const isCount = count != null && Number.isFinite(Number(count));

  let amountStr;
  let currencyDisplay;
  if (!isCount) {
    const n = Number(amountCents);
    const safe = Number.isFinite(n) ? n : 0;
    const whole = Math.round(safe / 100);
    amountStr = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
    }).format(whole);
    currencyDisplay = getCurrencySymbol(currency);
  }

  return (
    <div
      className={['mini-kpi', !hasIcon && 'mini-kpi--no-icon', toneClass, className].filter(Boolean).join(' ')}
      title={title}
    >
      <div className="mini-kpi-top">
        {hasIcon ? (
          <span className="mini-kpi-icon" aria-hidden>
            {icon}
          </span>
        ) : null}
        <span className="mini-kpi-label">{label}</span>
      </div>
      <div className="mini-kpi-bottom">
        {isCount ? (
          <span className="mini-kpi-amount"><Redacted>{Number(count)}</Redacted></span>
        ) : (
          <Redacted>
            <span className="mini-kpi-amount">{amountStr}</span>
            <span className="mini-kpi-currency">{currencyDisplay}</span>
          </Redacted>
        )}
      </div>
    </div>
  );
}
