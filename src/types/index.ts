export type AttendanceStatus = 'present' | 'absent' | 'od';
export type OdStatus = 'pending' | 'approved' | 'rejected';
export type ReportStatus = 'draft' | 'review' | 'published' | 'archived';

export interface Student {
  id: string;
  name: string;
  grade: string;
  avatar: string;
}

export interface AttendanceEntry {
  id: string;
  studentId: string;
  status: AttendanceStatus;
  date: string; // ISO date
  time: string; // HH:mm
  notes?: string;
}

export interface OdRequest {
  id: string;
  studentId: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: OdStatus;
  notes?: string;
}

export interface MonthlyReport {
  id: string;
  month: string; // YYYY-MM
  presentCount: number;
  absentCount: number;
  odCount: number;
  generatedAt: string;
  notes?: string;
  status: ReportStatus;
}

export interface AttendanceData {
  students: Student[];
  attendanceEntries: AttendanceEntry[];
  odRequests: OdRequest[];
  monthlyReports: MonthlyReport[];
}

export interface AuthUser {
  name: string;
  email: string;
  token: string;
  role: 'admin' | 'staff';
}

