import { useState, useEffect, useRef } from 'react';
import Button from './Button';

/**
 * ⋯ menu for table row actions (edit, delete, etc.). Closes on outside click and Escape.
 * items: { label: string, onClick: () => void, danger?: boolean }[]
 */
export default function RowActionsMenu({ items, ariaLabel = 'Open row actions' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="row-actions" ref={wrapRef}>
      <Button
        variant="ghost"
        size="sm"
        icon
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="row-actions-trigger" aria-hidden="true">⋯</span>
      </Button>
      {open && (
        <ul className="row-actions-menu" role="menu">
          {items.map((item, i) => (
            <li key={i} role="none">
              <button
                type="button"
                role="menuitem"
                className={`row-actions-menu-item${item.danger ? ' row-actions-menu-item-danger' : ''}`}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
