import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../ui/Loader';

export const ProtectedRoute = () => {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div style={{ padding: '4rem' }}>
        <Loader label="Checking access..." />
      </div>
    );
  }

  if (!user || status !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

