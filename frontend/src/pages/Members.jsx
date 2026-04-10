import { useState } from 'react';
import { getMembers, createMember, updateMember, deleteMember } from '../api';
import { useData } from '../hooks/useData';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import { PageRoot } from './PageRoot.styled';

export default function Members() {
  const { data: members, loading, error, refetch } = useData(getMembers, 'members.csv');

  const [form, setForm] = useState({ first_name: '', last_name: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim()) return;
    setSubmitting(true);
    try {
      await createMember({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: '',
        phone: '',
      });
      setForm({ first_name: '', last_name: '' });
      refetch();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (member) => {
    setEditId(member.id);
    setEditForm({ first_name: member.first_name, last_name: member.last_name });
  };

  const handleUpdate = async (id) => {
    if (!editForm.first_name.trim()) return;
    try {
      await updateMember(id, {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
      });
      setEditId(null);
      refetch();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    try {
      await deleteMember(id);
      refetch();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <PageRoot className="page">
      <PageHeader
        title="Family Members"
        subtitle="People in your household for tagging and reporting."
      />
      <PageMain>
      <div className="card">
        <h2>Add Member</h2>
        <form onSubmit={handleAdd} className="inline-form">
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            placeholder="First name"
            required
          />
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            placeholder="Last name"
          />
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && (
        <div className="card">
          {(!members || members.length === 0) ? (
            <p className="empty">No members yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Color</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const memberColor = m.color || '#3b82f6';
                  return (
                  <tr key={m.id}>
                    <td>
                      {editId === m.id ? (
                          <input
                            type="text"
                            value={editForm.first_name}
                            onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(m.id)}
                            placeholder="First name"
                          />
                      ) : (
                        m.first_name
                      )}
                    </td>
                    <td>
                      {editId === m.id ? (
                          <input
                            type="text"
                            value={editForm.last_name}
                            onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(m.id)}
                            placeholder="Last name"
                          />
                      ) : (
                        (m.last_name || '').trim() ? m.last_name : <span className="u-muted">—</span>
                      )}
                    </td>
                    <td className="settings-member-color-cell">
                      <span
                        className="member-color-dot member-color-dot--column"
                        style={{ '--dot-color': memberColor }}
                        role="img"
                        aria-label={`Member color ${memberColor}`}
                        title={memberColor}
                      />
                    </td>
                    <td>
                      {editId === m.id ? (
                        <>
                          <Button variant="primary" size="sm" onClick={() => handleUpdate(m.id)}>Save</Button>
                          <Button size="sm" onClick={() => setEditId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => startEdit(m)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(m.id)}>Delete</Button>
                        </>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      </PageMain>
    </PageRoot>
  );
}
