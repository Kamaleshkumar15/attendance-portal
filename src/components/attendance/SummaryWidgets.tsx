import type { AttendanceEntry } from '../../types';

interface SummaryWidgetsProps {
  entries: AttendanceEntry[];
}

export const SummaryWidgets = ({ entries }: SummaryWidgetsProps) => {
  const stats = {
    present: entries.filter((entry) => entry.status === 'present').length,
    absent: entries.filter((entry) => entry.status === 'absent').length,
    od: entries.filter((entry) => entry.status === 'od').length,
  };

  return (
    <div className="grid two">
      {Object.entries(stats).map(([status, count]) => (
        <div key={status} className="card">
          <p style={{ margin: 0, color: '#94a3b8', textTransform: 'uppercase' }}>{status}</p>
          <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '2.25rem' }}>{count}</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8' }}>entries recorded</p>
        </div>
      ))}
    </div>
  );
};

