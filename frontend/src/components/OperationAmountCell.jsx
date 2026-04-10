import { formatCurrency } from '../utils/format';
import Redacted from './Redacted';

const TYPE_HINT = {
  income: 'Income',
  expense: 'Expense',
  money_movement: 'Transfer',
};

/**
 * Formatted amount with a leading type glyph: green +, red −, or grey ⇄ for transfers.
 */
export default function OperationAmountCell({ amount, currency, type }) {
  const hint = TYPE_HINT[type] || '';
  let glyph = null;
  if (type === 'income') glyph = '+';
  else if (type === 'expense') glyph = '−';
  else if (type === 'money_movement') glyph = '⇄';

  return (
    <span className="operation-amount-cell">
      {glyph != null ? (
        <span
          className={`operation-amount-type-icon operation-amount-type-icon--${type}`}
          title={hint}
          aria-label={hint}
        >
          {glyph}
        </span>
      ) : null}
      <span className="operation-amount-value"><Redacted>{formatCurrency(amount, currency)}</Redacted></span>
    </span>
  );
}
