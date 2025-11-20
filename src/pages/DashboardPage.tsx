import { useMemo, useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import type { AttendanceEntry, AttendanceStatus, OdRequest } from '../types';
import { SummaryWidgets } from '../components/attendance/SummaryWidgets';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { AttendanceForm } from '../components/attendance/AttendanceForm';
import { OdForm } from '../components/attendance/OdForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ImageLinkGallery } from '../components/media/ImageLinkGallery';
import { AttendanceDetailView } from '../components/media/AttendanceDetailView';
import { useModal } from '../hooks/useModal';
import { EmptyState } from '../components/ui/EmptyState';

const tabs: AttendanceStatus[] = ['present', 'absent', 'od'];

export const DashboardPage = () => {
  const {
    students,
    attendanceEntries,
    odRequests,
    loading,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    addOdRequest,
    updateOdRequest,
    deleteOdRequest,
    getAttendanceByStatus,
  } = useAttendance();

  const [activeTab, setActiveTab] = useState<AttendanceStatus>('present');
  const [selectedEntry, setSelectedEntry] = useState<AttendanceEntry>();
  const [selectedOd, setSelectedOd] = useState<OdRequest>();

  const attendanceModal = useModal();
  const odModal = useModal();
  const detailModal = useModal();

  const filteredEntries = useMemo(
    () => getAttendanceByStatus(activeTab),
    [activeTab, getAttendanceByStatus],
  );

  const handleCreateAttendance = () => {
    setSelectedEntry(undefined);
    attendanceModal.open();
  };

  const handleEditAttendance = (entry: AttendanceEntry) => {
    setSelectedEntry(entry);
    attendanceModal.open();
  };

  const submitAttendance = async (payload: Omit<AttendanceEntry, 'id'>, id?: string) => {
    if (id) {
      await updateAttendance(id, payload);
    } else {
      await addAttendance(payload);
    }
    attendanceModal.close();
  };

  const handleCreateOd = () => {
    setSelectedOd(undefined);
    odModal.open();
  };

  const handleEditOd = (request: OdRequest) => {
    setSelectedOd(request);
    odModal.open();
  };

  const submitOd = async (payload: Omit<OdRequest, 'id'>, id?: string) => {
    if (id) {
      await updateOdRequest(id, payload);
    } else {
      await addOdRequest(payload);
    }
    odModal.close();
  };

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Attendance Control Center</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Monitor daily presence, absences, and OD movements in one place.
          </p>
        </div>
        <Button onClick={handleCreateAttendance}>Add Attendance</Button>
      </div>

      <SummaryWidgets entries={attendanceEntries} />

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <small style={{ color: '#94a3b8' }}>
            {filteredEntries.length} entries in {activeTab.toUpperCase()}
          </small>
        </div>
        <div style={{ marginTop: '1rem' }}>
          {loading ? (
            <Loader label="Loading attendance..." />
          ) : (
            <AttendanceTable
              entries={filteredEntries}
              students={students}
              onEdit={handleEditAttendance}
              onDelete={(id) => deleteAttendance(id)}
            />
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>On Duty (OD) List</h2>
          <Button onClick={handleCreateOd}>New OD</Button>
        </div>
        {odRequests.length === 0 ? (
          <EmptyState title="No OD requests yet" description="Log OD movements to track students." />
        ) : (
          <table className="table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Destination</th>
                <th>Dates</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {odRequests.map((request) => {
                const student = students.find((s) => s.id === request.studentId);
                return (
                  <tr key={request.id}>
                    <td>{student?.name}</td>
                    <td>{request.destination}</td>
                    <td>
                      {request.startDate} → {request.endDate}
                    </td>
                    <td>
                      <StatusBadge status={request.status} />
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        variant="ghost"
                        onClick={() => handleEditOd(request)}
                        style={{ padding: '0.35rem 0.75rem' }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteOdRequest(request.id)}
                        style={{ padding: '0.35rem 0.75rem' }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Quick Links</h2>
        <p style={{ color: '#64748b' }}>
          Click any image to jump to a Google Sheet, download Excel, or open a detail sheet inside
          the app instantly.
        </p>
        <ImageLinkGallery
          attendance={attendanceEntries}
          students={students}
          onOpenDetail={detailModal.open}
        />
      </div>

      {attendanceModal.isOpen && (
        <Modal
          title={selectedEntry ? 'Edit Attendance' : 'Add Attendance'}
          onClose={attendanceModal.close}
        >
          <AttendanceForm
            students={students}
            initial={selectedEntry}
            defaultStatus={activeTab}
            onSubmit={submitAttendance}
            onCancel={attendanceModal.close}
          />
        </Modal>
      )}

      {odModal.isOpen && (
        <Modal title={selectedOd ? 'Edit OD' : 'New OD'} onClose={odModal.close}>
          <OdForm
            students={students}
            initial={selectedOd}
            onSubmit={submitOd}
            onCancel={odModal.close}
          />
        </Modal>
      )}

      {detailModal.isOpen && (
        <Modal title="Attendance Detail View" onClose={detailModal.close}>
          <AttendanceDetailView attendance={attendanceEntries} students={students} />
        </Modal>
      )}
    </div>
  );
};

