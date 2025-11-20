export const localStorageService = {
  get<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    window.localStorage.removeItem(key);
  },
};

