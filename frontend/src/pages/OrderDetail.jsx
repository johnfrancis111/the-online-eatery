import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderApi';
import { formatCurrency, formatDate } from '../utils/format';
import StatusTracker from '../components/StatusTracker.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner full />;
  if (error || !order) {
    return (
      <EmptyState
        title="Order not found"
        description={error || "We couldn't find that order."}
        action={
          <Link to="/orders" className="btn-primary mt-2">
            Back to my orders
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="eyebrow mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
          <h1 className="text-3xl">{formatDate(order.createdAt)}</h1>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="card mb-6 p-6">
        <StatusTracker status={order.status} />
      </div>

      <div className="card mb-6 divide-y divide-ivory-300/10 p-6">
        {order.items.map((line, i) => (
          <div key={i} className="flex justify-between py-2.5 first:pt-0 last:pb-0">
            <span className="text-sm text-ivory-300/80">
              {line.quantity} &times; {line.name}
            </span>
            <span className="font-mono text-sm">{formatCurrency(line.price * line.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 text-base">
          <span>Total</span>
          <span className="font-mono text-turmeric">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-2 text-lg">Delivery address</h2>
        <p className="text-sm text-ivory-300/70">
          {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
          {order.deliveryAddress.zipCode}
        </p>
      </div>
    </div>
  );
}
