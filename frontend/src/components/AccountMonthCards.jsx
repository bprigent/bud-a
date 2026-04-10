import EmptyState from './EmptyState';
import AccountCard from './AccountCard';

/**
 * Horizontal scroll row of {@link AccountCard} for the month dashboard.
 */
export default function AccountMonthCards({ accounts, onCardClick }) {
  if (!accounts?.length) {
    return (
      <div className="account-cards-empty">
        <EmptyState message="No accounts." />
      </div>
    );
  }

  return (
    <div className="account-cards-scroll">
      <ul className="account-cards-row">
        {accounts.map((row) => (
          <li key={row.account_id}>
            <AccountCard account={row} onClick={onCardClick} />
          </li>
        ))}
      </ul>
    </div>
  );
}
