import { useEffect, useState } from 'react';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../../services/menuApi';
import { formatCurrency } from '../../utils/format';
import Spinner from '../../components/Spinner.jsx';

const emptyForm = { name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true };

export default function MenuManage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadItems = () => {
    setLoading(true);
    getMenuItems({ page: 1, limit: 100 })
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadItems, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editingId) {
        await updateMenuItem(editingId, payload);
      } else {
        await createMenuItem(payload);
      }
      cancelEdit();
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item? This cannot be undone.')) return;
    try {
      await deleteMenuItem(id);
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl">Menu</h1>

      <form onSubmit={handleSubmit} className="card mb-8 flex flex-col gap-4 p-6">
        <h2 className="text-lg">{editingId ? 'Edit meal' : 'Add a new meal'}</h2>

        {error && (
          <p className="rounded-lg border border-pepper/30 bg-pepper/10 px-3 py-2 text-sm text-pepper">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="name">Name</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="field-input"
              placeholder="e.g. Rice Dishes"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="price">Price (USD)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={handleChange}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="imageUrl">Image URL</label>
            <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="field-input" />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            required
            rows={2}
            value={form.description}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ivory-300/70">
          <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
          Available on the menu
        </label>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add meal'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="btn-ghost">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Spinner full />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ivory-300/10 text-ivory-300/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300/5">
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3 text-ivory-300/60">{item.category}</td>
                  <td className="px-4 py-3 font-mono text-turmeric">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3">
                    {item.isAvailable ? (
                      <span className="text-basil">Available</span>
                    ) : (
                      <span className="text-ivory-300/40">Unavailable</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(item)} className="mr-3 text-turmeric hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-pepper hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
