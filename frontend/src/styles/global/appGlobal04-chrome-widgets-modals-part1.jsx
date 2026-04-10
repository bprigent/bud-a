import { createGlobalStyle } from 'styled-components';

/** Global styles (migrated from App.css) — chunk 4/6: appGlobal04-chrome-widgets-modals-part1 */
const APPGLOBAL = createGlobalStyle`
.ops-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: 0;
  flex-wrap: wrap;
}

.page-sub-header.ops-toolbar {
  gap: var(--space-2);
  margin-bottom: 0;
}

.page-sub-header.ops-toolbar .ops-toolbar-left {
  gap: var(--space-2);
}

.ops-toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.ops-toolbar-date {
  padding: 5px 8px;
  font-size: var(--font-size-sm);
  font-family: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-neutral-0);
  color: var(--text);
  width: 130px;
  box-shadow: var(--shadow-tab-track);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.ops-toolbar-date:hover:not(:focus) {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.ops-toolbar-date:focus {
  outline: none;
  border-color: var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  background: var(--color-neutral-0);
}

.ops-toolbar-sep {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.ops-toolbar-search {
  padding: 5px 10px;
  font-size: var(--font-size-sm);
  font-family: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-neutral-0);
  color: var(--text);
  width: 180px;
  box-shadow: var(--shadow-tab-track);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.ops-toolbar-search:hover:not(:focus) {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.ops-toolbar-search:focus {
  outline: none;
  border-color: var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  background: var(--color-neutral-0);
}

.ops-toolbar .select-trigger {
  /* Same metrics as default .select-trigger / text toggles */
  min-height: unset;
}

.ops-toolbar .select-wrap {
  min-width: unset;
}

.ops-toolbar-period-select.date-range-picker {
  min-width: 8.5rem;
}

/* Dual-calendar date range picker (Operations toolbar) */
.date-range-picker {
  position: relative;
}

.drp-popover {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: var(--z-popover);
  margin-top: var(--space-1);
  padding: var(--space-4);
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px var(--color-black-alpha-10);
  min-width: min(36rem, calc(100vw - 2rem));
}

.drp-presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.drp-preset {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: var(--font-size-sm);
  font-family: inherit;
  background: var(--card-bg);
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.drp-preset:hover {
  border-color: var(--color-neutral-800);
  background: var(--color-surface-muted);
}

.drp-preset-active {
  border: 2px solid var(--color-neutral-900);
  padding: 5px 11px;
  font-weight: var(--font-weight-medium);
}

.drp-cal-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.drp-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

.drp-nav-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text);
  cursor: pointer;
}

.drp-nav-arrow:hover {
  background: var(--color-neutral-100);
}

.drp-months {
  display: flex;
  flex: 1;
  gap: var(--space-5);
  min-width: 0;
}

.drp-month {
  flex: 1;
  min-width: 0;
}

.drp-month-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: center;
  margin-bottom: var(--space-3);
  color: var(--text);
}

.drp-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: var(--space-2);
  text-align: center;
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.drp-weekday {
  padding: 2px 0;
}

.drp-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.drp-day {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-height: 2rem;
  max-height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  font-size: var(--font-size-sm);
  font-family: inherit;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}

.drp-day:hover:not(:disabled) {
  background: var(--color-neutral-100);
}

.drp-day-muted {
  color: var(--color-neutral-400);
}

.drp-day-mid {
  border-radius: 4px;
  background: var(--color-neutral-200);
  color: var(--text);
}

.drp-day-mid:hover {
  background: var(--color-neutral-300);
}

.drp-day-start,
.drp-day-end,
.drp-day-single {
  background: var(--color-neutral-900);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-medium);
}

.drp-day-start:hover,
.drp-day-end:hover,
.drp-day-single:hover {
  background: var(--color-neutral-800);
  color: var(--color-text-inverse);
}

.drp-day-end {
  box-shadow: inset 0 0 0 2px var(--color-neutral-0);
}

.drp-day-single {
  border-radius: 50%;
}

/* Today: primary ring (legend dot matches). End date keeps inner ring + outer ring. */
.drp-day-today:not(.drp-day-end) {
  position: relative;
  z-index: 1;
  box-shadow: 0 0 0 2px var(--primary);
}

.drp-day-end.drp-day-today {
  position: relative;
  z-index: 1;
  box-shadow: 0 0 0 2px var(--primary), inset 0 0 0 2px var(--color-neutral-0);
}

/* Filter bar */
.filter-bar {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 140px;
}

.filter-group label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--font-tracking-wide);
}

.filter-group select,
.filter-group input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-base);
  font-family: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-neutral-0);
  color: var(--text);
  box-shadow: var(--shadow-tab-track);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.filter-group select:not(:disabled):not(:focus):hover,
.filter-group input:not(:disabled):not(:focus):hover {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  background: var(--color-neutral-0);
}

/* Button group — segmented track + selected pill (shared with .segmented-tabs) */
.btn-group {
  display: inline-flex;
  align-items: stretch;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-sm);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-tab-track);
}

.btn-group.btn-group-sm {
  padding-block: var(--control-compact-track-pad-y);
  padding-inline: var(--space-1);
}

.btn-group-item {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-600);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, font-weight 0.2s ease, background 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  position: relative;
  white-space: nowrap;
}

.btn-group-item:hover:not(.active) {
  color: var(--color-neutral-800);
}

.btn-group-item.active {
  background: var(--color-neutral-100);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
}

.btn-group-item:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
  z-index: 1;
}

.btn-group-sm .btn-group-item {
  padding: 6px 8px;
  font-size: var(--font-size-xs);
  line-height: var(--font-leading-tight);
}

/* Icon-only segmented control — matches .segmented-tabs / .btn-group track + pill */
.icon-button-group {
  display: inline-flex;
  align-items: stretch;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-sm);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-tab-track);
}

.icon-button-group-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  min-height: 2rem;
  padding: 6px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  color: var(--color-neutral-600);
  transition: color 0.2s ease, background 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.icon-button-group-item:hover:not(.active) {
  color: var(--color-neutral-800);
}

.icon-button-group-item svg {
  flex-shrink: 0;
  display: block;
}

.icon-button-group--primary .icon-button-group-item.active,
.icon-button-group--secondary .icon-button-group-item.active {
  background: var(--color-neutral-100);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  color: var(--color-text-primary);
}

.icon-button-group--primary .icon-button-group-item.active:hover,
.icon-button-group--secondary .icon-button-group-item.active:hover {
  color: var(--color-text-primary);
}

.icon-button-group--primary .icon-button-group-item:focus-visible,
.icon-button-group--secondary .icon-button-group-item:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
  z-index: 1;
}

/* View toggle (uses btn-group styling for icon buttons) */
.view-toggle {
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--card-bg);
}

.view-toggle .btn {
  border-radius: 0;
  border: none;
  border-left: 1px solid var(--border);
}

.view-toggle .btn:first-child {
  border-left: none;
}

/* Pie chart (Recharts) */
.pie-chart-container {
  display: flex;
  align-items: flex-start;
  gap: var(--space-10);
  flex-wrap: wrap;
  justify-content: center;
  padding: var(--space-4) 0;
}

.pie-chart-container--solo {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.pie-chart-svg-wrap {
  flex: 0 1 300px;
  width: 100%;
  max-width: 300px;
  min-width: 0;
}

.pie-chart-container--solo .pie-chart-svg-wrap {
  flex: 1 1 auto;
  align-self: stretch;
  max-width: min(560px, 100%);
  min-height: min(420px, 55vh);
}

.pie-chart-tooltip {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow);
}

.pie-chart-tooltip-title {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-1);
}

.pie-chart-tooltip-value {
  color: var(--text-secondary);
}

.pie-chart-slice-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  pointer-events: none;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 200px;
}

.pie-legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
}

.pie-legend-color {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-xs);
  flex-shrink: 0;
  background: var(--legend-color);
}

.pie-legend-label {
  flex: 1;
  font-weight: var(--font-weight-medium);
}

.pie-legend-value {
  color: var(--text-secondary);
  white-space: nowrap;
}

/* Budget items */
.budget-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.budget-list-nav-row {
  transition: background-color 0.12s ease;
}

@media (hover: hover) {
  .budget-list-nav-row:hover {
    background: var(--color-neutral-50);
  }
}

.budget-list-nav-row:focus-visible {
  outline: 2px solid var(--color-focus-ring, var(--color-primary-500));
  outline-offset: 2px;
}

.budget-item,
.budget-card {
  padding: var(--space-3) 0;
}

.budget-card {
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.budget-header h3 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}

.budget-info,
.budget-numbers {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-base);
  margin-bottom: var(--space-2);
  gap: var(--space-4);
  flex-wrap: wrap;
}

.progress-bar {
  height: 8px;
  background: var(--color-neutral-200);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: var(--space-1);
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: var(--radius-sm);
  transition: width 0.3s ease;
}

.progress-fill.over {
  background: var(--danger);
}

/* Type badges */
.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.type-expense {
  background: var(--color-danger-bg);
  color: var(--expense-color);
}

.type-income {
  background: var(--color-badge-income-bg);
  color: var(--income-color);
}

.type-both {
  background: var(--color-badge-both-bg);
  color: var(--primary);
}

/* Utility classes */
.income {
  color: var(--income-color);
}

.expense {
  color: var(--expense-color);
}

.loading {
  padding: var(--space-10);
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-15);
}

.error {
  padding: var(--space-3) var(--space-4);
  background: var(--color-danger-bg);
  color: var(--danger);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-4);
  border: 1px solid var(--color-danger-border);
}

.empty {
  padding: var(--space-5);
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

/* In-page section title (inside \`PageMain\`) — see \`SectionHeader.jsx\` */
`;

export default APPGLOBAL;
