/**
 * One label / value row in the operation detail definition list.
 */
export default function OperationDetailRow({
  label,
  children,
  muted = false,
  ddClassName = '',
  ddTitle,
}) {
  return (
    <div className={`operation-detail-row${muted ? ' operation-detail-row--muted' : ''}`}>
      <dt>{label}</dt>
      <dd className={ddClassName || undefined} title={ddTitle || undefined}>
        {children}
      </dd>
    </div>
  );
}
