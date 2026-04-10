import { useState } from 'react';
import { formatCurrency } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import Redacted from './Redacted';
import EmptyState from './EmptyState';
import { BankLogoCircle } from './AccountCard';
import { memberHexColor } from '../utils/memberColor';
import { H4 } from './Typography';
import { FiChevronRight } from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';
import IconButton from './IconButton';

/**
 * Right column on the month dashboard: fixed width (matches Study filter column),
 * flush border, scrolls independently from main content.
 *
 * @param {object[]} [members] — owner color ring around bank logo when `member_id` + hex `color` are set
 */

export default function MonthAccountsSidePanel({
  accounts = [],
  members = [],
  onAccountClick,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const clickable = typeof onAccountClick === 'function';

  return (
    <aside
      className={`month-accounts-panel${collapsed ? ' month-accounts-panel--collapsed' : ''}`}
      aria-label="Account balances"
    >
      <div className="month-accounts-panel__scroll">
        {collapsed ? (
          <IconButton
            type="button"
            size="sm"
            className="month-accounts-panel__toggle"
            aria-label="Expand account balances panel"
            aria-expanded={false}
            title="Show accounts"
            onClick={() => setCollapsed(false)}
          >
            <MdAccountBalance size={18} />
          </IconButton>
        ) : (
          <>
            <div className="month-accounts-panel__header">
              <H4 as="h2" variant="overline" id="month-accounts-panel-heading" className="month-accounts-panel__heading">
                Accounts balances
              </H4>
              <IconButton
                type="button"
                size="sm"
                className="month-accounts-panel__toggle"
                aria-label="Collapse account balances panel"
                aria-expanded
                title="Hide accounts"
                onClick={() => setCollapsed(true)}
              >
                <FiChevronRight size={18} />
              </IconButton>
            </div>
            <div
              className="month-accounts-panel__body"
              role="region"
              aria-labelledby="month-accounts-panel-heading"
            >
              {!accounts?.length ? (
                <EmptyState message="No accounts." />
              ) : (
                <ul className="month-accounts-panel__list">
                  {accounts.map((row) => {
                    const cur = row.currency || DEFAULT_CURRENCY;
                    const hasLogo =
                      !!(row.image_url || '').trim() || !!(row.logo || '').trim();
                    const bank = (row.bank_name || '').trim();
                    const label = (row.label || '').trim() || 'Account';
                    const memberId = (row.member_id || '').trim();
                    const ownerRingHex = memberHexColor(members, memberId);
                    const delta = row.month_delta ?? null;
                    const deltaLabel =
                      delta != null && delta !== 0
                        ? `${delta > 0 ? '+' : ''}${formatCurrency(delta, cur)}`
                        : delta === 0
                          ? '—'
                          : '';
                    const amountLabel = formatCurrency(row.balance, cur);
                    const ariaLabel = [label, deltaLabel || null, amountLabel]
                      .filter(Boolean)
                      .join(', ');

                    const logoOrPlaceholder = hasLogo ? (
                      <BankLogoCircle account={row} className="month-accounts-panel__logo" />
                    ) : (
                      <div
                        className="month-accounts-panel__logo month-accounts-panel__logo--placeholder"
                        aria-hidden
                      >
                        {(bank || label).charAt(0).toUpperCase() || '?'}
                      </div>
                    );

                    const logoWithRing = (
                      <div
                        className={
                          ownerRingHex
                            ? 'month-accounts-panel__logo-ring month-accounts-panel__logo-ring--owner'
                            : 'month-accounts-panel__logo-ring'
                        }
                        style={
                          ownerRingHex
                            ? { '--member-logo-ring': ownerRingHex }
                            : undefined
                        }
                      >
                        {logoOrPlaceholder}
                      </div>
                    );

                    const meta = (
                      <div className="month-accounts-panel__meta">
                        <span className="month-accounts-panel__name" title={label}>
                          {label}
                        </span>
                        {deltaLabel ? (
                          <span
                            className={[
                              'month-accounts-panel__sub',
                              delta > 0 ? 'month-accounts-panel__sub--positive' : '',
                              delta < 0 ? 'month-accounts-panel__sub--negative' : '',
                            ].filter(Boolean).join(' ')}
                            title={`Month delta: ${deltaLabel}`}
                          >
                            <Redacted>{deltaLabel}</Redacted>
                          </span>
                        ) : null}
                      </div>
                    );

                    const amount = (
                      <span className="month-accounts-panel__amount">
                        <Redacted>{amountLabel}</Redacted>
                      </span>
                    );

                    const content = (
                      <>
                        {logoWithRing}
                        {meta}
                        {amount}
                      </>
                    );

                    return (
                      <li key={row.account_id}>
                        {clickable ? (
                          <button
                            type="button"
                            className="month-accounts-panel__row"
                            aria-label={ariaLabel}
                            onClick={() => onAccountClick(row)}
                          >
                            {content}
                          </button>
                        ) : (
                          <div
                            className="month-accounts-panel__row month-accounts-panel__row--static"
                            role="group"
                            aria-label={ariaLabel}
                          >
                            {content}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
