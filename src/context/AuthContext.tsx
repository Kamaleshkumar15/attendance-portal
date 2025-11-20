import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '../services/authService';
import type { AuthUser } from '../types';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  error?: string;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const session = authService.loadSession();
  const [user, setUser] = useState<AuthUser | null>(session);
  const [status, setStatus] = useState<AuthStatus>(session ? 'authenticated' : 'idle');
  const [error, setError] = useState<string>();

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    setStatus('loading');
    setError(undefined);
    try {
      const authenticatedUser = await authService.login(email, password, remember);
      setUser(authenticatedUser);
      setStatus('authenticated');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unable to login');
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setStatus('idle');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      error,
      login,
      logout,
    }),
    [error, login, logout, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

