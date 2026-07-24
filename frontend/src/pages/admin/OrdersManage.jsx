import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderApi';
import { formatCurrency, formatDate } from '../../utils/format';
import { ORDER_STATUSES, NEXT_STATUS } from '../../utils/constants';
import StatusBadge from '../../components/StatusBadge.jsx';
import Spinner from '../../components/Spinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function OrdersManage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    getAllOrders(statusFilter || undefined)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, [statusFilter]);

  const handleStatusChange = async (order, nextStatus) => {
    setUpdatingId(order._id);
    setError('');
    try {
      const updated = await updateOrderStatus(order._id, nextStatus);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="field-input !w-auto"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-pepper/30 bg-pepper/10 px-3 py-2 text-sm text-pepper">{error}</p>
      )}

      {loading ? (
        <Spinner full />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders found" description="Try a different status filter." />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const nextOptions = NEXT_STATUS[order.status] || [];
            return (
              <div key={order._id} className="card flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-[140px]">
                  <p className="font-mono text-xs text-ivory-300/50">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-ivory-300/70">{formatDate(order.createdAt)}</p>
                </div>
                <div className="min-w-[160px]">
                  <p className="text-sm">{order.user?.name}</p>
                  <p className="text-xs text-ivory-300/50">{order.user?.email}</p>
                </div>
                <p className="text-sm text-ivory-300/60">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
                <p className="font-mono text-sm text-turmeric">{formatCurrency(order.totalAmount)}</p>
                <StatusBadge status={order.status} />

                <div className="ml-auto flex gap-2">
                  {nextOptions.map((next) => (
                    <button
                      key={next}
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusChange(order, next)}
                      className={next === 'Cancelled' ? 'btn-ghost !px-3 !py-1.5 text-xs' : 'btn-secondary !px-3 !py-1.5 text-xs'}
                    >
                      {updatingId === order._id ? '…' : `Mark ${next}`}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
