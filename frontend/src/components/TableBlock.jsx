/**
 * Scroll shell for a single `<table>` child.
 *
 * **TableBlock** — horizontal overflow only; the header scrolls with the page. Use in cards
 * where the table can be wider than the viewport (e.g. Settings).
 *
 * **TableBlockSticky** — vertical + horizontal scroll on the inner region with `thead th` stuck
 * to the top of that region. Use with **`fill`** inside flex layouts that give a bounded height
 * (e.g. Operations list in a flex card).
 */
function TableBlockBase({ sticky = false, fill = false, className = '', scrollClassName = '', children }) {
  return (
    <div
      className={[
        'table-block',
        sticky && 'table-block--sticky',
        fill && 'table-block--fill',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['table-block__scroll', scrollClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </div>
  );
}

export function TableBlock({ className, scrollClassName, children }) {
  return (
    <TableBlockBase className={className} scrollClassName={scrollClassName}>
      {children}
    </TableBlockBase>
  );
}

export function TableBlockSticky({ fill = false, className, scrollClassName, children }) {
  return (
    <TableBlockBase sticky fill={fill} className={className} scrollClassName={scrollClassName}>
      {children}
    </TableBlockBase>
  );
}
