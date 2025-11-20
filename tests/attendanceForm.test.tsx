import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AttendanceForm } from '../src/components/attendance/AttendanceForm';

describe('AttendanceForm', () => {
  it('submits with the provided values', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleCancel = vi.fn();
    render(
      <AttendanceForm
        students={[
          { id: 'stu-001', name: 'Test Student', grade: '10', avatar: '' },
          { id: 'stu-002', name: 'Second Student', grade: '11', avatar: '' },
        ]}
        defaultStatus="present"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />,
    );
    await userEvent.selectOptions(screen.getByLabelText(/student/i), 'stu-002');
    await userEvent.selectOptions(screen.getByLabelText(/status/i), 'absent');
    await userEvent.type(screen.getByLabelText(/notes/i), 'Fever');
    await userEvent.click(screen.getByRole('button', { name: /create entry/i }));
    expect(handleSubmit).toHaveBeenCalled();
    const payload = handleSubmit.mock.calls[0][0];
    expect(payload.studentId).toBe('stu-002');
    expect(payload.status).toBe('absent');
    expect(payload.notes).toContain('Fever');
  });
});

