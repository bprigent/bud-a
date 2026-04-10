export default function FilterField({ label, children }) {
  return (
    <div className="filter-group">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}
