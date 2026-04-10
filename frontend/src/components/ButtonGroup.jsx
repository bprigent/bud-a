/**
 * Grouped toggle buttons.
 *
 * @param {{ value: string, label: string }[]} options
 * @param {string}   value    - Currently selected value
 * @param {function} onChange - Called with the new value
 * @param {'sm'|'md'} size    - Button size (default 'sm')
 * @param {string}   className
 */
export default function ButtonGroup({ options, value, onChange, size = 'sm', className = '' }) {
  return (
    <div className={`btn-group ${size === 'sm' ? 'btn-group-sm' : ''} ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`btn-group-item ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
