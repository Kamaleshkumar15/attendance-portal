import { useState } from 'react';
import type { AttendanceEntry, AttendanceStatus, Student } from '../../types';
import { Button } from '../ui/Button';

interface AttendanceFormProps {
  students: Student[];
  initial?: AttendanceEntry;
  defaultStatus?: AttendanceStatus;
  onSubmit: (payload: Omit<AttendanceEntry, 'id'>, id?: string) => Promise<void>;
  onCancel: () => void;
}

export const AttendanceForm = ({
  students,
  initial,
  defaultStatus = 'present',
  onSubmit,
  onCancel,
}: AttendanceFormProps) => {
  const [form, setForm] = useState({
    studentId: initial?.studentId ?? students[0]?.id ?? '',
    status: initial?.status ?? defaultStatus,
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    time: initial?.time ?? new Date().toISOString().slice(11, 16),
    notes: initial?.notes ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form, initial?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="grid" style={{ gap: '1rem' }}>
      <label className="grid">
        <span>Student</span>
        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          required
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} • {student.grade}
            </option>
          ))}
        </select>
      </label>

      <label className="grid">
        <span>Status</span>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="od">OD</option>
        </select>
      </label>

      <label className="grid">
        <span>Date</span>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        />
      </label>

      <label className="grid">
        <span>Time</span>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        />
      </label>

      <label className="grid">
        <span>Notes</span>
        <input
          type="text"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Optional"
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        />
      </label>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? 'Update' : 'Create'} Entry</Button>
      </div>
    </form>
  );
};

