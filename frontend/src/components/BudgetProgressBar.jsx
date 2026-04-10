import { createGlobalStyle } from 'styled-components';
import { formatCurrency } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import Redacted from './Redacted';

const BudgetProgressBarStyles = createGlobalStyle`
/* Budget dashboard: tab-like shell (matches segmented-tabs track) + grey fill until over budget */
.budget-progress-track-shell {
  padding: 4px;
  margin-bottom: 0;
  border-radius: var(--radius-sm);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-tab-track);
}

.budget-progress-track {
  position: relative;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--color-neutral-0);
  overflow: hidden;
}

/* Border + pill chrome only on the filled segment (matches tab-indicator look) */
.budget-progress-track .progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  background: var(--color-neutral-200);
  box-shadow: var(--shadow-tab-indicator);
  transition: width 0.3s ease;
  width: var(--fill-width, 0%);
}

.budget-progress-track .progress-fill.progress-fill--full {
  border-radius: var(--radius-sm);
}

.budget-progress-track .progress-fill.over {
  background: var(--color-danger-border);
}

.budget-progress-track .progress-fill.progress-fill--savings-ahead {
  background: #a7f3d0;
  border-color: #34d399;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.85),
    0 1px 2px rgba(16, 185, 129, 0.12);
}

.budget-progress-track-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: 0 var(--space-2);
  z-index: 1;
  font-size: var(--font-size-2xs);
  letter-spacing: 0.01em;
  pointer-events: none;
  min-width: 0;
}

.budget-progress-track-spent {
  flex: 1 1 auto;
  min-width: 0;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.budget-progress-track-status {
  flex: 0 1 auto;
  max-width: 55%;
  font-weight: var(--font-weight-semibold);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.budget-progress-track-status--remaining {
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.budget-progress-track-status.budget-progress-over {
  color: var(--danger);
}

.budget-progress-track-status.budget-progress-over.budget-progress-over--savings {
  color: var(--success);
}

.budget-progress {
  padding: var(--space-2) var(--space-3);
  min-width: 0;
}

.budget-progress + .budget-progress {
  border-top: 1px solid var(--border);
}

.budget-progress-header {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.budget-progress-title {
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap;
  gap: var(--space-2);
  min-width: 0;
  width: 100%;
}

.budget-progress-label {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  min-width: 0;
  flex: 1 1 auto;
}

/* String labels (no category row markup) */
.budget-progress-label:not(:has(.category-inline-label)) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.budget-progress-label:has(.category-inline-label) {
  display: block;
  overflow: hidden;
}

.budget-progress-label .category-inline-label {
  display: inline-flex;
  align-items: baseline;
  max-width: 100%;
  min-width: 0;
  vertical-align: bottom;
}

.budget-progress-label .category-inline-label .emoji-pixel {
  flex-shrink: 0;
}

.budget-progress-label .category-inline-label__text {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.budget-progress-budgeted {
  flex-shrink: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
`;

/**
 * Reusable budget progress bar showing spent amount on the track (fill = share of budget).
 *
 * @param {'spending'|'savings'} planKind - Spending: over limit is bad (red). Savings: over goal is good (green).
 */
export default function BudgetProgressBar({
  label,
  spent,
  budgeted,
  currency = DEFAULT_CURRENCY,
  className = '',
  planKind = 'spending',
}) {
  const isSavings = planKind === 'savings';
  const usedPct = budgeted > 0 ? (spent / budgeted) * 100 : 0;
  const isOver = budgeted > 0 && spent > budgeted;
  const fillWidthPct = budgeted > 0 ? Math.min(usedPct, 100) : 0;

  const overStatusClass = isSavings
    ? 'budget-progress-over budget-progress-over--savings'
    : 'budget-progress-over';

  const fillClass = [
    'progress-fill',
    isOver && (isSavings ? 'progress-fill--savings-ahead' : 'over'),
    fillWidthPct >= 100 ? 'progress-fill--full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const trackAriaLabel = isSavings
    ? isOver
      ? `Saved ${formatCurrency(spent, currency)} toward ${formatCurrency(budgeted, currency)} goal, ${formatCurrency(spent - budgeted, currency)} ahead`
      : `Saved ${formatCurrency(spent, currency)} toward ${formatCurrency(budgeted, currency)} goal, ${formatCurrency(budgeted - spent, currency)} remaining to goal`
    : isOver
      ? `Spent ${formatCurrency(spent, currency)} of ${formatCurrency(budgeted, currency)} budget, over by ${formatCurrency(spent - budgeted, currency)}`
      : `Spent ${formatCurrency(spent, currency)} of ${formatCurrency(budgeted, currency)} budget, ${formatCurrency(budgeted - spent, currency)} left`;

  return (
    <div className={`budget-progress ${className}`}>
      <div className="budget-progress-header">
        <div className="budget-progress-title">
          <span className="budget-progress-label">{label}</span>
          <span className="budget-progress-budgeted">
            <Redacted>{formatCurrency(budgeted, currency)}</Redacted>
          </span>
        </div>
      </div>
      <div className="budget-progress-track-shell">
        <div
          className="budget-progress-track"
          role="img"
          aria-label={trackAriaLabel}
        >
          <div className={fillClass} style={{ '--fill-width': `${fillWidthPct}%` }} />
          <div className="budget-progress-track-overlay">
            <div className="budget-progress-track-spent">
              <Redacted>{formatCurrency(spent, currency)}</Redacted>
            </div>
            {isOver ? (
              <div className={`budget-progress-track-status ${overStatusClass}`}>
                Over:{' '}
                <Redacted>{formatCurrency(spent - budgeted, currency)}</Redacted>
              </div>
            ) : (
              <div className="budget-progress-track-status budget-progress-track-status--remaining">
                left:{' '}
                <Redacted>{formatCurrency(budgeted - spent, currency)}</Redacted>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { BudgetProgressBarStyles };
