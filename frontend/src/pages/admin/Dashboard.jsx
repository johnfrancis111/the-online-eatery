import { useEffect, useState } from 'react';
import { getDashboardMetrics } from '../../services/orderApi';
import { formatCurrency } from '../../utils/format';
import Spinner from '../../components/Spinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardMetrics()
      .then(setMetrics)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner full />;
  if (error) return <EmptyState title="Couldn't load metrics" description={error} />;

  const cards = [
    { label: 'Total orders', value: metrics.totalOrders },
    { label: 'Pending orders', value: metrics.pendingOrders },
    { label: 'Total revenue', value: formatCurrency(metrics.totalRevenue) },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card p-6">
            <p className="eyebrow mb-2">{c.label}</p>
            <p className="font-display text-3xl">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
