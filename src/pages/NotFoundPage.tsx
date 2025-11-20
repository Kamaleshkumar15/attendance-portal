import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }}
  >
    <h1>404</h1>
    <p>We couldn&apos;t find the page you were looking for.</p>
    <Link to="/dashboard" style={{ color: 'var(--accent)' }}>
      Back to dashboard
    </Link>
  </div>
);

