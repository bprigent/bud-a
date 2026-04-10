import { createGlobalStyle } from 'styled-components';

/** Global styles (migrated from App.css) — chunk 1/6: appGlobal01-base-page-layout */
const APPGLOBAL = createGlobalStyle`
/* Design tokens: frontend/src/styles/TokenStyles.jsx */

* {
  margin: 0;
  padding: var(--space-0);
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-sans);
  color: var(--text);
  background: var(--bg);
  line-height: var(--font-leading-relaxed);
}

/* App shell layout + sidebar chrome: components/shell/AppShell.styled.jsx */

/* Privacy mode – pixelated overlay */
.redacted-wrap {
  position: relative;
  display: inline;
}

.redacted-content {
  visibility: hidden;
}

.redacted-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

/* Sidebar rows: \`SidebarNavItem.styled.jsx\` */

/* Main column: \`AppShell.styled.jsx\` (\`AppMain\` + class \`main-content\`) */

/* Page — column layout; chrome fixed, body scrolls in \`.page-main\` */
.page {
  margin: 0;
  padding: 0;
  max-width: var(--page-max-width);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Page chrome: \`PageChrome.styled.jsx\` */

/* Page footer shell: \`PageFooter.jsx\` + \`AppShell.styled.jsx\` */

.page--full-width {
  max-width: none;
  width: 100%;
}

/* Budget: fill main area; clip so grid/list get a bounded height */
.page--budget {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.page--budget > .page-header {
  flex-shrink: 0;
}

.page--budget .budget-plan-tabs-row {
  flex-shrink: 0;
}

.budget-plan-tabs-row,
.page-sub-header.budget-plan-tabs-row {
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
  margin-bottom: 0;
  min-width: 0;
}

.budget-plan-tabs-row .segmented-tabs {
  margin-bottom: 0;
  flex: 1;
  min-width: 0;
}

.budget-plan-tabs-row .segmented-tabs--sm-shrink {
  flex: 0 1 auto;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-width: 100%;
}

.budget-plan-tabs-row .segmented-tabs--sm-shrink .btn-group.segmented-tabs__group {
  flex: 1 1 auto;
  min-height: 100%;
}

.page--budget > .budget-as-of-banner {
  flex-shrink: 0;
}

.page--budget .page-main > .loading,
.page--budget .page-main > .error {
  flex-shrink: 0;
}

.page--operations {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}

/* Search + Add Operation: input matches .btn md height; button stays content-sized */
.page--operations .header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
  min-width: 0;
}

.page--operations .header-actions .ops-toolbar-search {
  /* Override .ops-toolbar-search { width: 180px } so flex / max-width apply */
  width: auto;
  flex: 1 1 18rem;
  min-width: 0;
  max-width: 24rem;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  box-sizing: border-box;
  line-height: 1.25;
  min-height: 36px;
}

.page--operations .header-actions .btn {
  flex-shrink: 0;
  align-self: center;
}

.page--operations .operations-main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.page--operations .operations-main > .loading,
.page--operations .operations-main > .error {
  flex-shrink: 0;
}

.page--operations .operations-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  overflow: hidden;
  /* Tighter than default .card (space-6) — table-focused */
  padding: var(--space-4);
}

.page-sub-header.ops-toolbar .page-sub-header__trailing {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.page-sub-header.ops-toolbar .ops-toolbar-kpis {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: flex-end;
  gap: var(--space-2);
}

/* Operations table: amount column shows type as + / − / ⇄ before the value */
.operation-amount-cell {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-1-5);
  width: 100%;
}

.operation-amount-type-icon {
  flex-shrink: 0;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  line-height: 1;
  min-width: 1rem;
  text-align: center;
}

.operation-amount-type-icon--income {
  color: var(--color-finance-income);
}

.operation-amount-type-icon--expense {
  color: var(--color-finance-expense);
}

.operation-amount-type-icon--money_movement {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}

.operation-amount-value {
  font-variant-numeric: tabular-nums;
}

/* Reusable sub-header (section title under page header) — layout & vertical spacing: \`SubHeader.jsx\` */

.sub-header-leading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.sub-header-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-800);
}

.sub-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
  min-width: 0;
}

/* Cards */
.card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: var(--space-6);
  box-shadow: var(--shadow);
  margin-bottom: var(--space-5);
}

.card h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-4);
  color: var(--color-neutral-800);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.stat-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: var(--space-5);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stat-card-icon {
  display: flex;
  align-items: center;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

.stat-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--font-tracking-wide);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-900);
}

.stat-value.income {
  color: var(--income-color);
}

.stat-value.expense {
  color: var(--expense-color);
}

/* Reusable account card + horizontal row (e.g. month dashboard) */
.account-cards-empty {
  margin-bottom: var(--space-6);
}

.account-cards-scroll {
  width: 100%;
  margin-bottom: var(--space-6);
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: var(--space-1);
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
}

.account-cards-row {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--space-4);
  list-style: none;
  margin: 0;
  padding: 0;
  width: max-content;
  max-width: none;
}

.account-cards-row > li {
  flex: 0 0 auto;
}

.account-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-1);
  width: 12rem;
  min-width: 11.5rem;
  max-width: 14rem;
  padding: var(--space-4) var(--space-5);
  text-align: left;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: linear-gradient(
    145deg,
    var(--color-neutral-0) 0%,
    var(--color-neutral-50) 100%
  );
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
  font: inherit;
  color: inherit;
}

.account-card:hover {
  border-color: var(--color-neutral-300);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.account-card:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}

.account-card--static {
  cursor: default;
}

.account-card--static:hover {
  border-color: var(--border);
  box-shadow: var(--shadow);
  transform: none;
}

/* Square box, circular clip — logo centered (object-fit contain) inside */
.account-card-logo-circle {
  --logo-inset: 0.25rem;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  padding: var(--logo-inset);
  box-sizing: border-box;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-neutral-100);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-1);
  aspect-ratio: 1 / 1;
}

.account-card-logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.account-card-balance {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-900);
  letter-spacing: var(--font-tracking-tight);
}

.account-card-nick {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: calc(var(--space-1) * -0.5);
  width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-card-owner {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Month page (dashboard): main column + right accounts panel (Study-style column) */
`;

export default APPGLOBAL;
