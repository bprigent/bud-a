import { useEffect, useState } from 'react';
import { accountDisplayName, bankLogoFileUrl } from '../utils/accountLabels';
import { accountById } from './operation-detail/helpers';

function placeholderLetter(account) {
  const bank = (account.bank_name || '').trim();
  const nick = (account.nickname || '').trim();
  return (bank[0] || nick[0] || '?').toUpperCase();
}

function AccountBadgeLogo({ account }) {
  const remote = (account.image_url || '').trim();
  const local = bankLogoFileUrl((account.logo || '').trim());
  const [src, setSrc] = useState(() => remote || local || null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setSrc(remote || local || null);
  }, [remote, local, account.id]);

  const handleError = () => {
    if (remote && local && src === remote) {
      setSrc(local);
      return;
    }
    setFailed(true);
  };

  if (!src || failed) {
    return <span className="account-badge__placeholder">{placeholderLetter(account)}</span>;
  }
  return (
    <img
      className="account-badge__logo"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
}

/**
 * Compact account row: bank logo (or placeholder) + account display name.
 * Pass `account` or `accountId` + `accounts`.
 */
export default function AccountBadge({
  account,
  accountId,
  accounts,
  className = '',
}) {
  const acc = account ?? accountById(accounts, accountId);
  if (!acc) {
    return <span className={`account-badge account-badge--empty ${className}`.trim()}>—</span>;
  }
  const name = accountDisplayName(acc);
  return (
    <span className={`account-badge ${className}`.trim()} title={name} aria-label={name}>
      <span className="account-badge__logo-wrap" aria-hidden>
        <AccountBadgeLogo account={acc} />
      </span>
      <span className="account-badge__name">{name}</span>
    </span>
  );
}
