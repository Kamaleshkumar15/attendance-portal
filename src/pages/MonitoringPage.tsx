import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useAttendance } from '../context/AttendanceContext';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Loader } from '../components/ui/Loader';

export const MonitoringPage = () => {
  const { attendanceEntries, students, refetch, loading } = useAttendance();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  const todayEntries = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return attendanceEntries
      .filter((entry) => entry.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [attendanceEntries]);

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Live Monitoring</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Oversee sign-ins in real time with timestamped entries.
          </p>
        </div>
        <Button onClick={() => refetch()}>Refresh Data</Button>
      </header>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, color: '#94a3b8' }}>Current Date</p>
          <h2 style={{ margin: '0.25rem 0' }}>{now.format('dddd, MMM D, YYYY')}</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, color: '#94a3b8' }}>Live Clock</p>
          <h1 style={{ margin: '0.25rem 0', fontSize: '3rem' }}>{now.format('HH:mm:ss')}</h1>
        </div>
      </div>

      <div className="card">
        <h2>Today&apos;s Activity</h2>
        {loading ? (
          <Loader label="Syncing with mock backend..." />
        ) : todayEntries.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No attendance logged today yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {todayEntries.map((entry) => {
              const student = students.find((s) => s.id === entry.studentId);
              return (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{student?.name}</div>
                      <small style={{ color: '#94a3b8' }}>{student?.grade}</small>
                    </div>
                  </div>
                  <StatusBadge status={entry.status} />
                  <div style={{ fontFamily: 'monospace', fontSize: '1.25rem' }}>{entry.time}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

