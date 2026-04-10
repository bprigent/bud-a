import { createGlobalStyle } from 'styled-components';

/** Global styles (migrated from App.css) — chunk 2/6: appGlobal02-month-dashboard */
const APPGLOBAL = createGlobalStyle`

.month-page-layout {
  display: flex;
  align-items: flex-start;
  gap: 0;
  min-width: 0;
}

.page-main--fill > .month-page-layout {
  flex: 1;
  min-height: 0;
  align-items: stretch;
  overflow: hidden;
  width: 100%;
}

.month-page-layout__main {
  flex: 1;
  min-width: 0;
}

.page-main--fill > .month-page-layout > .month-page-layout__main {
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.month-accounts-panel {
  flex: 0 0 var(--layout-side-panel-width);
  min-width: 0;
  min-height: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surface);
  border: none;
  border-radius: 0;
  align-self: stretch;
}

.month-accounts-panel--collapsed {
  flex: 0 0 auto;
  width: auto;
  align-self: stretch;
}

.month-accounts-panel__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  min-width: 0;
}

.month-accounts-panel__heading {
  flex: 1;
  min-width: 0;
}

.month-accounts-panel--collapsed .month-accounts-panel__scroll {
  flex: 0 0 auto;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  /* top, right, bottom, left — flush to main column on the left */
  padding: var(--space-6) var(--space-4) var(--space-4) 0;
}

.month-accounts-panel__scroll {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  overflow-x: hidden;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) var(--space-4) 0;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.month-accounts-panel__intro {
  margin: 0 0 var(--space-3);
  font-size: var(--font-size-xs);
  line-height: var(--font-leading-normal);
  color: var(--text-secondary);
}

.month-accounts-panel__body .empty {
  margin: 0;
  font-size: var(--font-size-sm);
  text-align: center;
  color: var(--text-secondary);
}

.month-accounts-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.month-accounts-panel__row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-1);
  margin: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  min-width: 0;
}

.month-accounts-panel__row:hover {
  background: var(--color-neutral-50);
}

.month-accounts-panel__row:focus-visible {
  outline: 2px solid var(--color-focus-ring, var(--color-primary-500));
  outline-offset: 2px;
}

.month-accounts-panel__row--static {
  cursor: default;
}

.month-accounts-panel__row--static:hover {
  background: transparent;
}

/* Owner color as a thick ring around the bank logo / placeholder */
.month-accounts-panel__logo-ring {
  flex-shrink: 0;
  line-height: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-accounts-panel__logo-ring--owner {
  padding: 0.14rem;
  background: var(--member-logo-ring);
  box-sizing: border-box;
}

.month-accounts-panel__meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1px;
}

.month-accounts-panel__logo.account-card-logo-circle {
  --logo-inset: 0.2rem;
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  margin-bottom: 0;
  flex-shrink: 0;
}

.month-accounts-panel__logo--placeholder {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  background: var(--color-neutral-100);
  border: 1px solid var(--border);
  box-sizing: border-box;
}

.month-accounts-panel__name {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-800);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.month-accounts-panel__sub {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.month-accounts-panel__sub--positive {
  color: var(--color-green-600, #16a34a);
}

.month-accounts-panel__sub--negative {
  color: var(--color-red-600, #dc2626);
}

.month-accounts-panel__amount {
  flex-shrink: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-900);
  text-align: right;
  margin-left: auto;
  max-width: 48%;
}

@media (max-width: 900px) {
  .page-main--fill > .month-page-layout {
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }

  .month-accounts-panel {
    flex: 0 0 auto;
    width: 100%;
    min-height: 0;
    border-left: none;
    border-top: 1px solid var(--color-border);
    overflow: visible;
  }

  .month-accounts-panel--collapsed {
    width: 100%;
  }

  .month-accounts-panel--collapsed .month-accounts-panel__scroll {
    flex-direction: row;
    justify-content: flex-end;
    padding: var(--space-6) var(--space-4) var(--space-4) 0;
  }

  .month-accounts-panel__scroll {
    overflow-y: visible;
    padding-bottom: var(--space-4);
  }

  .page-main--fill > .month-page-layout > .month-page-layout__main {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: visible;
  }
}

/* Month dashboard: layout edit controls in page header */
.dashboard-layout-edit-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: flex-end;
}

.dashboard-layout-edit-actions__unsaved {
  margin-right: 0;
}

/* Month page (dashboard): three columns */

.month-page-columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  align-items: start;
  padding-top: var(--space-4);
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

/* Dashboard-style section cards: month page + Study category charts */
.month-page-columns > .section-card,
.month-page-columns .month-column-stack > .section-card,
.page--study .study-grid > .section-card {
  border-radius: 0;
  box-shadow: none;
  background: var(--color-neutral-0);
}

/* Header KPI tiles — same white as section cards (not neutral-50) */
.month-page-columns .mini-kpi,
.page--study .study-grid .mini-kpi {
  background: var(--color-neutral-0);
}

/* First column: Revenue + Transfers as separate stacked cards */
.month-column-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

/* Section cards (this month, study, etc.): flush shell, outer border, header divider full width */
.section-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.section-card__header {
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.section-card__header-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  min-width: 0;
}

.section-card__header-title-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  flex: 1 1 auto;
}

.section-card__header-title-group .section-card__title {
  flex: 0 1 auto;
}

.section-card__title {
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-800);
  text-align: left;
}

/* Shrink-wrap: sort + KPIs only as wide as content; title \`.section-card__title\` fills the rest */
.section-card__header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  flex: 0 0 auto;
  min-width: 0;
}

.section-card__header-leading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.section-card__header-kpis {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
}

.section-card__header-kpis .mini-kpi {
  flex-shrink: 0;
}

.section-card__header-actions-slot {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.section-card__total {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-900);
  white-space: nowrap;
}

.section-card__body {
  flex: 1;
  min-height: 0;
  padding: var(--space-5);
}

.section-card--collapsed {
  min-height: 0;
}

.section-card__collapse-btn {
  flex-shrink: 0;
  color: var(--color-neutral-400);
}

.section-card__collapse-btn svg {
  display: block;
  transition: transform 0.2s ease;
}

.section-card__collapse-btn--collapsed svg {
  transform: rotate(-90deg);
}

.section-card__footer {
  padding: var(--space-2) var(--space-4);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.section-card__body > .empty {
  display: block;
  margin: 0;
}

.section-card__body .section-card__budget-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.dashboard-add-widget-btn {
  width: 100%;
  margin-bottom: var(--space-3);
}

/* Dashboard month widgets: no corner radius, muted header strip */
.section-card.dashboard-widget {
  border-radius: 0;
}

.section-card.dashboard-widget .section-card__header {
  background: var(--color-surface-muted);
  padding: var(--space-2);
}

.section-card.dashboard-widget .section-card__title {
  font-size: var(--font-size-base);
}

.section-card.dashboard-widget .section-card__body {
  padding: 0;
}

.section-card.dashboard-widget .section-card__footer {
  padding: var(--space-2);
  border-top: none;
}

/* Divider between body and footer: line on body bottom only (no double rule with footer top) */
.section-card.dashboard-widget:has(> footer.section-card__footer) .section-card__body {
  border-bottom: 1px solid var(--border);
}

/* Dashboard widgets: configure control only in layout edit mode (see WidgetCard); sort stays outside this wrapper */
.dashboard-widget .dashboard-widget__chrome {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* Operations widget table cells */
.ops-widget-date {
  white-space: nowrap;
}

.ops-widget-label {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Configure widget side panel — grouped fields */
.widget-config-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.widget-config-section__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Budget | Operations — full-width segmented row (no wrap: 50% + gap used to stack vertically) */
.widget-config-source-toggle.btn-group {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
}

.widget-config-source-toggle .btn-group-item {
  flex: 1 1 0;
  min-width: 0;
}

.widget-config-section--danger {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
  margin-top: var(--space-1);
}

.widget-config-section--danger .form-control-group-title {
  color: var(--color-text-muted);
}

.widget-config-section--danger .widget-config-section__fields {
  align-items: flex-start;
}

.widget-config-danger__hint {
  margin: 0;
  max-width: 100%;
  font-size: var(--font-size-sm);
  line-height: var(--font-leading-normal);
  color: var(--color-text-muted);
}

.widget-config-danger__confirm {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 100%;
}

.widget-config-danger__confirm-lead {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--font-leading-normal);
  color: var(--color-text-primary);
}

.widget-config-danger__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.category-amount-table-embedded {
  margin-bottom: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.category-amount-table-embedded tbody td {
  border-bottom: none;
}

.category-amount-table-embedded h2 {
  display: none;
}

.category-amount-name-cell {
  font-variant-emoji: emoji;
}

@media (max-width: 1024px) {
  .month-page-columns {
    grid-template-columns: 1fr;
  }
}

/* Dashboard sections */
.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
}

.dashboard-section-span-full {
  grid-column: 1 / -1;
}

/* Keeps middle column when Non-Budgeted is hidden so Budget | Accounts stay in 1/3 */
.dashboard-section-spacer {
  display: none;
}

@media (min-width: 769px) {
  .dashboard-sections .dashboard-section-spacer {
    display: block;
    min-height: 1px;
    visibility: hidden;
    pointer-events: none;
  }
}

@media (max-width: 768px) {
  .dashboard-sections {
    grid-template-columns: 1fr;
  }

  .dashboard-sections .dashboard-section-spacer {
    display: none;
  }
}

/* Tables */
`;

export default APPGLOBAL;
