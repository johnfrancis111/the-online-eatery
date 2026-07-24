import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/orderApi';
import { formatCurrency } from '../utils/format';

export default function Checkout() {
  const { items, estimatedTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const [address, setAddress] = useState({
    street: defaultAddress?.street || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    zipCode: defaultAddress?.zipCode || '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map(({ menuItem, quantity }) => ({ menuItem: menuItem._id, quantity })),
        deliveryAddress: address,
      });
      clearCart();
      navigate(`/orders/${order._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
        <h1 className="mb-1 text-3xl">Delivery details</h1>

        {error && (
          <p className="rounded-lg border border-pepper/30 bg-pepper/10 px-3 py-2 text-sm text-pepper">{error}</p>
        )}

        <div>
          <label className="field-label" htmlFor="street">Street address</label>
          <input id="street" name="street" required value={address.street} onChange={handleChange} className="field-input" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="city">City</label>
            <input id="city" name="city" required value={address.city} onChange={handleChange} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="state">State</label>
            <input id="state" name="state" required value={address.state} onChange={handleChange} className="field-input" />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="zipCode">Zip code</label>
          <input id="zipCode" name="zipCode" required value={address.zipCode} onChange={handleChange} className="field-input" />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>

      <aside className="card h-fit p-5">
        <h2 className="mb-4 text-lg">Order summary</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map(({ menuItem, quantity }) => (
            <li key={menuItem._id} className="flex justify-between text-ivory-300/70">
              <span>
                {quantity} &times; {menuItem.name}
              </span>
              <span className="font-mono">{formatCurrency(menuItem.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-ivory-300/10 pt-4 text-sm">
          <span>Estimated total</span>
          <span className="font-mono text-turmeric">{formatCurrency(estimatedTotal)}</span>
        </div>
      </aside>
    </div>
  );
}
