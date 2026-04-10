/** Segmented control for icon-only buttons (styled like .btn-group). */
export function IconButtonGroup({
  children,
  ariaLabel,
  className = '',
  variant = 'primary',
}) {
  const v = variant === 'secondary' ? 'secondary' : 'primary';
  return (
    <div
      className={`icon-button-group icon-button-group--${v}${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

export function IconButtonGroupItem({
  active,
  onClick,
  ariaLabel,
  title,
  children,
}) {
  return (
    <button
      type="button"
      className={`icon-button-group-item${active ? ' active' : ''}`}
      aria-pressed={active}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
