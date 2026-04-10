import { useEffect, useId } from 'react';

/**
 * Slide-in panel from the right (`role="dialog"`).
 *
 * Layout:
 * - **Header** — title, optional `headerActions`, close control.
 * - **Content** — `children` (scrollable main area).
 * - **Footer** (optional) — `footer`; use for primary CTAs (Save, Cancel, …); stays pinned under the content.
 */
export default function SidePanel({
  open,
  onClose,
  title,
  children,
  width = '440px',
  headerActions = null,
  footer = null,
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="side-panel-overlay"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="side-panel"
        style={{ '--panel-max-width': width }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="side-panel-header">
          <h2 id={titleId}>{title}</h2>
          <div className="side-panel-header-end">
            {headerActions != null ? (
              <div className="side-panel-header-actions">{headerActions}</div>
            ) : null}
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close panel">
              &times;
            </button>
          </div>
        </header>
        <section className="side-panel-content" aria-labelledby={titleId}>
          {children}
        </section>
        {footer != null ? <footer className="side-panel-footer">{footer}</footer> : null}
      </aside>
    </div>
  );
}
