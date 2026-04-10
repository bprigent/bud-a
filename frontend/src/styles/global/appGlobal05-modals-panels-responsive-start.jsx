import { createGlobalStyle } from 'styled-components';

/** Global styles (migrated from App.css) — chunk 5/6: appGlobal05-modals-panels-responsive-start */
const APPGLOBAL = createGlobalStyle`
.page-section-header {
  margin: 0 0 var(--space-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--font-leading-tight);
  color: var(--color-neutral-800);
}

.page-section-header-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.page-section-header__lead {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
}

.page-section-header-row .page-section-header {
  margin-bottom: 0;
  min-width: 0;
}

.page-section-header__subtitle {
  margin: 0;
  max-width: 42rem;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--font-leading-normal);
  color: var(--color-text-muted);
}

.page-section-header-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
}

.page-section-header-stack .page-section-header {
  margin-bottom: 0;
}

.page-section-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
  padding-top: 0.125rem;
}

/* Settings: strip card chrome from section-cards so tables sit directly below sub-headers */
.page--settings .page-main > .section-card {
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.page--settings .page-main > .section-card > .section-card__body {
  padding-top: 0;
  padding-left: var(--space-5);
  padding-right: var(--space-5);
}

/* Above a \`SectionCard\` with \`hideHeader\`, match \`.section-card__body\` horizontal inset (Settings, etc.). */
.page-main > .page-section-header-row {
  padding: var(--space-4) var(--space-5) 0;
}

.page-main > .page-section-header-stack {
  padding: var(--space-4) var(--space-5) 0;
}

.page-main > h2.page-section-header {
  padding: var(--space-4) var(--space-5) 0;
}

/* Select component */
.select-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.select-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}

.select-hidden-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--control-compact-pad-y) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--font-leading-tight);
  font-family: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-neutral-0);
  color: var(--text);
  cursor: pointer;
  box-shadow: var(--shadow-tab-track);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  gap: var(--space-1-5);
  text-align: left;
}

.select-trigger:hover:not(:disabled):not(.select-trigger-open) {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.select-trigger-open,
.select-trigger:focus-visible {
  outline: none;
  border-color: var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  background: var(--color-neutral-0);
}

.select-trigger-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.select-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-value:has(.study-member-option) {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.select-placeholder {
  color: var(--text-secondary);
}

.select-chevron {
  flex-shrink: 0;
  color: var(--text-secondary);
  transition: transform 0.15s;
}

.select-trigger-open .select-chevron {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--z-popover);
  margin-top: var(--space-1);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

/* Wider panel than trigger — long labels (e.g. category emoji + name) */
.select-dropdown-wide {
  right: auto;
  min-width: max(100%, 20rem);
  width: max-content;
  max-width: min(36rem, calc(100vw - 2rem));
}

.select-search-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-bottom: 1px solid var(--border);
}

.select-search-wrap--clear-only {
  justify-content: flex-end;
}

.select-search {
  flex: 1;
  min-width: 0;
  width: auto;
  padding: var(--space-1-5) var(--space-2-5);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-neutral-0);
  color: var(--text);
  font-family: inherit;
  box-shadow: var(--shadow-tab-track);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.select-search:hover:not(:focus) {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.select-clear-icon-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.select-clear-icon-btn:hover {
  background: var(--color-neutral-100);
  color: var(--text);
}

.select-clear-icon-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--card-bg), 0 0 0 4px var(--primary);
}

.select-search:focus {
  outline: none;
  border-color: var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  background: var(--color-neutral-0);
}

.select-options {
  list-style: none;
  margin: 0;
  padding: var(--space-1) 0;
  max-height: 220px;
  overflow-y: auto;
}

.select-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-base);
  cursor: pointer;
  color: var(--text);
}

.select-option:hover {
  background: var(--color-neutral-100);
}

.select-option-selected {
  background: var(--color-neutral-100);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.select-option-selected:hover {
  background: var(--color-neutral-200);
}

.select-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-2xs);
  flex-shrink: 0;
  color: transparent;
}

.select-check-active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--color-neutral-0);
}

.select-empty {
  padding: var(--space-3);
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* Select spacing in forms */
form .select-wrap {
  margin-bottom: var(--space-4);
}

.form-row .select-wrap {
  margin-bottom: 0;
}

/* Filter bar select overrides */
.filter-group .select-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--font-tracking-wide);
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-overlay-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-overlay);
}

.modal {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: 0 8px 30px var(--color-black-alpha-20);
  width: 100%;
  max-width: 480px;
  padding: var(--space-6);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
}

.modal-header h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-3xl);
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0 var(--space-1);
  line-height: 1;
}

.modal-close:hover {
  color: var(--text);
}

/* Close control uses shared Button — reset btn/ghost chrome */
.modal-header .btn.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-3xl);
  padding: 0 var(--space-1);
  line-height: 1;
  min-width: auto;
  min-height: auto;
  box-shadow: none;
}

.modal-header .btn.modal-close:hover {
  background: none;
  border: none;
  color: var(--text);
}

/* Side panel (slide-in from right) */
.side-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-overlay-scrim);
  z-index: var(--z-overlay);
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
}

.side-panel {
  width: 100%;
  max-width: var(--panel-max-width, 440px);
  height: 100%;
  max-height: 100dvh;
  background: var(--card-bg);
  box-shadow: -8px 0 32px var(--color-black-alpha-15);
  display: flex;
  flex-direction: column;
  min-height: 0;
  animation: sidePanelSlideIn 0.22s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .side-panel {
    animation: none;
  }
}

@keyframes sidePanelSlideIn {
  from {
    transform: translateX(100%);
    opacity: 0.96;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.side-panel-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.side-panel-header h2 {
  flex: 1 1 auto;
  min-width: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  line-height: 1.35;
  overflow-wrap: anywhere;
  word-break: break-word;
  padding-right: var(--space-2);
}

.side-panel-header-end {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.side-panel-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.side-panel-header-unsaved {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.side-panel-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-6);
}

.side-panel-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--border);
  padding: var(--space-4) var(--space-6);
  background: var(--card-bg);
}

.side-panel-footer__inner {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--space-2);
  width: 100%;
}

.side-panel-footer-unsaved {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  margin-right: auto;
}

.side-panel-footer__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

/* Section labels (PanelSectionTitle / .form-control-group-title) — larger, sentence case */
.side-panel-content .form-control-group-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  text-transform: none;
  letter-spacing: normal;
}

/* Operation detail (read-only side panel) — v2 layout */
.operation-detail-v2 {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  min-height: 100%;
}

/* Hero: emoji, label, amount, type badge — centered */
.operation-detail-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-6) var(--space-4) var(--space-2);
  gap: var(--space-2);
}

.operation-detail-hero__emoji {
  margin-bottom: var(--space-2);
}

.operation-detail-hero__label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  word-break: break-word;
  line-height: 1.3;
}

.operation-detail-hero__amount-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.operation-detail-hero__amount {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.operation-detail-type-line {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin: 0;
}

.operation-detail-type-hint {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Sections (about, danger zone) */
.operation-detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.operation-detail-section--danger {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
  margin-top: auto;
}

.operation-detail-section--danger .form-control-group-title {
  color: var(--color-text-muted);
}

.operation-detail-danger__body {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--space-3);
}

.operation-detail-danger__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--font-leading-normal);
  color: var(--color-text-muted);
}

/* Detail list rows */
.operation-detail-dl {
  margin: 0;
  padding: 0;
}

.operation-detail-row {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: var(--space-2) var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border);
  font-size: var(--font-size-sm);
}

.operation-detail-row:last-of-type {
  border-bottom: none;
}

.operation-detail-row dt {
  margin: 0;
  padding: 0;
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.operation-detail-row dd {
  margin: 0;
  padding: 0;
  color: var(--text);
  word-break: break-word;
}

.operation-detail-label-text {
  white-space: pre-wrap;
}

.operation-detail-row--muted {
  opacity: 0.88;
  font-size: var(--font-size-xs);
}

.operation-detail-id {
  font-size: var(--font-size-xs);
  word-break: break-all;
}

.table-row-clickable {
  cursor: pointer;
}

.table-compact tbody tr.table-row-clickable:hover {
  background: var(--color-surface-muted);
}

.td-row-actions {
  cursor: default;
}

/* Responsive */
`;

export default APPGLOBAL;
