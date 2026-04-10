import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getDateRangePreset, matchDateRangePreset, toYMD } from '../utils/format';
import Button from './Button';

function parseYMD(s) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  return new Date(y, m - 1, d);
}

function addMonths(date, n) {
  const y = date.getFullYear();
  const m = date.getMonth() + n;
  return new Date(y, m, 1);
}

function monthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const dow = first.getDay();
  const monday0 = dow === 0 ? 6 : dow - 1;
  const start = new Date(year, monthIndex, 1 - monday0);
  const cells = [];
  for (let k = 0; k < 42; k++) {
    const d = new Date(start);
    d.setDate(start.getDate() + k);
    cells.push({ date: d, muted: d.getMonth() !== monthIndex });
  }
  return cells;
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function dayCellClass(ymd, startStr, endStr, muted, todayStr) {
  let cellClass = 'drp-day';
  if (startStr && endStr) {
    const inRange = ymd >= startStr && ymd <= endStr;
    if (inRange) {
      if (startStr === endStr && ymd === startStr) cellClass += ' drp-day-single';
      else if (ymd === startStr) cellClass += ' drp-day-start';
      else if (ymd === endStr) cellClass += ' drp-day-end';
      else cellClass += ' drp-day-mid';
    } else if (muted) {
      cellClass += ' drp-day-muted';
    }
  } else if (muted) {
    cellClass += ' drp-day-muted';
  }
  if (ymd === todayStr) cellClass += ' drp-day-today';
  return cellClass;
}

function MonthPanel({ year, monthIndex, startStr, endStr, onDayClick, todayStr }) {
  const cells = useMemo(() => monthGrid(year, monthIndex), [year, monthIndex]);
  const monthTitle = new Date(year, monthIndex, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="drp-month">
      <div className="drp-month-title">{monthTitle}</div>
      <div className="drp-weekdays">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="drp-weekday">
            {w}
          </span>
        ))}
      </div>
      <div className="drp-grid">
        {cells.map(({ date, muted }, idx) => {
          const ymd = toYMD(date);
          const cellClass = dayCellClass(ymd, startStr, endStr, muted, todayStr);
          const isToday = ymd === todayStr;
          const readable = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
          return (
            <button
              key={idx}
              type="button"
              className={cellClass}
              onClick={() => onDayClick(date)}
              aria-label={isToday ? `Today — ${readable}` : readable}
              aria-current={isToday ? 'date' : undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Dual-month range calendar with preset pills above the grids.
 * Presets and day clicks update a draft range; Save commits via onRangeChange.
 * Two-click range: first click sets start, second sets end (order-independent).
 */
export default function DateRangePicker({
  className = '',
  start,
  end,
  onRangeChange,
  presets,
  triggerLabel,
  placeholder = 'Date range',
}) {
  const [open, setOpen] = useState(false);
  /** draft + anchor for two-click range; anchor is YMD or null (next click completes range). */
  const [picker, setPicker] = useState({ draft: { start: '', end: '' }, anchor: null });
  const draft = picker.draft;
  const [viewMonth, setViewMonth] = useState(() => {
    const d = parseYMD(start) || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPicker((p) => ({ ...p, anchor: null }));
    }
  }, [open]);

  const handleDayClick = useCallback((date) => {
    const ymd = toYMD(date);
    setPicker((prev) => {
      if (prev.anchor === null) {
        return { draft: { start: ymd, end: ymd }, anchor: ymd };
      }
      const a = prev.anchor;
      const s = a < ymd ? a : ymd;
      const e = a < ymd ? ymd : a;
      return { draft: { start: s, end: e }, anchor: null };
    });
  }, []);

  const handlePresetClick = (id) => {
    const r = getDateRangePreset(id);
    setPicker({ draft: { start: r.start, end: r.end }, anchor: null });
    const d = parseYMD(r.start);
    if (d) setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const handleSave = () => {
    if (draft.start && draft.end) {
      onRangeChange(draft.start, draft.end);
    } else if (!draft.start && !draft.end) {
      onRangeChange('', '');
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const todayStr = toYMD(new Date());
  const left = viewMonth;
  const right = addMonths(viewMonth, 1);
  const activePreset = matchDateRangePreset(draft.start, draft.end);

  const hasLabel = Boolean(triggerLabel);

  return (
    <div className={`date-range-picker ${className}`.trim()} ref={wrapRef}>
      <button
        type="button"
        className={`select-trigger${open ? ' select-trigger-open' : ''}`}
        onClick={() => {
          if (!open) {
            setPicker({ draft: { start, end }, anchor: null });
            const d = parseYMD(start);
            if (d) setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
          }
          setOpen((o) => !o);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={`select-value${!hasLabel ? ' select-placeholder' : ''}`}>
          {triggerLabel || placeholder}
        </span>
        <FiChevronDown size={16} className="select-chevron" />
      </button>

      {open && (
        <div
          className="drp-popover"
          role="dialog"
          aria-label="Choose date range"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="drp-presets">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`drp-preset${activePreset === p.id ? ' drp-preset-active' : ''}`}
                onClick={() => handlePresetClick(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="drp-cal-wrap">
            <button
              type="button"
              className="drp-nav-arrow"
              aria-label="Previous months"
              onClick={() => setViewMonth((v) => addMonths(v, -1))}
            >
              <FiChevronLeft size={20} />
            </button>

            <div className="drp-months">
              <MonthPanel
                year={left.getFullYear()}
                monthIndex={left.getMonth()}
                startStr={draft.start}
                endStr={draft.end}
                onDayClick={handleDayClick}
                todayStr={todayStr}
              />
              <MonthPanel
                year={right.getFullYear()}
                monthIndex={right.getMonth()}
                startStr={draft.start}
                endStr={draft.end}
                onDayClick={handleDayClick}
                todayStr={todayStr}
              />
            </div>

            <button
              type="button"
              className="drp-nav-arrow"
              aria-label="Next months"
              onClick={() => setViewMonth((v) => addMonths(v, 1))}
            >
              <FiChevronRight size={20} />
            </button>
          </div>

          <div className="drp-footer">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
