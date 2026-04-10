/**
 * `h2` heading for sections inside `PageMain` (not the global `PageHeader` / `PageSubHeader` chrome).
 * Pass `actions` for controls aligned to the end of the row.
 * Pass `subtitle` for optional supporting text below the title.
 */
export default function SectionHeader({
  children,
  actions = null,
  subtitle = null,
  className = '',
  id,
}) {
  const title = (
    <h2 className="page-section-header" id={id}>
      {children}
    </h2>
  );

  const subtitleNode =
    subtitle != null && subtitle !== '' ? (
      <p className="page-section-header__subtitle">{subtitle}</p>
    ) : null;

  if (actions) {
    return (
      <div className={`page-section-header-row ${className}`.trim()}>
        <div className="page-section-header__lead">
          {title}
          {subtitleNode}
        </div>
        <div className="page-section-header__actions">{actions}</div>
      </div>
    );
  }

  if (subtitleNode) {
    return (
      <div className={`page-section-header-stack ${className}`.trim()}>
        {title}
        {subtitleNode}
      </div>
    );
  }

  return (
    <h2 className={`page-section-header ${className}`.trim()} id={id}>
      {children}
    </h2>
  );
}
