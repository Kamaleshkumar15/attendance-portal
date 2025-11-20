import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  AttendanceData,
  AttendanceEntry,
  AttendanceStatus,
  MonthlyReport,
  OdRequest,
} from '../types';
import { dataService } from '../services/dataService';

interface AttendanceContextValue extends AttendanceData {
  loading: boolean;
  error?: string;
  addAttendance: (entry: Omit<AttendanceEntry, 'id'>) => Promise<void>;
  updateAttendance: (id: string, updates: Partial<AttendanceEntry>) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
  addOdRequest: (request: Omit<OdRequest, 'id'>) => Promise<void>;
  updateOdRequest: (id: string, updates: Partial<OdRequest>) => Promise<void>;
  deleteOdRequest: (id: string) => Promise<void>;
  updateReportStatus: (id: string, status: MonthlyReport['status']) => Promise<void>;
  refetch: () => Promise<void>;
  getAttendanceByStatus: (status: AttendanceStatus) => AttendanceEntry[];
}

interface State extends AttendanceData {
  loading: boolean;
  error?: string;
}

type Action =
  | { type: 'hydrate'; payload: AttendanceData }
  | { type: 'loading'; payload: boolean }
  | { type: 'error'; payload?: string };

const initialState: State = {
  students: [],
  attendanceEntries: [],
  odRequests: [],
  monthlyReports: [],
  loading: true,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, loading: false, error: undefined };
    case 'loading':
      return { ...state, loading: action.payload };
    case 'error':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const AttendanceContext = createContext<AttendanceContextValue | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hydrate = useCallback(async () => {
    dispatch({ type: 'loading', payload: true });
    try {
      const snapshot = await dataService.getSnapshot();
      dispatch({ type: 'hydrate', payload: snapshot });
    } catch (err) {
      dispatch({
        type: 'error',
        payload: err instanceof Error ? err.message : 'Unable to load attendance data',
      });
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const initial = await dataService.initialize();
      dispatch({ type: 'hydrate', payload: initial });
    })();
  }, []);

  const addAttendance = useCallback(
    async (entry: Omit<AttendanceEntry, 'id'>) => {
      await dataService.createAttendance(entry);
      await hydrate();
    },
    [hydrate],
  );

  const updateAttendance = useCallback(
    async (id: string, updates: Partial<AttendanceEntry>) => {
      await dataService.updateAttendance(id, updates);
      await hydrate();
    },
    [hydrate],
  );

  const deleteAttendance = useCallback(
    async (id: string) => {
      await dataService.deleteAttendance(id);
      await hydrate();
    },
    [hydrate],
  );

  const addOdRequest = useCallback(
    async (request: Omit<OdRequest, 'id'>) => {
      await dataService.createOdRequest(request);
      await hydrate();
    },
    [hydrate],
  );

  const updateOdRequest = useCallback(
    async (id: string, updates: Partial<OdRequest>) => {
      await dataService.updateOdRequest(id, updates);
      await hydrate();
    },
    [hydrate],
  );

  const deleteOdRequest = useCallback(
    async (id: string) => {
      await dataService.deleteOdRequest(id);
      await hydrate();
    },
    [hydrate],
  );

  const updateReportStatus = useCallback(
    async (id: string, statusValue: MonthlyReport['status']) => {
      await dataService.updateReportStatus(id, statusValue);
      await hydrate();
    },
    [hydrate],
  );

  const getAttendanceByStatus = useCallback(
    (statusValue: AttendanceStatus) =>
      state.attendanceEntries.filter((entry) => entry.status === statusValue),
    [state.attendanceEntries],
  );

  const value = useMemo<AttendanceContextValue>(
    () => ({
      ...state,
      addAttendance,
      updateAttendance,
      deleteAttendance,
      addOdRequest,
      updateOdRequest,
      deleteOdRequest,
      updateReportStatus,
      refetch: hydrate,
      getAttendanceByStatus,
    }),
    [
      state,
      addAttendance,
      updateAttendance,
      deleteAttendance,
      addOdRequest,
      updateOdRequest,
      deleteOdRequest,
      updateReportStatus,
      hydrate,
      getAttendanceByStatus,
    ],
  );

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};

export const useAttendance = (): AttendanceContextValue => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used inside AttendanceProvider');
  }
  return context;
};

