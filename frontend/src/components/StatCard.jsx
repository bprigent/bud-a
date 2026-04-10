import { formatCurrency } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import Redacted from './Redacted';

/**
 * Reusable stat card with icon, label, and formatted amount.
 *
 * @param {string}          label    - Card title (e.g. "Total Expenses")
 * @param {number}          amount   - Amount in cents
 * @param {string}          currency - ISO 4217 currency code
 * @param {'expense'|'income'|'neutral'} variant - Controls the amount color
 * @param {React.ReactNode} icon     - Optional icon element
 * @param {string}          className - Optional extra class
 */
export default function StatCard({ label, amount, currency = DEFAULT_CURRENCY, variant = 'neutral', icon, className = '' }) {
  const colorClass = variant === 'neutral' ? '' : variant;

  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card-header">
        {icon && <span className="stat-card-icon">{icon}</span>}
        <span className="stat-label">{label}</span>
      </div>
      <span className={`stat-value ${colorClass}`}>
        <Redacted>{formatCurrency(amount, currency)}</Redacted>
      </span>
    </div>
  );
}
