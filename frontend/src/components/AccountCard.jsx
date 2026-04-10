import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import { bankLogoFileUrl } from '../utils/accountLabels';
import Redacted from './Redacted';

/**
 * Circular bank logo: uses `image_url` if set, else file from `logo` via API; falls back from remote to local on error.
 */
export function BankLogoCircle({ account, className = '' }) {
  const remote = (account.image_url || '').trim();
  const local = bankLogoFileUrl((account.logo || '').trim());
  const [src, setSrc] = useState(() => remote || local || null);

  useEffect(() => {
    setSrc(remote || local || null);
  }, [remote, local, account.id]);

  if (!src) return null;

  const handleError = () => {
    if (remote && local && src === remote) {
      setSrc(local);
    }
  };

  const circleClass = ['account-card-logo-circle', className].filter(Boolean).join(' ');

  return (
    <div className={circleClass}>
      <img
        className="account-card-logo"
        src={src}
        alt={account.bank_name || account.label || 'Bank'}
        loading="lazy"
        decoding="async"
        onError={handleError}
      />
    </div>
  );
}

/**
 * Bank account summary card: optional circular logo, balance, optional account nickname, owner.
 * Pass `onClick` for a button; omit for a static card (e.g. read-only preview).
 *
 * @param {object}   account
 * @param {string}   [account.account_id]
 * @param {string}   [account.label]
 * @param {string}   [account.bank_name]
 * @param {string}   [account.owner_name]
 * @param {string}   [account.logo]         — filename in data/images/bank-logos (served by API)
 * @param {number}   account.balance       — cents
 * @param {string}   [account.currency]
 * @param {(acc: object) => void} [onClick]
 * @param {string}   [className]
 */
export default function AccountCard({
  account,
  onClick,
  className = '',
}) {
  const currency = account.currency || DEFAULT_CURRENCY;
  const showNick =
    account.bank_name && account.label && account.label !== account.bank_name;
  const hasLogo =
    !!(account.image_url || '').trim() || !!(account.logo || '').trim();

  const inner = (
    <>
      {hasLogo ? <BankLogoCircle account={account} /> : null}
      <span className="account-card-balance">
        <Redacted>{formatCurrency(account.balance, currency)}</Redacted>
      </span>
      {showNick ? (
        <span className="account-card-nick" title={account.label}>
          {account.label}
        </span>
      ) : null}
      <span
        className="account-card-owner"
        title={account.owner_name || undefined}
      >
        {account.owner_name || '—'}
      </span>
    </>
  );

  const combined = ['account-card', onClick ? '' : 'account-card--static', className]
    .filter(Boolean)
    .join(' ');

  if (onClick) {
    return (
      <button type="button" className={combined.trim()} onClick={() => onClick(account)}>
        {inner}
      </button>
    );
  }

  return <div className={combined.trim()}>{inner}</div>;
}
