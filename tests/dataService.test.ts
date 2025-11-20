import { beforeEach, describe, expect, it } from 'vitest';
import { dataService } from '../src/services/dataService';
import { mockBackend } from '../src/services/mockBackend';

describe('dataService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockBackend.reset();
  });

  it('initializes from seed when no local data exists', async () => {
    const data = await dataService.initialize();
    expect(data.students.length).toBeGreaterThan(0);
    expect(data.attendanceEntries.length).toBeGreaterThan(0);
  });

  it('creates a new attendance entry and persists it', async () => {
    await dataService.initialize();
    const entry = await dataService.createAttendance({
      studentId: 'stu-001',
      status: 'present',
      date: '2025-02-01',
      time: '08:10',
      notes: 'Arrived with project kit',
    });
    expect(entry.id).toMatch(/^att-/);
    const snapshot = await dataService.getSnapshot();
    const created = snapshot.attendanceEntries.find((e) => e.id === entry.id);
    expect(created).toBeTruthy();
    expect(created?.notes).toBe('Arrived with project kit');
  });
});

