import { formatCurrency } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import { categorySelectContent } from '../utils/categoryLabels';
import Redacted from './Redacted';

/**
 * Two-column category / amount table with optional footer row and row click.
 */
export default function CategoryAmountTable({
  title,
  rows,
  currency = DEFAULT_CURRENCY,
  onRowClick,
  footer,
  /** Omit outer card styling when nested inside another panel */
  embedded = false,
  hideHeader = false,
}) {
  return (
    <section className={embedded ? 'category-amount-table-embedded' : 'card'}>
      {title && <h2>{title}</h2>}
      <table>
        {!hideHeader ? (
          <thead>
            <tr>
              <th>Category</th>
              <th className="u-text-right">Amount</th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.category_id}
              className={onRowClick ? 'u-cursor-pointer' : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              <td className="category-amount-name-cell">
                {categorySelectContent(
                  {
                    name: row.category_name,
                    emoji: row.category_emoji,
                  },
                  '1',
                )}
              </td>
              <td className="u-text-right"><Redacted>{formatCurrency(row.amount, currency)}</Redacted></td>
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot>
            <tr>
              <td className="u-font-semibold">{footer.label}</td>
              <td className="u-text-right u-font-semibold">
                <Redacted>{formatCurrency(footer.amount, currency)}</Redacted>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </section>
  );
}
