import type { AttendanceEntry, Student } from '../../types';
import { utils, writeFile } from 'xlsx';
import { Button } from '../ui/Button';

interface ImageLinkGalleryProps {
  attendance: AttendanceEntry[];
  students: Student[];
  onOpenDetail: () => void;
}

const cards = [
  {
    id: 'google-sheet',
    title: 'Live Google Sheet',
    description: 'Open the shared attendance sheet instantly.',
    image:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
    href: 'https://docs.google.com/spreadsheets/create',
  },
  {
    id: 'excel',
    title: 'Download Excel',
    description: 'Generate a real-time Excel export from current data.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'detail',
    title: 'In-app Detail View',
    description: 'Review attendance trends without leaving the portal.',
    image:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageLinkGallery = ({
  attendance,
  students,
  onOpenDetail,
}: ImageLinkGalleryProps) => {
  const studentLookup = Object.fromEntries(students.map((student) => [student.id, student]));

  const handleExcelExport = () => {
    const worksheetData = attendance.map((entry) => ({
      Student: studentLookup[entry.studentId]?.name ?? 'Unknown',
      Grade: studentLookup[entry.studentId]?.grade ?? 'N/A',
      Status: entry.status.toUpperCase(),
      Date: entry.date,
      Time: entry.time,
      Notes: entry.notes ?? '',
    }));
    const worksheet = utils.json_to_sheet(worksheetData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Attendance');
    writeFile(workbook, 'attendance-export.xlsx');
  };

  const handleAction = (cardId: string, href?: string) => {
    if (cardId === 'google-sheet' && href) {
      window.open(href, '_blank', 'noopener');
    } else if (cardId === 'excel') {
      handleExcelExport();
    } else if (cardId === 'detail') {
      onOpenDetail();
    }
  };

  return (
    <div className="grid two">
      {cards.map((card) => (
        <div key={card.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <img
            src={card.image}
            alt={card.title}
            style={{ width: '100%', height: '160px', objectFit: 'cover' }}
          />
          <div style={{ padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.25rem 0' }}>{card.title}</h3>
            <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>{card.description}</p>
            <Button onClick={() => handleAction(card.id, card.href)}>Open</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

