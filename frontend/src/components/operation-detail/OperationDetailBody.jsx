import { formatDate, formatCurrency } from '../../utils/format';
import { accountSelectOptionLabel } from '../../utils/accountLabels';
import { memberFullName, accountById } from './helpers';
import OperationDetailRow from './OperationDetailRow';
import TypeBadge from '../TypeBadge';
import OperationDetailAccountRows from './OperationDetailAccountRows';
import { categorySelectContent, categorySelectLabel } from '../../utils/categoryLabels';
import EmojiPixel from '../EmojiPixel';
import PanelSectionTitle from '../PanelSectionTitle';
import Redacted from '../Redacted';
import Button from '../Button';

/**
 * Loaded operation: hero, about section, danger zone.
 * Edit / Create rule CTAs live in the SidePanel footer (owned by the parent).
 */
export default function OperationDetailBody({
  op,
  categories,
  members,
  accounts,
  onDelete,
}) {
  const category = categories.find((c) => c.id === op.category_id);
  const categoryEmoji = category?.emoji || '';
  const categoryDisplay = category
    ? categorySelectContent(category)
    : op.category_id || '—';
  const categoryTitle = category ? categorySelectLabel(category) : op.category_id || '—';

  const fromAcc = op.from_account_id ? accountById(accounts, op.from_account_id) : null;
  const toAcc = op.to_account_id ? accountById(accounts, op.to_account_id) : null;
  const fromLabel = fromAcc ? accountSelectOptionLabel(fromAcc, members) : '—';
  const toLabel = toAcc ? accountSelectOptionLabel(toAcc, members) : '—';

  const typeLabel = op.type === 'money_movement' ? 'transfer' : op.type === 'income' ? 'income' : 'expense';

  return (
    <div className="operation-detail-v2">
      {/* Hero */}
      <div className="operation-detail-hero">
        {categoryEmoji ? (
          <EmojiPixel size="8" className="operation-detail-hero__emoji">
            {categoryEmoji}
          </EmojiPixel>
        ) : null}
        <div className="operation-detail-hero__label">{op.label || '—'}</div>
        <div className="operation-detail-hero__amount-row">
          <div className="operation-detail-hero__amount">
            <Redacted>{formatCurrency(op.amount, op.currency)}</Redacted>
          </div>
          <TypeBadge type={op.type} />
        </div>
      </div>

      {/* About this expense / income / transfer */}
      <section className="operation-detail-section" aria-labelledby="opd-about">
        <PanelSectionTitle id="opd-about">About this {typeLabel}</PanelSectionTitle>
        <dl className="operation-detail-dl">
          <OperationDetailRow label="Date">{formatDate(op.date)}</OperationDetailRow>
          <OperationDetailRow label="Category" ddTitle={categoryTitle}>
            {categoryDisplay}
          </OperationDetailRow>
          <OperationDetailRow label="Member">
            {memberFullName(op.member_id, members)}
          </OperationDetailRow>
          <OperationDetailAccountRows
            type={op.type}
            fromLabel={fromLabel}
            toLabel={toLabel}
          />
          <OperationDetailRow label="Record ID" muted>
            <code className="operation-detail-id">{op.id}</code>
          </OperationDetailRow>
        </dl>
      </section>

      {/* Danger zone */}
      <section className="operation-detail-section operation-detail-section--danger" aria-labelledby="opd-danger">
        <PanelSectionTitle id="opd-danger">Danger zone</PanelSectionTitle>
        <div className="operation-detail-danger__body">
          <p className="operation-detail-danger__hint">
            Permanently delete this {typeLabel}. This action cannot be undone.
          </p>
          <Button variant="danger" type="button" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </section>
    </div>
  );
}
