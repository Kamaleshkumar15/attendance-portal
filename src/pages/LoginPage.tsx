import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status, error } = useAuth();
  const defaultCreds = authService.getDefaultCredentials();
  const [form, setForm] = useState({
    email: defaultCreds.email,
    password: defaultCreds.password,
    remember: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form.email, form.password, form.remember);
    const redirect = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';
    navigate(redirect, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #FFFFFF, #25E1EB)',
        padding: '1rem',
      }}
    >
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <h1 style={{ marginTop: 0 }}>Attend Login</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
          Enter your credentials to access the attendance portal.
        </p>
        {error && (
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(248, 113, 113, 0.15)',
              borderRadius: '0.75rem',
              color: '#dc2626',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}
        <form className="grid" style={{ gap: '1rem' }} onSubmit={handleSubmit}>
          <label className="grid">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ padding: '0.65rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
            />
          </label>
          <label className="grid">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ padding: '0.65rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            <span>Remember this device</span>
          </label>
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in...' : 'Login'}
          </Button>
          <small style={{ color: '#94a3b8' }}>
            Tip: Default credentials are prefilled ({defaultCreds.email} / {defaultCreds.password})
          </small>
        </form>
      </div>
    </div>
  );
};

