import seed from '../data/seed.json';
import type {
  AttendanceData,
  AttendanceEntry,
  MonthlyReport,
  OdRequest,
} from '../types';
import { localStorageService } from './localStorageService';
import { mockBackend } from './mockBackend';
import { v4 as uuid } from 'uuid';

const STORAGE_KEY = 'attendance-portal-data';

const coerceData = (data: AttendanceData | null | undefined): AttendanceData => {
  if (data) return data;
  return structuredClone(seed) as AttendanceData;
};

const persist = async (data: AttendanceData) => {
  localStorageService.set(STORAGE_KEY, data);
  await mockBackend.sync(data);
};

const initialize = async (): Promise<AttendanceData> => {
  const local = localStorageService.get<AttendanceData>(STORAGE_KEY);
  const backend = await mockBackend.getData();
  const initial = coerceData(backend ?? local);
  localStorageService.set(STORAGE_KEY, initial);
  if (!backend) {
    await mockBackend.sync(initial);
  }
  return initial;
};

const getSnapshot = async (): Promise<AttendanceData> => {
  const local = localStorageService.get<AttendanceData>(STORAGE_KEY);
  return local ?? await initialize();
};

export const dataService = {
  initialize,
  getSnapshot,
  async createAttendance(entry: Omit<AttendanceEntry, 'id'>): Promise<AttendanceEntry> {
    const data = await getSnapshot();
    const newEntry: AttendanceEntry = { ...entry, id: `att-${uuid()}` };
    const attendanceEntries = [...data.attendanceEntries, newEntry];
    const updated = { ...data, attendanceEntries };
    await persist(updated);
    return newEntry;
  },
  async updateAttendance(id: string, updates: Partial<AttendanceEntry>): Promise<AttendanceEntry> {
    const data = await getSnapshot();
    const attendanceEntries = data.attendanceEntries.map((entry) =>
      entry.id === id ? { ...entry, ...updates } : entry,
    );
    const updatedEntry = attendanceEntries.find((entry) => entry.id === id);
    if (!updatedEntry) {
      throw new Error('Attendance entry not found');
    }
    await persist({ ...data, attendanceEntries });
    return updatedEntry;
  },
  async deleteAttendance(id: string): Promise<void> {
    const data = await getSnapshot();
    const attendanceEntries = data.attendanceEntries.filter((entry) => entry.id !== id);
    await persist({ ...data, attendanceEntries });
  },
  async createOdRequest(request: Omit<OdRequest, 'id'>): Promise<OdRequest> {
    const data = await getSnapshot();
    const newRequest: OdRequest = { ...request, id: `od-${uuid()}` };
    const odRequests = [...data.odRequests, newRequest];
    await persist({ ...data, odRequests });
    return newRequest;
  },
  async updateOdRequest(id: string, updates: Partial<OdRequest>): Promise<OdRequest> {
    const data = await getSnapshot();
    const odRequests = data.odRequests.map((request) =>
      request.id === id ? { ...request, ...updates } : request,
    );
    const updated = odRequests.find((request) => request.id === id);
    if (!updated) throw new Error('OD request not found');
    await persist({ ...data, odRequests });
    return updated;
  },
  async deleteOdRequest(id: string): Promise<void> {
    const data = await getSnapshot();
    const odRequests = data.odRequests.filter((request) => request.id !== id);
    await persist({ ...data, odRequests });
  },
  async upsertReport(report: MonthlyReport): Promise<MonthlyReport> {
    const data = await getSnapshot();
    const existing = data.monthlyReports.some((r) => r.id === report.id);
    const monthlyReports = existing
      ? data.monthlyReports.map((r) => (r.id === report.id ? report : r))
      : [...data.monthlyReports, report];
    await persist({ ...data, monthlyReports });
    return report;
  },
  async updateReportStatus(id: string, status: MonthlyReport['status']): Promise<MonthlyReport> {
    const data = await getSnapshot();
    const monthlyReports = data.monthlyReports.map((report) =>
      report.id === id ? { ...report, status } : report,
    );
    const updated = monthlyReports.find((report) => report.id === id);
    if (!updated) throw new Error('Report not found');
    await persist({ ...data, monthlyReports });
    return updated;
  },
};

