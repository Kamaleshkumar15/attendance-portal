# PulseAttend

Vite + React portal for managing student attendance, OD (On Duty) requests, and rich reporting workflows. The app layers three data sources to stay resilient during demos:

- **JSON seed** (`src/data/seed.json`) keeps starter records in source control.
- **Browser localStorage** persists CRUD changes offline.
- **Mock backend** (`src/services/mockBackend.ts`) simulates an API for authentication and data sync.

## Features

- Credential-gated access with Remember Me, localStorage sessions, and a mocked token exchange.
- Dashboard tabs for **Present / Absent / OD** records, including add/edit/delete modals.
- Dedicated OD list management with status updates.
- Media gallery where image cards open a Google Sheet, generate an Excel export (via `xlsx`), or reveal an in-app detail sheet.
- Live monitoring view with a ticking clock and refresh controls.
- Monthly reports page featuring stacked bar charts, status controls, and CSV/PDF exports.
- Vitest-powered unit tests for critical services and forms.

## Getting Started

```bash
npm install
npm run dev
```

Then visit http://localhost:5173 and log in with the prefilled credentials (`admin@school.com / admin123`).

## Testing

```bash
npm run test
```

The test suite covers authentication logic, the hybrid data service, and form interactions.

