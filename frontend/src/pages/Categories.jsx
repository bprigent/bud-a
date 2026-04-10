import { useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api';
import { useData } from '../hooks/useData';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import { PageRoot } from './PageRoot.styled';

export default function Categories() {
  const { data: categories, loading, error, refetch } = useData(getCategories, 'categories.csv');

  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      await createCategory({ name: form.name.trim() });
      setForm({ name: '' });
      refetch();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setEditForm({ name: cat.name });
  };

  const handleUpdate = async (id) => {
    if (!editForm.name.trim()) return;
    try {
      await updateCategory(id, { name: editForm.name.trim() });
      setEditId(null);
      refetch();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      refetch();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <PageRoot className="page">
      <PageHeader
        title="Categories"
        subtitle="Labels used to classify income and expenses."
      />
      <PageMain>
      <div className="card">
        <h2>Add Category</h2>
        <form onSubmit={handleAdd} className="inline-form">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Category name"
            required
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
          {(!categories || categories.length === 0) ? (
            <p className="empty">No categories yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {editId === c.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate(c.id)}
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td>
                      {editId === c.id ? (
                        <>
                          <Button variant="primary" size="sm" onClick={() => handleUpdate(c.id)}>Save</Button>
                          <Button size="sm" onClick={() => setEditId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => startEdit(c)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>
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
