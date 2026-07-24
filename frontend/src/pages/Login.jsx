import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const session = await login(form);
      navigate(session.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <p className="eyebrow mb-2">Welcome back</p>
      <h1 className="mb-6 text-3xl">Log in</h1>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
        {error && (
          <p className="rounded-lg border border-pepper/30 bg-pepper/10 px-3 py-2 text-sm text-pepper">{error}</p>
        )}

        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="field-input"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="field-input"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ivory-300/60">
        New here?{' '}
        <Link to="/register" className="text-turmeric hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
