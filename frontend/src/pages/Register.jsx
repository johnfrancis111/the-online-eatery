import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <p className="eyebrow mb-2">Join the table</p>
      <h1 className="mb-6 text-3xl">Create an account</h1>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
        {error && (
          <p className="rounded-lg border border-pepper/30 bg-pepper/10 px-3 py-2 text-sm text-pepper">{error}</p>
        )}

        <div>
          <label className="field-label" htmlFor="name">Full name</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} className="field-input" />
        </div>

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
          />
        </div>

        <div>
          <label className="field-label" htmlFor="phoneNumber">Phone number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            required
            value={form.phoneNumber}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ivory-300/60">
        Already have an account?{' '}
        <Link to="/login" className="text-turmeric hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
