import { useState, useEffect, useRef, useMemo } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';

/**
 * Reusable dropdown select with optional search and multi-select.
 *
 * Props:
 *  - options:      [{ value, label, content? }] — optional `content` (React node) for custom
 *                    row + trigger in single-select; `label` stays string (search + a11y)
 *  - value:        string | string[] (controlled)
 *  - onChange:     (value) => void — string for single, string[] for multi
 *  - placeholder:  placeholder text when nothing selected
 *  - label:        optional label rendered above
 *  - searchable:   enable search input (default false)
 *  - multi:        multi-select mode (default false)
 *  - required:     native validation hint
 *  - disabled:     disable the control
 *  - name:         optional name for forms
 *  - id:           optional id for label association
 *  - className:    extra class on the wrapper
 *  - dropdownClassName: extra class on the dropdown panel (e.g. wider than trigger)
 *  - dropdownExtra: optional node rendered below the options list (e.g. custom fields)
 *  - keepOpenOnSelect: preset values that do not close the dropdown after selection (single mode)
 *  - displayValue: optional string for the trigger label (overrides option label when set)
 *  - multiClearLabel: accessible name for the multi-select clear icon (default "Clear")
 *  - multiIsSelected: optional (optValue, value) => boolean — override per-option selected state in multi mode (e.g. a synthetic "select all" row)
 */
export default function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  label,
  searchable = false,
  multi = false,
  required = false,
  disabled = false,
  name,
  id,
  className = '',
  dropdownClassName = '',
  dropdownExtra = null,
  keepOpenOnSelect = [],
  displayValue,
  multiClearLabel = 'Clear',
  multiIsSelected,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  // Close on outside click / Escape
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

  // Auto-focus search when opening
  useEffect(() => {
    if (open && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open, searchable]);

  // Reset search when closing
  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const optionMap = useMemo(() => {
    const m = {};
    options.forEach((o) => { m[o.value] = o.label; });
    return m;
  }, [options]);

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  // Selected values as Set for multi
  const selectedSet = useMemo(() => {
    if (!multi) return new Set();
    return new Set(Array.isArray(value) ? value : []);
  }, [multi, value]);

  const displayText = () => {
    if (multi) {
      const vals = Array.isArray(value) ? value : [];
      if (vals.length === 0) return placeholder;
      if (displayValue !== undefined && displayValue !== '') return displayValue;
      if (vals.length === 1) return optionMap[vals[0]] || vals[0];
      return `${vals.length} selected`;
    }
    if (!value && value !== 0) return placeholder;
    if (displayValue !== undefined && displayValue !== '') return displayValue;
    return optionMap[value] || value;
  };

  /** Single-select trigger: use optional option.content when present. */
  const renderSingleTrigger = () => {
    if (multi) return displayText();
    if (displayValue !== undefined && displayValue !== '') return displayValue;
    const opt = options.find((o) => o.value === value);
    if (!opt) return placeholder;
    if (opt.content != null) return opt.content;
    return opt.label;
  };

  const handleSelect = (optValue) => {
    if (multi) {
      if (optValue === '') {
        onChange([]);
        setOpen(false);
        return;
      }
      const next = new Set(selectedSet);
      if (next.has(optValue)) {
        next.delete(optValue);
      } else {
        next.add(optValue);
      }
      onChange([...next]);
    } else {
      onChange(optValue);
      if (!keepOpenOnSelect.includes(optValue)) {
        setOpen(false);
      }
    }
  };

  const isSelected = (optValue) => {
    if (multi && typeof multiIsSelected === 'function') {
      return multiIsSelected(optValue, Array.isArray(value) ? value : []);
    }
    if (multi) return selectedSet.has(optValue);
    return value === optValue;
  };

  const hasValue = multi
    ? Array.isArray(value) && value.length > 0
    : value !== '' && value != null;

  return (
    <div
      className={`select-wrap${className ? ` ${className}` : ''}`}
      ref={wrapRef}
    >
      {label && (
        <label className="select-label" htmlFor={id}>
          {label}
        </label>
      )}

      {/* Hidden native input for form validation */}
      {required && (
        <input
          tabIndex={-1}
          className="select-hidden-input"
          value={hasValue ? '_' : ''}
          required
          onChange={() => {}}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        id={id}
        name={name}
        className={`select-trigger${open ? ' select-trigger-open' : ''}${disabled ? ' select-trigger-disabled' : ''}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className={`select-value${!hasValue ? ' select-placeholder' : ''}`}>
          {multi ? displayText() : renderSingleTrigger()}
        </span>
        <FiChevronDown size={16} className="select-chevron" />
      </button>

      {open && (
        <div className={`select-dropdown${dropdownClassName ? ` ${dropdownClassName}` : ''}`}>
          {(searchable || (multi && hasValue)) && (
            <div
              className={`select-search-wrap${searchable ? '' : ' select-search-wrap--clear-only'}`}
            >
              {searchable && (
                <input
                  ref={searchRef}
                  type="text"
                  className="select-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                />
              )}
              {multi && hasValue && (
                <button
                  type="button"
                  className="select-clear-icon-btn"
                  aria-label={multiClearLabel}
                  title={multiClearLabel}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          )}
          <ul className="select-options" role="listbox" aria-multiselectable={multi ? true : undefined}>
            {filtered.length === 0 ? (
              <li className="select-empty">No options found</li>
            ) : (
              filtered.map((o) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isSelected(o.value)}
                  className={`select-option${isSelected(o.value) ? ' select-option-selected' : ''}`}
                  onClick={() => handleSelect(o.value)}
                >
                  {multi && (
                    <span className={`select-check${isSelected(o.value) ? ' select-check-active' : ''}`}>
                      {isSelected(o.value) ? '✓' : ''}
                    </span>
                  )}
                  <span className="select-option-label">{o.content != null ? o.content : o.label}</span>
                </li>
              ))
            )}
          </ul>
          {dropdownExtra}
        </div>
      )}
    </div>
  );
}
