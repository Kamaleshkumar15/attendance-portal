import type { AttendanceEntry, Student } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

interface AttendanceTableProps {
  entries: AttendanceEntry[];
  students: Student[];
  onEdit: (entry: AttendanceEntry) => void;
  onDelete: (id: string) => void;
}

export const AttendanceTable = ({ entries, students, onEdit, onDelete }: AttendanceTableProps) => {
  const studentLookup = Object.fromEntries(students.map((student) => [student.id, student]));

  if (!entries.length) {
    return <p style={{ color: '#94a3b8' }}>No records yet.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Status</th>
          <th>Date</th>
          <th>Time</th>
          <th>Notes</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={studentLookup[entry.studentId]?.avatar}
                  alt={studentLookup[entry.studentId]?.name}
                  width={36}
                  height={36}
                  style={{ borderRadius: '999px', objectFit: 'cover' }}
                />
                <div>
                  <strong>{studentLookup[entry.studentId]?.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {studentLookup[entry.studentId]?.grade}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <StatusBadge status={entry.status} />
            </td>
            <td>{entry.date}</td>
            <td>{entry.time}</td>
            <td>{entry.notes ?? '—'}</td>
            <td style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="ghost"
                onClick={() => onEdit(entry)}
                style={{ padding: '0.35rem 0.75rem' }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete(entry.id)}
                style={{ padding: '0.35rem 0.75rem' }}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

