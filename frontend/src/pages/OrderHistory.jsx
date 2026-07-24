import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderApi';
import { formatCurrency, formatDate } from '../utils/format';
import StatusBadge from '../components/StatusBadge.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner full />;
  if (error) return <EmptyState title="Couldn't load your orders" description={error} />;
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Once you place an order, it'll show up here."
        action={
          <Link to="/" className="btn-primary mt-2">
            Browse the menu
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl">My orders</h1>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="card flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:border-turmeric/40"
          >
            <div>
              <p className="font-mono text-xs text-ivory-300/50">#{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-ivory-300/70">{formatDate(order.createdAt)}</p>
            </div>
            <p className="text-sm text-ivory-300/60">
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </p>
            <p className="font-mono text-sm text-turmeric">{formatCurrency(order.totalAmount)}</p>
            <StatusBadge status={order.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
