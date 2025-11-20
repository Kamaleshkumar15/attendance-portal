import type { AttendanceStatus, OdStatus, ReportStatus } from '../../types';

type StatusType = AttendanceStatus | OdStatus | ReportStatus;

const palette: Record<StatusType, { bg: string; color: string }> = {
  present: { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' },
  absent: { bg: 'rgba(220,38,38,0.12)', color: '#dc2626' },
  od: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  pending: { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
  approved: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  rejected: { bg: 'rgba(248,113,113,0.12)', color: '#ef4444' },
  draft: { bg: 'rgba(244,114,182,0.12)', color: '#db2777' },
  review: { bg: 'rgba(14,165,233,0.12)', color: '#0ea5e9' },
  published: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  archived: { bg: 'rgba(148,163,184,0.2)', color: '#475569' },
};

export const StatusBadge = ({ status }: { status: StatusType }) => (
  <span
    className={`status-pill ${status}`}
    style={{
      background: palette[status].bg,
      color: palette[status].color,
    }}
  >
    {status.toUpperCase()}
  </span>
);

