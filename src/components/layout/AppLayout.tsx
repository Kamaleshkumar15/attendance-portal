import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/monitoring', label: 'Monitoring' },
  { to: '/reports', label: 'Reports' },
];

export const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">PulseAttend</div>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Smart attendance & OD monitoring
          </p>
        </div>
        <nav className="nav-list">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontWeight: 600 }}>{user?.name}</div>
          <div>{user?.email}</div>
          <button
            type="button"
            onClick={logout}
            style={{
              marginTop: '0.75rem',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: '#fff',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

