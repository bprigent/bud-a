import { createGlobalStyle } from 'styled-components';

/** Global styles (migrated from App.css) — chunk 3/6: appGlobal03-tables-forms-tabs-toolbar */
const APPGLOBAL = createGlobalStyle`
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: var(--font-size-base);
}

thead th {
  text-align: left;
  padding: var(--space-2-5) var(--space-3);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-2xs);
  color: var(--color-neutral-400);
  background: var(--color-neutral-100);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0;
}

/* Space between header cells (margin on th is ignored in table layout) */
thead th + th {
  border-left: var(--space-1) solid var(--card-bg);
}

tbody td {
  padding: var(--space-2-5) var(--space-3);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

.table-compact {
  font-size: var(--font-size-sm);
}

.table-compact thead th {
  padding: var(--space-1-5) var(--space-2-5);
}

.table-compact tbody td {
  padding: var(--space-1-5) var(--space-2-5);
}

/* Operations: keep date header + values on one line ("Jan 15" must not break) */
.table-compact thead th:first-child,
.table-compact tbody td:first-child {
  white-space: nowrap;
}

/* Table blocks — scroll shells around \`<table>\` (\`TableBlock.jsx\`) */
.table-block {
  min-width: 0;
  max-width: 100%;
}

.table-block--fill {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.table-block__scroll {
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
}

/* Default: wide tables scroll horizontally; vertical flow follows the page */
.table-block:not(.table-block--sticky) .table-block__scroll {
  overflow-x: auto;
  overflow-y: visible;
}

/* Sticky header: bounded region scrolls; \`thead th\` stays visible */
.table-block--sticky .table-block__scroll {
  overflow: auto;
  overscroll-behavior: contain;
}

.table-block--fill .table-block__scroll {
  flex: 1;
  min-height: 0;
}

.table-block--sticky thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--color-neutral-100);
}

/* Member column: initials + badge (narrow). Hue fallback or member.color hex in MemberBadge */
.member-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.625rem;
  height: 1.375rem;
  padding: 0 var(--space-1-5);
  border-radius: var(--radius-full);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  letter-spacing: 0.02em;
  background: var(--badge-bg, hsl(var(--member-badge-hue, 220), 42%, 90%));
  color: var(--badge-fg, hsl(var(--member-badge-hue, 220), 42%, 22%));
  border: 1px solid var(--badge-border, hsl(var(--member-badge-hue, 220), 38%, 80%));
}

.member-badge--unknown {
  --member-badge-hue: 220;
  background: var(--color-neutral-200);
  color: var(--color-neutral-700);
  border-color: var(--color-neutral-300);
}

.th-member-badge,
.td-member-badge {
  width: 1%;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
}

/* Account row: logo + name (tables, filters) */
.account-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  max-width: 100%;
  vertical-align: middle;
}

.account-badge__logo-wrap {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-neutral-100);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-badge__logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.account-badge__placeholder {
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  line-height: 1;
}

.account-badge__name {
  font-size: var(--font-size-xs);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-badge--empty {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}

.td-account-badge {
  min-width: 0;
  max-width: 14rem;
}

tbody tr:hover {
  background: var(--color-neutral-50);
}

/* Buttons: \`Button.styled.jsx\` */

td .btn + .btn {
  margin-left: 6px;
}

/* Table row actions (⋯ menu) */
.row-actions {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

.row-actions-trigger {
  font-size: 1.25rem;
  line-height: 1;
  letter-spacing: 0;
  display: block;
  margin-top: -2px;
}

.row-actions-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  margin: 0;
  padding: var(--space-1) 0;
  list-style: none;
  min-width: 120px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  z-index: var(--z-dropdown);
}

.row-actions-menu li {
  margin: 0;
}

.row-actions-menu-item {
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3-5);
  border: none;
  background: none;
  text-align: left;
  font-size: var(--font-size-base);
  color: var(--text);
  cursor: pointer;
  font-family: inherit;
}

.row-actions-menu-item:hover {
  background: var(--color-neutral-100);
}

.row-actions-menu-item-danger {
  color: var(--danger);
}

.row-actions-menu-item-danger:hover {
  background: var(--color-danger-bg);
}

/* Forms */
.form-group {
  margin-bottom: var(--space-4);
}

.form-checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  cursor: pointer;
  line-height: var(--font-leading-normal);
}

/* Custom checkbox — 20×20px (typical web density; ~16–20px is common, 24px+ if prioritizing touch) */
.form-checkbox-label input[type='checkbox'],
.study-checkbox-label input[type='checkbox'] {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  flex-shrink: 0;
  border: 1.5px solid var(--color-neutral-800);
  border-radius: var(--radius-xs);
  background: var(--color-neutral-0);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  position: relative;
  box-sizing: border-box;
}

.form-checkbox-label input[type='checkbox'] {
  margin-top: 0;
}

.study-checkbox-label input[type='checkbox'] {
  margin-top: 0;
}

.form-checkbox-label input[type='checkbox']:hover:not(:disabled),
.study-checkbox-label input[type='checkbox']:hover:not(:disabled) {
  border-color: var(--color-neutral-900);
}

.form-checkbox-label input[type='checkbox']:focus-visible,
.study-checkbox-label input[type='checkbox']:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}

.form-checkbox-label input[type='checkbox']:checked,
.study-checkbox-label input[type='checkbox']:checked {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-900);
}

.form-checkbox-label input[type='checkbox']:checked::after,
.study-checkbox-label input[type='checkbox']:checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 3px;
  width: 5px;
  height: 9px;
  border: solid var(--color-neutral-0);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  box-sizing: border-box;
}

.form-checkbox-label input[type='checkbox']:disabled,
.study-checkbox-label input[type='checkbox']:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.form-radio-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  cursor: pointer;
  line-height: var(--font-leading-normal);
}

.form-radio-label input[type='radio'] {
  appearance: none;
  -webkit-appearance: none;
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  border: 1.5px solid var(--color-neutral-800);
  border-radius: 50%;
  background: var(--color-neutral-0);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  position: relative;
  box-sizing: border-box;
}

.form-radio-label input[type='radio']:hover:not(:disabled) {
  border-color: var(--color-neutral-900);
}

.form-radio-label input[type='radio']:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}

.form-radio-label input[type='radio']:checked {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-900);
}

.form-radio-label input[type='radio']:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: var(--color-neutral-0);
}

.form-radio-label input[type='radio']:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Toggle switch — sliding thumb on a track (boolean; pairs with \`Toggle.jsx\`) */
.form-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  cursor: pointer;
  line-height: var(--font-leading-normal);
  position: relative;
  user-select: none;
}

.form-toggle-label:has(.form-toggle-input:disabled) {
  opacity: 0.45;
  cursor: not-allowed;
}

.form-toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.form-toggle-track {
  position: relative;
  flex-shrink: 0;
  width: 2.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: var(--color-neutral-300);
  transition: background var(--duration-fast) var(--ease-default);
  box-shadow: var(--shadow-tab-track);
}

.form-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(1.25rem - 4px);
  height: calc(1.25rem - 4px);
  border-radius: 50%;
  background: var(--color-neutral-0);
  box-shadow: var(--shadow-xs);
  transition:
    transform var(--duration-fast) var(--ease-default),
    background var(--duration-fast) var(--ease-default);
}

.form-toggle-input:checked + .form-toggle-track {
  background: var(--color-neutral-900);
}

.form-toggle-input:checked + .form-toggle-track .form-toggle-thumb {
  transform: translateX(calc(2.25rem - 1.25rem));
}

.form-toggle-input:hover:not(:disabled) + .form-toggle-track {
  background: var(--color-neutral-400);
}

.form-toggle-input:checked:hover:not(:disabled) + .form-toggle-track {
  background: var(--color-neutral-800);
}

.form-toggle-input:focus-visible + .form-toggle-track {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}

.form-toggle-input:disabled + .form-toggle-track {
  opacity: 1;
}

.form-toggle-text {
  flex: 1;
  min-width: 0;
}

/* Uppercase group title (e.g. budget list header) */
.form-control-group-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-700);
  text-transform: uppercase;
  letter-spacing: var(--font-tracking-wide);
  margin: 0 0 var(--space-3);
}

.form-control-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group .form-checkbox-label {
  display: flex;
  margin-bottom: 0;
}

.form-group .form-radio-label {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-1-5);
  color: var(--color-text-muted);
}

.form-group input:not([type='checkbox']):not([type='radio']),
.form-group select,
.form-group textarea {
  width: 100%;
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

.form-group input:not([type='checkbox']):not([type='radio']):not(:disabled):not(:focus):hover,
.form-group select:not(:disabled):not(:focus):hover,
.form-group textarea:not(:disabled):not(:focus):hover {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.form-group input:not([type='checkbox']):not([type='radio']):focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  background: var(--color-neutral-0);
}

.form-group input:not([type='checkbox']):not([type='radio']):disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.form-hint {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin: var(--space-1) 0 0;
  line-height: 1.4;
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-danger, #dc2626);
  margin: var(--space-2) 0;
}

.form-success {
  font-size: var(--font-size-sm);
  color: var(--color-success, #16a34a);
  margin: var(--space-2) 0;
}

.budget-plan-kind-hint {
  margin-bottom: var(--space-3);
}

.account-balance-edit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  padding: var(--space-2) 0 var(--space-1);
}

.settings-account-balance-row td {
  vertical-align: top;
  background: var(--color-neutral-50);
}

.settings-account-image-url {
  max-width: 14rem;
  width: 14rem;
  vertical-align: middle;
  overflow: hidden;
}

.settings-account-thumb {
  display: block;
  width: auto;
  max-width: 100%;
  height: 28px;
  margin-bottom: var(--space-1);
  object-fit: contain;
}

.settings-account-image-link {
  display: block;
  font-size: var(--font-size-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--primary);
}

.account-balance-variance-cell {
  font-size: var(--font-size-sm);
}

.account-balance-variance--ok {
  color: var(--text-secondary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.inline-form {
  display: flex;
  gap: var(--space-3);
  align-items: flex-end;
  flex-wrap: wrap;
}

.inline-form input,
.inline-form select {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-base);
  font-family: inherit;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-neutral-0);
  color: var(--text);
  min-width: 160px;
  box-shadow: var(--shadow-tab-track);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.inline-form input:not(:disabled):not(:focus):hover,
.inline-form select:not(:disabled):not(:focus):hover {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.inline-form input:focus,
.inline-form select:focus {
  outline: none;
  border-color: var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  background: var(--color-neutral-0);
}

/* Month picker */
.month-picker {
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

.month-picker:hover:not(:focus) {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.month-picker:focus {
  outline: none;
  border-color: var(--color-border);
  box-shadow: var(--shadow-tab-indicator);
  background: var(--color-neutral-0);
}

/* Segmented tabs — same shell + per-item selected pill as .btn-group (text toggles) */
.segmented-tabs {
  margin-bottom: var(--space-5);
}

.segmented-tabs__tab {
  gap: 6px;
}

/* ── Tabs variants (see Tabs.jsx \`variant\` prop) ── */

/* Large — full width: tabs share row equally (Settings, Budget plans, default) */
.segmented-tabs--lg-full .btn-group.segmented-tabs__group {
  display: flex;
  width: 100%;
  max-width: 100%;
}

.segmented-tabs--lg-full .segmented-tabs__tab {
  flex: 1 1 0;
  min-width: 0;
}

/* Large — shrink: track hugs labels (fit-content) */
.segmented-tabs--lg-shrink {
  align-self: flex-start;
  width: fit-content;
  max-width: 100%;
}

.segmented-tabs--lg-shrink .btn-group.segmented-tabs__group {
  display: inline-flex;
  width: auto;
  max-width: 100%;
}

.segmented-tabs--lg-shrink .segmented-tabs__tab {
  flex: 0 1 auto;
  min-width: 0;
}

/* Small — full width: compact track + equal segments (track + hit area match .btn-group + .btn-group-sm) */
.segmented-tabs--sm-full .btn-group.segmented-tabs__group {
  display: flex;
  width: 100%;
  max-width: 100%;
  padding-block: var(--control-compact-track-pad-y);
  padding-inline: var(--space-1);
  gap: 4px;
}

.segmented-tabs--sm-full .segmented-tabs__tab {
  flex: 1 1 0;
  min-width: 0;
  padding: 6px 8px;
  font-size: var(--font-size-xs);
  line-height: var(--font-leading-tight);
  gap: 4px;
}

.segmented-tabs--sm-full .segmented-tabs__tab.active {
  font-weight: var(--font-weight-bold);
}

.segmented-tabs--sm-full .segmented-tabs__icon {
  width: 14px;
  height: 14px;
}

/* Small — shrink: compact + intrinsic width */
.segmented-tabs--sm-shrink {
  align-self: flex-start;
  width: fit-content;
  max-width: 100%;
}

.segmented-tabs--sm-shrink .btn-group.segmented-tabs__group {
  display: inline-flex;
  width: auto;
  max-width: 100%;
  padding-block: var(--control-compact-track-pad-y);
  padding-inline: var(--space-1);
  gap: 4px;
}

.segmented-tabs--sm-shrink .segmented-tabs__tab {
  flex: 0 1 auto;
  min-width: 0;
  padding: 6px 8px;
  font-size: var(--font-size-xs);
  line-height: var(--font-leading-tight);
  gap: 4px;
}

.segmented-tabs--sm-shrink .segmented-tabs__tab.active {
  font-weight: var(--font-weight-bold);
}

.segmented-tabs--sm-shrink .segmented-tabs__icon {
  width: 14px;
  height: 14px;
}

.segmented-tabs__icon {
  display: inline-flex;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.segmented-tabs__icon svg {
  width: 100%;
  height: 100%;
}

.segmented-tabs__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Operations toolbar */
`;

export default APPGLOBAL;
