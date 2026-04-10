import { createGlobalStyle } from 'styled-components';

/** Global styles (migrated from App.css) — chunk 6/6: appGlobal06-study-budget-settings-rest */
const APPGLOBAL = createGlobalStyle`
@media (max-width: 768px) {
  .page-sub-header {
    padding-inline: var(--space-4);
    padding-top: 0;
    padding-bottom: 16px;
  }

  .page-header {
    padding-left: var(--space-5);
    padding-right: var(--space-5);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .study-grid {
    grid-template-columns: 1fr;
  }
}

/* Budget history panel */
.budget-history {
  margin-bottom: var(--space-6);
}

.budget-history-label {
  display: block;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--font-tracking-wide);
  margin-bottom: var(--space-2-5);
}

.budget-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.budget-entry {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2-5) var(--space-3);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--bg);
}

.budget-entry-active {
  border-color: var(--primary);
  background: var(--color-brand-alpha-04);
}

.budget-entry-editing {
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-2);
  padding: var(--space-3);
}

.budget-entry-dates {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-1-5);
}

.budget-entry-arrow {
  color: var(--border);
}

.budget-entry-amount {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-15);
  white-space: nowrap;
}

.budget-entry-actions {
  display: flex;
  gap: var(--space-1);
  flex-shrink: 0;
}

.budget-new-entry {
  border-top: 1px solid var(--border);
  padding-top: var(--space-4);
}

.budget-panel-remove {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
}

.budget-panel-remove-hint {
  margin: 0 0 var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Study page — fill main; sidebar + chart column scroll independently */
.page--study .page-main--fill .study-layout {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: stretch;
  gap: 0;
  min-width: 0;
  width: 100%;
  overflow: hidden;
}

.study-sidebar {
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

.study-sidebar__scroll {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: var(--space-4);
  padding-top: var(--space-4);
  padding-bottom: var(--space-4);
  padding-right: var(--space-4);
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.study-sidebar-intro {
  margin: 0 0 var(--space-3);
  font-size: var(--font-size-xs);
  line-height: var(--font-leading-normal);
  color: var(--text-secondary);
}

.study-sidebar-section + .study-sidebar-section {
  margin-top: var(--space-3);
}

.study-sidebar-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--font-tracking-wide);
  margin-bottom: var(--space-2);
}

.study-plan-checks {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.study-checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  line-height: var(--font-leading-normal);
}

.study-sidebar-select {
  width: 100%;
}

.study-sidebar .select-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--font-tracking-wide);
}

.study-member-option {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.study-member-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
  background-color: var(--swatch-color);
}

.study-member-swatch--neutral {
  background: var(--color-neutral-300);
}

.study-jump-nav {
  min-height: 0;
}

.study-jump-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.study-jump-link {
  width: 100%;
  text-align: left;
  padding: var(--space-1) var(--space-1);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: var(--font-size-sm);
  font-family: inherit;
  color: var(--text);
  cursor: pointer;
  line-height: var(--font-leading-tight);
}

.study-jump-link:hover {
  background: var(--color-neutral-0);
}

.study-jump-link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.study-sidebar-empty {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--font-leading-normal);
}

.study-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  /* Match month dashboard main column inset */
  padding: var(--space-4);
  box-sizing: border-box;
}

.study-category-card {
  scroll-margin-top: var(--space-4);
  min-height: 0;
}

/* Emoji + title: flex aligns canvas height with heading text (inline-block emoji was visually low) */
.study-category-card .section-card__title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  min-width: 0;
}

.study-category-card .study-category-card__emoji {
  flex-shrink: 0;
  vertical-align: unset;
  align-self: center;
}

/* Study category charts — title/KPI header row on light gray (card body stays white) */
.page--study .study-grid .section-card__header {
  background: var(--color-surface-muted);
  padding: var(--space-2) var(--space-3);
}

/* Empty / filter messages — same flat shell as monthly section cards */
.page--study .study-main > .card {
  border-radius: 0;
  box-shadow: none;
  border: 1px solid var(--border);
  background: var(--color-neutral-0);
  margin-bottom: 0;
}

@media (max-width: 900px) {
  .page--study .study-layout {
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }

  .study-sidebar {
    flex: 0 0 auto;
    width: 100%;
    min-height: 0;
    border-right: none;
    border-bottom: none;
    overflow: visible;
  }

  .study-sidebar__scroll {
    overflow-y: visible;
    padding-bottom: var(--space-4);
  }

  .study-main {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: visible;
  }
}

.study-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-3);
  width: 100%;
}

.study-grid > .section-card {
  width: 100%;
  min-width: 0;
}

/* Mini KPI — Study grid uses neutral-0 via appGlobal02-month-dashboard; default below for other pages */
.mini-kpi {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--color-neutral-50);
  color: var(--text);
}

.mini-kpi-top {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.mini-kpi-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text-secondary);
  line-height: 0;
}

.mini-kpi-svg {
  display: block;
}

.mini-kpi-label {
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-neutral-400);
  line-height: 1.2;
  white-space: nowrap;
}

.mini-kpi-bottom {
  display: flex;
  align-items: baseline;
  gap: 3px;
  padding-left: 15px;
}

.mini-kpi--no-icon .mini-kpi-bottom {
  padding-left: 0;
}

.mini-kpi-amount {
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
  color: var(--text);
}

.mini-kpi-currency {
  font-size: 8px;
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-400);
  line-height: 1.2;
  text-transform: uppercase;
}

.mini-kpi--amount-good .mini-kpi-amount,
.mini-kpi--amount-good .mini-kpi-currency {
  color: var(--success);
}

.mini-kpi--amount-bad .mini-kpi-amount,
.mini-kpi--amount-bad .mini-kpi-currency {
  color: var(--danger);
}

.study-tooltip {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  box-shadow: var(--shadow-tooltip);
}

.study-tooltip-title {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-0-5);
}

.study-tooltip-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.study-tooltip-member {
  color: var(--member-color);
}

.study-tooltip-budget {
  font-size: var(--font-size-sm);
  color: var(--danger);
  margin-top: var(--space-0-5);
}

.study-legend {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  flex-wrap: wrap;
}

.study-legend--sidebar {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: 0;
}

.study-legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.study-legend-swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.member-color-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: var(--space-1-5);
  background-color: var(--dot-color);
  vertical-align: middle;
}

.member-color-dot--column {
  margin-right: 0;
}

.settings-member-color-cell {
  width: 5rem;
  max-width: 6rem;
  text-align: center;
  vertical-align: middle;
}

/* -------------------------------------------------------------------------
   Utilities — prefer these over inline styles (all values from tokens)
   ------------------------------------------------------------------------- */
.u-text-right {
  text-align: right;
}

.u-text-center {
  text-align: center;
}

.u-cursor-pointer {
  cursor: pointer;
}

.u-font-semibold {
  font-weight: var(--font-weight-semibold);
}

.u-mb-4 {
  margin-bottom: var(--space-4);
}

.u-mb-5 {
  margin-bottom: var(--space-5);
}

.u-mt-2 {
  margin-top: var(--space-2);
}

.u-mt-4 {
  margin-top: var(--space-4);
}

.u-muted {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.th-narrow {
  width: 40px;
}

.table-amount {
  text-align: right;
}

/* Single-line truncation (e.g. operations category column) */
.table-cell-ellipsis {
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.th-actions {
  width: 120px;
}

/* Operations row menu — no visible header label */
.th-actions-head {
  width: 48px;
}

.budget-as-of-banner {
  padding: var(--space-3) var(--space-6);
  margin-bottom: var(--space-5);
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

/* Budget page: list (SectionCard) + pie — same widget header as month dashboard */
.page--budget .page-main--fill > .budget-dashboard-root {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: var(--space-4);
  box-sizing: border-box;
}

.budget-dashboard-layout {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  grid-template-rows: minmax(0, 1fr);
  gap: var(--space-6);
  align-items: stretch;
  width: 100%;
}

.budget-dashboard-layout--empty {
  grid-template-columns: minmax(0, 1fr);
}

@media (max-width: 900px) {
  .budget-dashboard-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .budget-dashboard-layout__chart {
    order: -1;
  }
}

.budget-dashboard-layout__list {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.budget-dashboard-layout__list > .section-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.budget-dashboard-layout__chart {
  min-width: 0;
  min-height: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}

@media (min-width: 901px) {
  .budget-dashboard-layout__chart {
    justify-content: center;
  }
}

.budget-dashboard-widget.section-card.dashboard-widget {
  border-radius: 0;
}

.budget-dashboard-widget .section-card__body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

/* Title + edit as a tight cluster (12px gap); KPI stays in header-actions */
.budget-dashboard-widget h2.section-card__title {
  min-width: 0;
}

.budget-dashboard-widget .section-card__header-title-group .section-card__title {
  flex: 1;
  min-width: 0;
}

.budget-dashboard-widget__title-cluster {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  max-width: 100%;
  width: fit-content;
  min-width: 0;
}

.budget-dashboard-widget__title-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Match month dashboard: KPI tile on muted header strip */
.page--budget .budget-dashboard-widget .section-card__header-kpis .mini-kpi {
  background: var(--color-neutral-0);
}

/* Shared width + horizontal center so total and pie share one vertical axis */
.budget-chart-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: min(560px, 100%);
  margin-inline: auto;
  flex: 0 0 auto;
}

.budget-chart-stack .pie-chart-container--solo {
  width: 100%;
}

.budget-chart-empty {
  text-align: center;
  padding: var(--space-8) var(--space-4);
}

.budget-dashboard-widget__empty {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  box-sizing: border-box;
}

.budget-empty-categories-hint {
  padding: 0;
  margin: 0;
  flex: 0 0 auto;
}

/* Scroll area below header; row action menus may clip at scroll edges */
.budget-category-scroll {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  background: transparent;
}

.budget-category-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

/* Add budget — full-width text control below last category (scrolls with list) */
.budget-category-list-add {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-top: var(--space-2);
  padding-left: var(--space-4);
  padding-right: var(--space-4);
  margin-bottom: var(--space-4);
}

.budget-add-category-btn.btn {
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
}

.budget-category-list-add--empty {
  padding-top: var(--space-3);
  padding-bottom: var(--space-2);
  padding-inline: 8px;
  margin-top: 0;
}

.budget-category-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 12px 16px;
  border: none;
  border-radius: 0;
  background: var(--card-bg);
  transition: background 0.15s ease;
}

/* Hidden from pie chart — muted “greyed out” row */
.budget-category-card--chart-hidden {
  background: var(--color-neutral-100);
}

.budget-category-card--chart-hidden .budget-category-card-label,
.budget-category-card--chart-hidden .budget-category-card-balance {
  color: var(--text-secondary);
}

.budget-category-card--chart-hidden .budget-category-card-sub {
  color: var(--text-secondary);
  opacity: 0.75;
}

.budget-category-card--chart-hidden .budget-category-card-emoji {
  opacity: 0.45;
  filter: grayscale(0.45);
}

.budget-category-card--interactive {
  cursor: pointer;
  transition: background 0.15s ease;
}

.budget-category-card--interactive:hover {
  background: var(--color-neutral-50);
}

.budget-category-card--chart-hidden.budget-category-card--interactive:hover {
  background: var(--color-neutral-200);
}

/* Match month accounts row: light grey circle + emoji */
.budget-category-card-emoji {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  border-radius: 50%;
  background: var(--color-neutral-100);
  border: none;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
}

.budget-category-card-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1px;
}

.budget-category-card-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: none;
  letter-spacing: normal;
  color: var(--color-neutral-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.budget-category-card-sub {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  white-space: nowrap;
}

.budget-category-card-balance {
  flex-shrink: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-900);
  text-align: right;
  white-space: nowrap;
  margin-left: var(--space-2);
}

.budget-category-card-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.budget-category-chart-toggle {
  flex-shrink: 0;
}

/* Settings: row opens edit panel */
.settings-table-row {
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-default);
}

.settings-table-row:hover {
  background: var(--color-neutral-50);
}

/* Settings: edit side panel — context strip above form */
.settings-edit-context {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  margin: 0 0 var(--space-5);
  background: var(--color-surface-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.settings-edit-context--category {
  align-items: center;
}

.settings-edit-context--rule {
  display: block;
}

.settings-edit-context__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
  box-shadow: inset 0 0 0 1px var(--color-black-alpha-10);
  background-color: var(--dot-color, #3b82f6);
}

.settings-edit-context__emoji {
  font-size: 1.75rem;
  line-height: 1;
  flex-shrink: 0;
}

.settings-edit-context__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  line-height: 1.3;
}

.settings-edit-context__subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: 2px;
}

.settings-edit-context__hint {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin: var(--space-2) 0 0;
  line-height: 1.45;
}

/* Settings side panels: primary actions left, destructive action aligned right */
.settings-panel-form-actions {
  flex-wrap: wrap;
}

.settings-panel-form-actions .btn-danger {
  margin-left: auto;
}

.settings-edit-context__code {
  display: block;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  padding: var(--space-2) var(--space-3);
  background: var(--color-neutral-0);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  word-break: break-all;
}

.settings-account-savings-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-700);
  background: var(--color-neutral-100);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.category-edit-emoji-name {
  display: flex;
  gap: var(--space-1-5);
  align-items: center;
}

.category-emoji-input {
  width: 40px;
  text-align: center;
}

.filter-group--end {
  align-self: flex-end;
}

.form-row--category-add {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.form-row--category-add .form-group--emoji {
  flex: 0 0 60px;
}

.form-row--category-add .form-group--grow {
  flex: 1;
  min-width: 0;
}

/* Pixelated emoji (canvas); aligns with adjacent text */
.emoji-pixel {
  display: inline-block;
  vertical-align: -0.2em;
  line-height: 0;
}

.emoji-pixel__canvas {
  display: block;
}

.category-inline-label {
  display: inline;
  vertical-align: baseline;
}

.category-inline-label .emoji-pixel {
  margin-right: 0.15em;
  vertical-align: -0.18em;
}

/* Savings / Accounts page */
.page--savings .page-main--fill {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: var(--space-8) var(--space-6) var(--space-6);
}

.savings-sub-header {
  overflow: visible;
}

.savings-header-filters {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.savings-date-filter {
  min-width: 160px;
}

.savings-kpi-row {
  display: flex;
  align-items: stretch;
  gap: var(--space-3);
}

.savings-empty {
  padding: var(--space-6);
}

.savings-chart-wrap {
  flex: 1;
  min-height: 300px;
  /* Horizontal inset comes from \`.page--savings .page-main--fill\` */
  padding: 0;
}

.savings-account-filter {
  min-width: 200px;
}

.savings-account-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.savings-account-option .member-badge {
  flex-shrink: 0;
}

.savings-account-option__all-icon {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-neutral-100);
  border: 1px solid var(--border);
  color: var(--color-neutral-600);
}

.savings-account-option__all-icon svg {
  display: block;
}

.savings-account-option__name {
  min-width: 0;
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Wider than default \`.select-dropdown-wide\` so long account names stay on one line */
.savings-account-filter__dropdown {
  min-width: max(100%, 24rem);
  max-width: min(42rem, calc(100vw - 2rem));
}

.savings-tooltip {
  background: var(--card-bg, #fff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-md, 8px);
  padding: var(--space-2) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: var(--shadow-sm);
}

.savings-tooltip-month {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted, #94a3b8);
  margin-bottom: 2px;
}

.savings-tooltip-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
}

.savings-tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--dot-color);
}

.savings-tooltip-acct {
  flex: 1;
  color: var(--color-text-muted, #94a3b8);
}

.savings-tooltip-value {
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.savings-tooltip-total {
  border-top: 1px solid var(--color-border, #e2e8f0);
  padding-top: 4px;
  margin-top: 2px;
  font-weight: var(--font-weight-semibold);
}
`;

export default APPGLOBAL;
