import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/format';
import EmptyState from '../components/EmptyState.jsx';

export default function Cart() {
  const { items, setQuantity, removeItem, estimatedTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the menu and add a plate or two to get started."
        action={
          <Link to="/" className="btn-primary mt-2">
            Back to menu
          </Link>
        }
      />
    );
  }

  const handleCheckout = () => navigate(isAuthenticated ? '/checkout' : '/login', {
    state: isAuthenticated ? undefined : { from: { pathname: '/checkout' } },
  });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl">Your cart</h1>

        {items.map(({ menuItem, quantity }) => (
          <div key={menuItem._id} className="card flex items-center gap-4 p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-char-800">
              {menuItem.imageUrl && (
                <img src={menuItem.imageUrl} alt={menuItem.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{menuItem.name}</p>
              <p className="font-mono text-sm text-turmeric">{formatCurrency(menuItem.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(menuItem._id, quantity - 1)}
                className="btn-ghost h-8 w-8 !p-0 text-lg leading-none"
                aria-label={`Decrease quantity of ${menuItem.name}`}
              >
                −
              </button>
              <span className="w-6 text-center font-mono">{quantity}</span>
              <button
                onClick={() => setQuantity(menuItem._id, quantity + 1)}
                className="btn-ghost h-8 w-8 !p-0 text-lg leading-none"
                aria-label={`Increase quantity of ${menuItem.name}`}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(menuItem._id)}
              className="ml-2 text-xs text-ivory-300/40 hover:text-pepper"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <aside className="card h-fit p-5">
        <h2 className="mb-4 text-lg">Order summary</h2>
        <div className="flex justify-between text-sm text-ivory-300/60">
          <span>Estimated subtotal</span>
          <span className="font-mono text-ivory">{formatCurrency(estimatedTotal)}</span>
        </div>
        <p className="mt-2 text-xs text-ivory-300/40">
          Final pricing is confirmed at checkout using live menu prices.
        </p>
        <button onClick={handleCheckout} className="btn-primary mt-5 w-full">
          Proceed to checkout
        </button>
      </aside>
    </div>
  );
}
