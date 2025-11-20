interface LoaderProps {
  label?: string;
}

export const Loader = ({ label = 'Loading...' }: LoaderProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <span
      style={{
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '999px',
        border: '3px solid rgba(37, 99, 235, 0.3)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <span style={{ fontWeight: 600, color: '#475569' }}>{label}</span>
    <style>
      {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
    </style>
  </div>
);

