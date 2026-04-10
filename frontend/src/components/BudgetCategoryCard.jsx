import { formatCurrency, sentenceCaseLabel } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import Toggle from './Toggle';
import Redacted from './Redacted';
import EmojiPixel from './EmojiPixel';

/** One category row on the budget dashboard (emoji, amounts, click row to edit when allowed, chart toggle). */
export default function BudgetCategoryCard({
  categoryName,
  emoji,
  amount,
  currency = DEFAULT_CURRENCY,
  sharePercent,
  showInChart,
  onChartVisibilityChange,
  /** Stable id for the chart toggle (e.g. category id) — used in `id` for accessibility. */
  chartToggleId,
  showChartToggle = true,
  showActions = false,
  onEdit,
}) {
  const canOpenEdit = Boolean(showActions && onEdit);
  const displayName = sentenceCaseLabel(categoryName);

  const isActionTarget = (el) =>
    typeof el.closest === 'function' &&
    Boolean(el.closest('.budget-category-card-actions'));

  const handleCardActivate = (e) => {
    if (!canOpenEdit || !onEdit) return;
    if (isActionTarget(e.target)) return;
    onEdit();
  };

  return (
    <li
      className={[
        'budget-category-card',
        canOpenEdit && 'budget-category-card--interactive',
        !showInChart && 'budget-category-card--chart-hidden',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={canOpenEdit ? handleCardActivate : undefined}
    >
      <div className="budget-category-card-emoji" aria-hidden>
        {emoji?.trim() ? <EmojiPixel size="2">{emoji.trim()}</EmojiPixel> : '·'}
      </div>
      <div className="budget-category-card-meta">
        <div className="budget-category-card-label">{displayName}</div>
        {sharePercent != null ? (
          <div
            className="budget-category-card-sub"
            title="Share of visible chart total"
          >
            {Math.round(sharePercent)}%
          </div>
        ) : null}
      </div>
      <div className="budget-category-card-balance">
        <Redacted>{formatCurrency(amount, currency)}</Redacted>
      </div>
      {showChartToggle && onChartVisibilityChange ? (
        <div className="budget-category-card-actions">
          <Toggle
            className="budget-category-chart-toggle"
            id={
              chartToggleId != null
                ? `budget-chart-toggle-${chartToggleId}`
                : undefined
            }
            checked={showInChart}
            onChange={(e) => {
              e.stopPropagation();
              onChartVisibilityChange(e.target.checked);
            }}
            aria-label={`Show ${displayName} in chart`}
            title={showInChart ? 'Shown in chart' : 'Hidden from chart'}
          />
        </div>
      ) : null}
    </li>
  );
}
