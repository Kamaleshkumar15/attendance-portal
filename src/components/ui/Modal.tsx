import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export const Modal = ({ title, children, onClose }: ModalProps) =>
  createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div style={{ marginTop: '1rem' }}>{children}</div>
      </div>
    </div>,
    document.body,
  );

