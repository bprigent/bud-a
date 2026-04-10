export default function FormField({ label, htmlFor, children, className = '' }) {
  return (
    <div className={`form-group ${className}`.trim()}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
    </div>
  );
}
