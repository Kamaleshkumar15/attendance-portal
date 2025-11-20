import { useState } from 'react';
import type { OdRequest, Student } from '../../types';
import { Button } from '../ui/Button';

interface OdFormProps {
  students: Student[];
  initial?: OdRequest;
  onSubmit: (payload: Omit<OdRequest, 'id'>, id?: string) => Promise<void>;
  onCancel: () => void;
}

export const OdForm = ({ students, initial, onSubmit, onCancel }: OdFormProps) => {
  const [form, setForm] = useState({
    studentId: initial?.studentId ?? students[0]?.id ?? '',
    destination: initial?.destination ?? '',
    startDate: initial?.startDate ?? new Date().toISOString().slice(0, 10),
    endDate: initial?.endDate ?? new Date().toISOString().slice(0, 10),
    status: initial?.status ?? 'pending',
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
              {student.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid">
        <span>Destination</span>
        <input
          type="text"
          name="destination"
          value={form.destination}
          onChange={handleChange}
          required
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        />
      </label>

      <label className="grid">
        <span>Start Date</span>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        />
      </label>

      <label className="grid">
        <span>End Date</span>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        />
      </label>

      <label className="grid">
        <span>Status</span>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
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
        <Button type="submit">{initial ? 'Update' : 'Create'} OD</Button>
      </div>
    </form>
  );
};

