import type { AttendanceEntry, Student } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface AttendanceDetailViewProps {
  attendance: AttendanceEntry[];
  students: Student[];
}

export const AttendanceDetailView = ({ attendance, students }: AttendanceDetailViewProps) => {
  const studentLookup = Object.fromEntries(students.map((student) => [student.id, student]));

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Quick Snapshot</h3>
      <p style={{ color: '#64748b' }}>
        View all attendance records in a detailed table format.
      </p>
      <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Status</th>
              <th>Date</th>
              <th>Time</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((entry) => (
              <tr key={entry.id}>
                <td>{studentLookup[entry.studentId]?.name ?? 'Unknown'}</td>
                <td>
                  <StatusBadge status={entry.status} />
                </td>
                <td>{entry.date}</td>
                <td>{entry.time}</td>
                <td>{entry.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

