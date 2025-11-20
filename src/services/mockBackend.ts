import type { AttendanceData, AttendanceEntry, MonthlyReport, OdRequest } from '../types';

const NETWORK_DELAY = 350;

const wait = (delay = NETWORK_DELAY) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

let inMemoryData: AttendanceData | null = null;

export const mockBackend = {
  async sync(data: AttendanceData): Promise<void> {
    inMemoryData = structuredClone(data);
    await wait();
  },
  async getData(): Promise<AttendanceData | null> {
    await wait();
    return inMemoryData ? structuredClone(inMemoryData) : null;
  },
  async persistAttendance(entries: AttendanceEntry[]): Promise<void> {
    if (!inMemoryData) return;
    inMemoryData.attendanceEntries = structuredClone(entries);
    await wait();
  },
  async persistOdRequests(requests: OdRequest[]): Promise<void> {
    if (!inMemoryData) return;
    inMemoryData.odRequests = structuredClone(requests);
    await wait();
  },
  async persistReports(reports: MonthlyReport[]): Promise<void> {
    if (!inMemoryData) return;
    inMemoryData.monthlyReports = structuredClone(reports);
    await wait();
  },
  async authenticate(email: string, password: string): Promise<{ token: string }> {
    await wait();
    const hash = btoa(`${email}:${password}:${Date.now()}`);
    return { token: hash };
  },
  reset(): void {
    inMemoryData = null;
  },
};

