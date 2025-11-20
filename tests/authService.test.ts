import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../src/services/authService';

describe('authService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('logs in with default credentials and stores session when remember is true', async () => {
    const creds = authService.getDefaultCredentials();
    const user = await authService.login(creds.email, creds.password, true);
    expect(user.email).toBe(creds.email);
    expect(user.token).toBeTruthy();
    const session = authService.loadSession();
    expect(session?.email).toBe(creds.email);
  });

  it('throws when credentials are invalid', async () => {
    await expect(authService.login('fake@school.com', 'nope', false)).rejects.toThrow(
      /invalid email or password/i,
    );
  });
});

