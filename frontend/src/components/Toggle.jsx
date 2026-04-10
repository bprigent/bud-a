/**
 * Boolean switch — styled checkbox for on/off settings (native form posts, labels).
 * Uses global classes `form-toggle-*` (see appGlobal03 tables/forms CSS).
 */
export default function Toggle({ id, className = '', children, ...inputProps }) {
  return (
    <label className={['form-toggle-label', className].filter(Boolean).join(' ')}>
      <input type="checkbox" className="form-toggle-input" {...inputProps} id={id} />
      <span className="form-toggle-track" aria-hidden="true">
        <span className="form-toggle-thumb" />
      </span>
      {children != null && children !== false ? (
        <span className="form-toggle-text">{children}</span>
      ) : null}
    </label>
  );
}
