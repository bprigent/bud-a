import { useEffect, useId } from 'react';

export default function Modal({ title, open, onClose, children }) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button className="modal-close" aria-label="Close" onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
