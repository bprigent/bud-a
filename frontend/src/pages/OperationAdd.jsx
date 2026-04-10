import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOperation, getCategories, getMembers, getAccounts } from '../api';
import { centsFromDollars, todayStr } from '../utils/format';
import { accountSelectOptionLabel } from '../utils/accountLabels';
import { categorySelectLabel, categorySelectContent } from '../utils/categoryLabels';
import Button from '../components/Button';
import Select from '../components/Select';
import FormField from '../components/FormField';
import FormRow from '../components/FormRow';
import AmountInput from '../components/AmountInput';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import { DEFAULT_CURRENCY, CURRENCIES } from '../config';
import { PageRoot } from './PageRoot.styled';
import { memberFormSelectOptions } from '../utils/memberSelectOptions';

export default function OperationAdd({ onSuccess, onCancel } = {}) {
  const navigate = useNavigate();
  const inPanel = typeof onSuccess === 'function' && typeof onCancel === 'function';
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    type: 'expense',
    date: todayStr(),
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
    Promise.all([getCategories(), getMembers(), getAccounts()])
      .then(([cats, mems, accts]) => {
        if (cancelled) return;
        setCategories(cats || []);
        setMembers(mems || []);
        setAccounts(accts || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createOperation({
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
      if (inPanel) onSuccess();
      else navigate('/operations');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isTransfer = form.type === 'money_movement';
  const isIncome = form.type === 'income';
  const typeLabel = { expense: 'Expense', income: 'Income', money_movement: 'Transfer' }[form.type] || 'Operation';

  const memberOptions = useMemo(() => memberFormSelectOptions(members), [members]);

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: accountSelectOptionLabel(a, members),
  }));

  const formBlock = (
    <>
      {error && <div className="error">{error}</div>}
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
            <FormField label="Date" htmlFor="date">
              <input type="date" id="date" name="date" value={form.date} onChange={handleChange} required />
            </FormField>
          </FormRow>

          <FormField label="Label" htmlFor="label">
            <input type="text" id="label" name="label" value={form.label} onChange={handleChange} required placeholder="e.g. Grocery shopping" />
          </FormField>

          <FormRow>
            <FormField label="Amount" htmlFor="amount">
              <AmountInput
                id="amount"
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
              {submitting ? 'Saving...' : `Add ${typeLabel}`}
            </Button>
            <Button
              variant="secondary"
              onClick={() => (inPanel ? onCancel() : navigate('/operations'))}
            >
              Cancel
            </Button>
          </div>
        </form>
    </>
  );

  if (inPanel) return formBlock;

  return (
    <PageRoot className="page">
      <PageHeader
        title="Add Operation"
        subtitle="Record an expense, income, or money movement between accounts."
      />
      <PageMain>
        <div className="card">{formBlock}</div>
      </PageMain>
    </PageRoot>
  );
}
