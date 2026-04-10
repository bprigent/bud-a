export default function SortableTh({
  field,
  sortField,
  sortDir,
  onSort,
  children,
  align,
}) {
  const active = sortField === field;
  const icon = !active ? ' \u2195' : sortDir === 'asc' ? ' \u2191' : ' \u2193';
  const style = { cursor: 'pointer', ...(align === 'right' ? { textAlign: 'right' } : {}) };
  const ariaSort = !active ? 'none' : sortDir === 'asc' ? 'ascending' : 'descending';
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSort(field);
    }
  };
  return (
    <th
      style={style}
      onClick={() => onSort(field)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="columnheader"
      aria-sort={ariaSort}
    >
      {children}
      {icon}
    </th>
  );
}
