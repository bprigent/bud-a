import { useRef, useCallback, useId } from 'react';

/** @typedef {'large-full-width' | 'large-shrink' | 'small-full-width' | 'small-shrink'} TabsVariant */

const VARIANT_CLASS = {
  'large-full-width': 'segmented-tabs--lg-full',
  'large-shrink': 'segmented-tabs--lg-shrink',
  'small-full-width': 'segmented-tabs--sm-full',
  'small-shrink': 'segmented-tabs--sm-shrink',
};

/**
 * Segmented control tabs — same track + selected pill as ButtonGroup (text toggles).
 *
 * @param {Array<{ id: string, label: string, icon?: import('react').ReactNode }>} tabs
 * @param {string} active — id of the selected tab
 * @param {(id: string) => void} onChange
 * @param {TabsVariant} [variant='large-full-width'] — layout + density
 */
export default function Tabs({
  tabs,
  active,
  onChange,
  className = '',
  variant = 'large-full-width',
}) {
  const btnRefs = useRef([]);
  const uid = useId().replace(/:/g, '');

  const count = tabs.length;

  const focusAt = useCallback((idx) => {
    const el = btnRefs.current[idx];
    if (el && typeof el.focus === 'function') el.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e, idx) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (idx + 1) % count;
        onChange(tabs[next].id);
        focusAt(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (idx - 1 + count) % count;
        onChange(tabs[prev].id);
        focusAt(prev);
      } else if (e.key === 'Home') {
        e.preventDefault();
        onChange(tabs[0].id);
        focusAt(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onChange(tabs[count - 1].id);
        focusAt(count - 1);
      }
    },
    [count, tabs, onChange, focusAt],
  );

  const vClass = VARIANT_CLASS[variant] || VARIANT_CLASS['large-full-width'];

  return (
    <div className={`segmented-tabs ${vClass} ${className}`.trim()}>
      <div
        className="btn-group segmented-tabs__group"
        role="tablist"
        aria-label="Sections"
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            ref={(el) => {
              btnRefs.current[idx] = el;
            }}
            type="button"
            role="tab"
            id={`segmented-tab-${uid}-${tab.id}`}
            aria-selected={active === tab.id}
            tabIndex={active === tab.id ? 0 : -1}
            className={`btn-group-item segmented-tabs__tab${active === tab.id ? ' active' : ''}`}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            {tab.icon ? (
              <span className="segmented-tabs__icon" aria-hidden>
                {tab.icon}
              </span>
            ) : null}
            <span className="segmented-tabs__label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
