interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div
    style={{
      padding: '2rem',
      textAlign: 'center',
      color: '#64748b',
      border: '1px dashed var(--border)',
      borderRadius: '1rem',
    }}
  >
    <h3 style={{ margin: '0 0 0.5rem 0' }}>{title}</h3>
    {description && <p style={{ margin: 0 }}>{description}</p>}
  </div>
);

