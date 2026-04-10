import { useState } from 'react';
import { getAccounts, createAccount, updateAccount, deleteAccount, getMembers } from '../api';
import { useData } from '../hooks/useData';
import Button from '../components/Button';
import Redacted from '../components/Redacted';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import { DEFAULT_CURRENCY } from '../config';
import { PageRoot } from './PageRoot.styled';

export default function Accounts() {
  const { data: accounts, loading, error, refetch } = useData(getAccounts, 'accounts.csv');
  const { data: members } = useData(getMembers, 'members.csv');

  const memMap = {};
  (members || []).forEach((m) => { memMap[m.id] = `${m.first_name} ${m.last_name}`; });

  const emptyForm = {
    bank_name: '', nickname: '', account_number: '', member_id: '', type: 'checking', is_savings: false,
  };
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.bank_name.trim() || !form.nickname.trim()) return;
    setSubmitting(true);
    try {
      await createAccount({
        bank_name: form.bank_name.trim(),
        nickname: form.nickname.trim(),
        account_number: form.account_number.trim(),
        member_id: form.member_id,
        type: form.type,
        currency: DEFAULT_CURRENCY,
        opening_balance: 0,
        opening_balance_date: '',
        statement_balance: null,
        statement_date: '',
        image_url: '',
        is_savings: form.is_savings,
      });
      setForm({ ...emptyForm });
      refetch();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (account) => {
    setEditId(account.id);
    setEditForm({
      bank_name: account.bank_name || '',
      nickname: account.nickname || '',
      account_number: account.account_number || '',
      member_id: account.member_id || '',
      type: account.type || 'checking',
      is_savings: account.is_savings === 'true',
    });
  };

  const handleUpdate = async (id) => {
    if (!editForm.bank_name.trim() || !editForm.nickname.trim()) return;
    try {
      await updateAccount(id, {
        bank_name: editForm.bank_name.trim(),
        nickname: editForm.nickname.trim(),
        account_number: editForm.account_number.trim(),
        member_id: editForm.member_id,
        type: editForm.type,
        is_savings: editForm.is_savings,
      });
      setEditId(null);
      refetch();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this account?')) return;
    try {
      await deleteAccount(id);
      refetch();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <PageRoot className="page">
      <PageHeader
        title="Bank Accounts"
        subtitle="Accounts you use for household money."
      />
      <PageMain>
      <div className="card">
        <h2>Add Account</h2>
        <form onSubmit={handleAdd} className="inline-form">
          <input
            type="text"
            value={form.bank_name}
            onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
            placeholder="Bank name"
            required
          />
          <input
            type="text"
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            placeholder="Account name"
            required
          />
          <input
            type="text"
            value={form.account_number}
            onChange={(e) => setForm({ ...form, account_number: e.target.value })}
            placeholder="Account number"
          />
          <select
            value={form.member_id}
            onChange={(e) => setForm({ ...form, member_id: e.target.value })}
            required
          >
            <option value="">Select owner</option>
            {(members || []).map((m) => (
              <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
            ))}
          </select>
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={form.is_savings}
              onChange={(e) => setForm({ ...form, is_savings: e.target.checked })}
            />
            <span>Savings</span>
          </label>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && (
        <div className="card">
          {(!accounts || accounts.length === 0) ? (
            <p className="empty">No accounts yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Account Name</th>
                  <th>Account Number</th>
                  <th>Owner</th>
                  <th>Savings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id}>
                    <td>
                      {editId === a.id ? (
                        <input
                          type="text"
                          value={editForm.bank_name}
                          onChange={(e) => setEditForm({ ...editForm, bank_name: e.target.value })}
                        />
                      ) : (
                        a.bank_name
                      )}
                    </td>
                    <td>
                      {editId === a.id ? (
                        <input
                          type="text"
                          value={editForm.nickname}
                          onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                        />
                      ) : (
                        a.nickname
                      )}
                    </td>
                    <td>
                      {editId === a.id ? (
                        <input
                          type="text"
                          value={editForm.account_number}
                          onChange={(e) => setEditForm({ ...editForm, account_number: e.target.value })}
                        />
                      ) : (
                        <Redacted>{a.account_number}</Redacted>
                      )}
                    </td>
                    <td>
                      {editId === a.id ? (
                        <select
                          value={editForm.member_id}
                          onChange={(e) => setEditForm({ ...editForm, member_id: e.target.value })}
                        >
                          <option value="">Select owner</option>
                          {(members || []).map((m) => (
                            <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                          ))}
                        </select>
                      ) : (
                        memMap[a.member_id] || a.member_id
                      )}
                    </td>
                    <td>
                      {editId === a.id ? (
                        <label className="form-checkbox-label">
                          <input
                            type="checkbox"
                            checked={editForm.is_savings}
                            onChange={(e) => setEditForm({ ...editForm, is_savings: e.target.checked })}
                          />
                          <span>Savings</span>
                        </label>
                      ) : a.is_savings === 'true' ? (
                        <span className="settings-account-savings-badge">Savings</span>
                      ) : (
                        <span className="u-muted">—</span>
                      )}
                    </td>
                    <td>
                      {editId === a.id ? (
                        <>
                          <Button variant="primary" size="sm" onClick={() => handleUpdate(a.id)}>Save</Button>
                          <Button size="sm" onClick={() => setEditId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => startEdit(a)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>Delete</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      </PageMain>
    </PageRoot>
  );
}
