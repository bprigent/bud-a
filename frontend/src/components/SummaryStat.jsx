/**
 * Stat tile for counts or pre-formatted values (unlike StatCard, which formats cents as currency).
 */
export default function SummaryStat({ label, value, variant }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className={`stat-value${variant ? ` ${variant}` : ''}`}>{value}</span>
    </div>
  );
}
