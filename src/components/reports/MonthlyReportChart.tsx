import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';
import type { MonthlyReport } from '../../types';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

interface MonthlyReportChartProps {
  reports: MonthlyReport[];
}

export const MonthlyReportChart = ({ reports }: MonthlyReportChartProps) => {
  const labels = reports.map((report) => report.month);
  const data = {
    labels,
    datasets: [
      {
        label: 'Present',
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        data: reports.map((report) => report.presentCount),
      },
      {
        label: 'Absent',
        backgroundColor: 'rgba(248, 113, 113, 0.7)',
        data: reports.map((report) => report.absentCount),
      },
      {
        label: 'OD',
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        data: reports.map((report) => report.odCount),
      },
    ],
  };

  return (
    <div className="card">
      <h3>Monthly Attendance Summary</h3>
      <Bar data={data} />
    </div>
  );
};

