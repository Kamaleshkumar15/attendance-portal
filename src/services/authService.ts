import { localStorageService } from './localStorageService';
import { mockBackend } from './mockBackend';
import type { AuthUser } from '../types';

const CREDENTIALS_KEY = 'attendance-portal-credentials';
const SESSION_KEY = 'attendance-portal-session';

interface Credentials {
  email: string;
  password: string;
  name: string;
}

const defaultCredentials: Credentials = {
  email: 'admin@school.com',
  password: 'admin123',
  name: 'Attendance Admin',
};

const getStoredCredentials = (): Credentials => {
  return localStorageService.get<Credentials>(CREDENTIALS_KEY) ?? defaultCredentials;
};

export const authService = {
  async login(email: string, password: string, remember: boolean): Promise<AuthUser> {
    const credentials = getStoredCredentials();
    if (email !== credentials.email || password !== credentials.password) {
      throw new Error('Invalid email or password');
    }
    const { token } = await mockBackend.authenticate(email, password);
    const user: AuthUser = {
      name: credentials.name,
      email,
      token,
      role: 'admin',
    };
    if (remember) {
      localStorageService.set(SESSION_KEY, user);
    } else {
      localStorageService.remove(SESSION_KEY);
    }
    return user;
  },
  logout(): void {
    localStorageService.remove(SESSION_KEY);
  },
  loadSession(): AuthUser | null {
    return localStorageService.get<AuthUser>(SESSION_KEY);
  },
  updateCredentials(next: Credentials): void {
    localStorageService.set(CREDENTIALS_KEY, next);
  },
  getDefaultCredentials(): Credentials {
    return defaultCredentials;
  },
};

