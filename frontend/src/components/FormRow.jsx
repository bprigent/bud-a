export default function FormRow({ children, className = '' }) {
  return <div className={`form-row ${className}`.trim()}>{children}</div>;
}
