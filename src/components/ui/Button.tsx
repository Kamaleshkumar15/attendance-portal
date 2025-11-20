import type { ButtonHTMLAttributes, CSSProperties } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
  },
  ghost: {
    background: 'transparent',
    color: '#1f2937',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'var(--danger)',
    color: '#fff',
    border: '1px solid var(--danger)',
  },
};

export const Button = ({ children, variant = 'primary', style, ...props }: ButtonProps) => (
  <button
    type="button"
    {...props}
    style={{
      padding: '0.6rem 1.2rem',
      borderRadius: '0.75rem',
      fontWeight: 600,
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.6 : 1,
      transition: 'transform 0.2s ease',
      ...variantStyles[variant],
      ...style,
    }}
  >
    {children}
  </button>
);

