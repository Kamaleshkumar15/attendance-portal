import dayjs from 'dayjs';
import { useAttendance } from '../context/AttendanceContext';
import { MonthlyReportChart } from '../components/reports/MonthlyReportChart';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';

export const ReportsPage = () => {
  const { monthlyReports, updateReportStatus } = useAttendance();

  const exportCsv = () => {
    const header = ['Month', 'Present', 'Absent', 'OD', 'Status', 'Generated At'];
    const rows = monthlyReports.map((report) => [
      report.month,
      report.presentCount,
      report.absentCount,
      report.odCount,
      report.status,
      report.generatedAt,
    ]);
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'monthly-attendance.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPdf = () => {
    const html = `
      <html>
        <head>
          <title>Monthly Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Monthly Attendance Report</h1>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Present</th>
                <th>Absent</th>
                <th>OD</th>
                <th>Status</th>
                <th>Generated</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyReports
                .map(
                  (report) => `
                  <tr>
                    <td>${report.month}</td>
                    <td>${report.presentCount}</td>
                    <td>${report.absentCount}</td>
                    <td>${report.odCount}</td>
                    <td>${report.status}</td>
                    <td>${dayjs(report.generatedAt).format('MMM D, YYYY')}</td>
                  </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(html);
      reportWindow.document.close();
      reportWindow.focus();
      reportWindow.print();
    }
  };

  const changeStatus = async (id: string, status: string) => {
    await updateReportStatus(id, status as typeof monthlyReports[number]['status']);
  };

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Reports & Analytics</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Manage monthly summaries and export records for compliance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={exportPdf}>
            Export PDF
          </Button>
          <Button onClick={exportCsv}>Export CSV</Button>
        </div>
      </header>

      <MonthlyReportChart reports={monthlyReports} />

      <div className="card">
        <h2>Manage Reports</h2>
        <table className="table" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Breakdown</th>
              <th>Status</th>
              <th>Generated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {monthlyReports.map((report) => (
              <tr key={report.id}>
                <td>{report.month}</td>
                <td>
                  Present {report.presentCount} • Absent {report.absentCount} • OD {report.odCount}
                </td>
                <td>
                  <StatusBadge status={report.status} />
                </td>
                <td>{dayjs(report.generatedAt).format('MMM D, YYYY')}</td>
                <td>
                  <select
                    value={report.status}
                    onChange={(event) => changeStatus(report.id, event.target.value)}
                    style={{
                      padding: '0.35rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

