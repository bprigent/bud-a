import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Button from './Button';

/**
 * Section shell: flush outer card; header, collapsible body, and optional footer.
 * Optional `titleAddon` (e.g. sort), optional `total`, `headerExtra` (e.g. KPI row),
 * `footer` (e.g. KPI cards), and `actions` (e.g. "+ Add" — rendered rightmost in the header).
 * Set `hideHeader` when an outer `SectionHeader` (or similar) owns the title row.
 * Set `collapsible` to allow toggling body visibility.
 */
export default function SectionCard({
  title,
  total,
  titleAddon,
  headerExtra,
  footer,
  actions,
  children,
  className = '',
  id,
  titleAs: TitleTag = 'h2',
  hideHeader = false,
  collapsible = false,
  defaultCollapsed = false,
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const hasHeaderSide =
    headerExtra != null || titleAddon != null || total != null || actions != null;

  if (hideHeader) {
    return (
      <section
        id={id}
        className={['section-card', className].filter(Boolean).join(' ')}
      >
        <div className="section-card__body">{children}</div>
        {footer != null ? (
          <footer className="section-card__footer">{footer}</footer>
        ) : null}
      </section>
    );
  }

  return (
    <section
      id={id}
      className={['section-card', collapsed ? 'section-card--collapsed' : '', className].filter(Boolean).join(' ')}
    >
      <header className="section-card__header">
        <div className="section-card__header-row">
          <div className="section-card__header-title-group">
            <TitleTag className="section-card__title">{title}</TitleTag>
          </div>
          {hasHeaderSide ? (
            <div className="section-card__header-actions" onClick={collapsible ? (e) => e.stopPropagation() : undefined}>
              {titleAddon != null || total != null ? (
                <div className="section-card__header-leading">
                  {titleAddon}
                  {total != null ? (
                    <span className="section-card__total">{total}</span>
                  ) : null}
                </div>
              ) : null}
              {headerExtra != null ? (
                <div className="section-card__header-kpis">{headerExtra}</div>
              ) : null}
              {actions != null ? (
                <div className="section-card__header-actions-slot">{actions}</div>
              ) : null}
            </div>
          ) : null}
          {collapsible ? (
            <Button
              variant="ghost"
              size="sm"
              icon
              type="button"
              className={['section-card__collapse-btn', collapsed ? 'section-card__collapse-btn--collapsed' : ''].filter(Boolean).join(' ')}
              title={collapsed ? 'Expand section' : 'Collapse section'}
              aria-expanded={!collapsed}
              aria-label={collapsed ? 'Expand section' : 'Collapse section'}
              onClick={() => setCollapsed((c) => !c)}
            >
              <FiChevronDown size={12} />
            </Button>
          ) : null}
        </div>
      </header>
      {!collapsed ? (
        <div className="section-card__body">{children}</div>
      ) : null}
      {footer != null ? (
        <footer className="section-card__footer">{footer}</footer>
      ) : null}
    </section>
  );
}
