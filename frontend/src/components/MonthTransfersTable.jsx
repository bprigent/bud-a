import { formatCurrency } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import Redacted from './Redacted';

/**
 * One row per transfer: from (source), to (destination), amount.
 */
export default function MonthTransfersTable({
  rows,
  currency = DEFAULT_CURRENCY,
  onRowClick,
  embedded = true,
}) {
  const sectionClass = embedded ? 'category-amount-table-embedded' : 'card';

  return (
    <section className={sectionClass}>
      <table>
        <thead>
          <tr>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col" className="u-text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={onRowClick ? 'u-cursor-pointer' : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              <td>{row.from.label}</td>
              <td>{row.to.label}</td>
              <td className="u-text-right"><Redacted>{formatCurrency(row.amount, currency)}</Redacted></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
