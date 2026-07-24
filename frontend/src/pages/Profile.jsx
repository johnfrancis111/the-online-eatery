import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const emptyAddress = { label: '', street: '', city: '', state: '', zipCode: '', isDefault: false };

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phoneNumber: user?.phoneNumber || '' });
  const [addresses, setAddresses] = useState(user?.addresses?.length ? user.addresses : []);
  const [status, setStatus] = useState({ error: '', success: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAddressChange = (index, field, value) => {
    setAddresses((prev) => prev.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr)));
  };

  const addAddress = () => setAddresses((prev) => [...prev, { ...emptyAddress }]);
  const removeAddress = (index) => setAddresses((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', success: '' });
    setSubmitting(true);
    try {
      await updateProfile({ ...form, addresses });
      setStatus({ error: '', success: 'Profile updated.' });
    } catch (err) {
      setStatus({ error: err.message, success: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <p className="eyebrow mb-2">Your account</p>
      <h1 className="mb-6 text-3xl">Profile</h1>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6">
        {status.error && (
          <p className="rounded-lg border border-pepper/30 bg-pepper/10 px-3 py-2 text-sm text-pepper">{status.error}</p>
        )}
        {status.success && (
          <p className="rounded-lg border border-basil/30 bg-basil/10 px-3 py-2 text-sm text-basil">{status.success}</p>
        )}

        <div>
          <label className="field-label" htmlFor="name">Full name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} className="field-input" />
        </div>

        <div>
          <label className="field-label">Email</label>
          <input value={user?.email || ''} disabled className="field-input opacity-60" />
        </div>

        <div>
          <label className="field-label" htmlFor="phoneNumber">Phone number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="field-label !mb-0">Saved addresses</span>
            <button type="button" onClick={addAddress} className="text-xs text-turmeric hover:underline">
              + Add address
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {addresses.map((addr, i) => (
              <div key={addr._id || i} className="rounded-xl border border-ivory-300/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <input
                    placeholder="Label (e.g. Home)"
                    value={addr.label || ''}
                    onChange={(e) => handleAddressChange(i, 'label', e.target.value)}
                    className="field-input !w-40 !py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeAddress(i)}
                    className="text-xs text-ivory-300/50 hover:text-pepper"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Street"
                    value={addr.street || ''}
                    onChange={(e) => handleAddressChange(i, 'street', e.target.value)}
                    className="field-input col-span-2 !py-1.5 text-sm"
                  />
                  <input
                    placeholder="City"
                    value={addr.city || ''}
                    onChange={(e) => handleAddressChange(i, 'city', e.target.value)}
                    className="field-input !py-1.5 text-sm"
                  />
                  <input
                    placeholder="State"
                    value={addr.state || ''}
                    onChange={(e) => handleAddressChange(i, 'state', e.target.value)}
                    className="field-input !py-1.5 text-sm"
                  />
                  <input
                    placeholder="Zip code"
                    value={addr.zipCode || ''}
                    onChange={(e) => handleAddressChange(i, 'zipCode', e.target.value)}
                    className="field-input !py-1.5 text-sm"
                  />
                </div>
              </div>
            ))}
            {addresses.length === 0 && (
              <p className="text-sm text-ivory-300/40">No saved addresses yet.</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
