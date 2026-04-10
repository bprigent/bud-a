import { useState, useEffect, useMemo } from 'react';
import { getOperation, updateOperation, getCategories, getMembers, getAccounts } from '../api';
import { centsFromDollars, dollarsFromCents } from '../utils/format';
import { accountSelectOptionLabel } from '../utils/accountLabels';
import { categorySelectLabel, categorySelectContent } from '../utils/categoryLabels';
import Button from '../components/Button';
import Select from '../components/Select';
import FormField from '../components/FormField';
import FormRow from '../components/FormRow';
import AmountInput from '../components/AmountInput';
import { DEFAULT_CURRENCY, CURRENCIES } from '../config';
import { memberFormSelectOptions } from '../utils/memberSelectOptions';

/**
 * Edit form for SidePanel on Operations. Parent passes operationId and closes via onCancel / onSuccess.
 */
export default function OperationEdit({ operationId, onSuccess, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [form, setForm] = useState({
    type: 'expense',
    date: '',
    label: '',
    amount: '',
    currency: DEFAULT_CURRENCY,
    category_id: '',
    member_id: '',
    from_account_id: '',
    to_account_id: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    Promise.all([getOperation(operationId), getCategories(), getMembers(), getAccounts()])
      .then(([op, cats, mems, accts]) => {
        if (cancelled) return;
        setCategories(cats || []);
        setMembers(mems || []);
        setAccounts(accts || []);
        setForm({
          type: op.type || 'expense',
          date: op.date || '',
          label: op.label || '',
          amount: dollarsFromCents(op.amount),
          currency: op.currency || DEFAULT_CURRENCY,
          category_id: op.category_id || '',
          member_id: op.member_id || '',
          from_account_id: op.from_account_id || '',
          to_account_id: op.to_account_id || '',
        });
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [operationId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await updateOperation(operationId, {
        type: form.type,
        date: form.date,
        label: form.label,
        amount: centsFromDollars(form.amount),
        currency: form.currency,
        category_id: form.category_id,
        member_id: form.member_id,
        from_account_id: form.from_account_id,
        to_account_id: form.to_account_id,
      });
      onSuccess();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isTransfer = form.type === 'money_movement';
  const isIncome = form.type === 'income';
  const typeLabel = { expense: 'Expense', income: 'Income', money_movement: 'Transfer' }[form.type] || 'Operation';

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: accountSelectOptionLabel(a, members),
  }));

  const memberOptions = useMemo(() => memberFormSelectOptions(members), [members]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (loadError) {
    return (
      <>
        <div className="error">{loadError}</div>
        <div className="form-actions u-mt-4">
          <Button variant="secondary" onClick={onCancel}>Close</Button>
        </div>
      </>
    );
  }

  return (
    <>
      {submitError && <div className="error">{submitError}</div>}
      <form onSubmit={handleSubmit}>
        <FormRow>
          <Select
            label="Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
            options={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
              { value: 'money_movement', label: 'Transfer' },
            ]}
          />
          <FormField label="Date" htmlFor="edit-date">
            <input type="date" id="edit-date" name="date" value={form.date} onChange={handleChange} required />
          </FormField>
        </FormRow>

        <FormField label="Label" htmlFor="edit-label">
          <input type="text" id="edit-label" name="label" value={form.label} onChange={handleChange} required placeholder="e.g. Grocery shopping" />
        </FormField>

        <FormRow>
          <FormField label="Amount" htmlFor="edit-amount">
            <AmountInput
              id="edit-amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </FormField>
          <Select
            label="Currency"
            value={form.currency}
            onChange={(v) => setForm({ ...form, currency: v })}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          />
        </FormRow>

        <Select
          label="Category"
          value={form.category_id}
          onChange={(v) => setForm({ ...form, category_id: v })}
          options={categories.map((c) => ({
            value: c.id,
            label: categorySelectLabel(c),
            content: categorySelectContent(c),
          }))}
          placeholder="Select category"
          searchable
          required
        />

        <Select
          label="Member"
          value={form.member_id}
          onChange={(v) => setForm({ ...form, member_id: v })}
          options={memberOptions}
          placeholder="Select member"
          searchable
          required
        />

        {isTransfer ? (
          <FormRow>
            <Select
              label="From account"
              value={form.from_account_id}
              onChange={(v) => setForm({ ...form, from_account_id: v })}
              options={accountOptions}
              placeholder="Source account"
              searchable
              required
            />
            <Select
              label="To account"
              value={form.to_account_id}
              onChange={(v) => setForm({ ...form, to_account_id: v })}
              options={accountOptions}
              placeholder="Destination account"
              searchable
              required
            />
          </FormRow>
        ) : isIncome ? (
          <Select
            label="To account"
            value={form.to_account_id}
            onChange={(v) => setForm({ ...form, to_account_id: v })}
            options={accountOptions}
            placeholder="Receiving account"
            searchable
            required
          />
        ) : (
          <Select
            label="From account"
            value={form.from_account_id}
            onChange={(v) => setForm({ ...form, from_account_id: v })}
            options={accountOptions}
            placeholder="Paying account"
            searchable
            required
          />
        )}

        <div className="form-actions">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Saving...' : `Save ${typeLabel}`}
          </Button>
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </>
  );
}
