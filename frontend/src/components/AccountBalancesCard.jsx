import { formatCurrency } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import SectionCard from './SectionCard';
import EmptyState from './EmptyState';
import Redacted from './Redacted';

/**
 * Lists each account with its current balance (from API, derived from operations).
 */
export default function AccountBalancesCard({ accounts, onRowClick }) {
  return (
    <SectionCard title="Accounts">
      {!accounts?.length ? (
        <EmptyState message="No accounts." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th className="u-text-right">Balance</th>
              <th className="u-text-right">vs statement</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((row) => (
              <tr
                key={row.account_id}
                className={onRowClick ? 'u-cursor-pointer' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                <td>{row.label}</td>
                <td className="u-text-right"><Redacted>{formatCurrency(row.balance, row.currency || DEFAULT_CURRENCY)}</Redacted></td>
                <td className="u-text-right account-balance-variance-cell">
                  {row.variance != null ? (
                    <span
                      className={
                        row.variance === 0
                          ? 'account-balance-variance account-balance-variance--ok'
                          : 'account-balance-variance'
                      }
                      title={row.statement_date ? `Statement ${row.statement_date}` : undefined}
                    >
                      {row.variance === 0 ? (
                        <span className="u-muted">Match</span>
                      ) : (
                        <Redacted>{formatCurrency(row.variance, row.currency || DEFAULT_CURRENCY)}</Redacted>
                      )}
                    </span>
                  ) : (
                    <span className="u-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </SectionCard>
  );
}
