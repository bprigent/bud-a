export default function EmptyState({ message, className = '' }) {
  return <p className={`empty ${className}`.trim()}>{message}</p>;
}
