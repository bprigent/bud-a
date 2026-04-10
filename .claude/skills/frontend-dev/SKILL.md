---
name: frontend-dev
description: Guidelines for writing frontend React code. Use when creating or modifying components in frontend/src/.
user-invocable: false
---

# Frontend Development

## Reuse-first workflow

1. **Look before you build** — Search `frontend/src/components/` and `frontend/src/constants/` for an existing component or shared constant.
2. **Prefer composition** — Combine small primitives (e.g. `PageHeader` + `SectionCard` + `AsyncContent`) instead of new monolithic widgets.
3. **Add primitives when** the same UI pattern exists twice or is about to (filters, sortable headers, row menus, stat rows, form rows).
4. **Update this skill** when you add a new reusable component: append a one-line entry to **Shared component inventory** below.

Cursor / Claude **rules** stay high-level (security, data); **this skill** is the place for UI reuse and file-level conventions.

## Shared component inventory (living list)

Check these before duplicating markup:

| Area | Components |
|------|----------------|
| Layout | `PageHeader`, `PageSubHeader`, `PageMain`, `SectionHeader`, `SectionCard`, `Tabs`, `Typography` (`H1`–`H4`, `PLarge`, `PMedium`, `PSmall`, `PLegal`) |
| Overlays | `SidePanel`, `Modal` |
| Forms | `FormField`, `FormRow`, `AmountInput`, `Select`, `Button`, `ButtonGroup` |
| Filters | `FilterBar`, `FilterField` |
| Data / tables | `SortableTh`, `TypeBadge`, `CategoryAmountTable`, `RowActionsMenu`, `StatCard`, `SummaryStat`, `PieChart`, `BudgetProgressBar` |
| Async UX | `AsyncContent`, `EmptyState` |
| Constants | `frontend/src/constants/operations.js` (`TYPE_FILTER_OPTIONS`, `TYPE_BADGES`) — extend with new domain constants as needed |

## Reusable components (general rule)

Extract whenever a UI pattern appears (or will appear) in **more than one place**. Store files in `frontend/src/components/`.

**Common candidates:** form controls, tables and table chrome, stat tiles, section headers, filters, loading/error/empty states, row action menus, dialogs/side panels.

## Component guidelines

- One component per file; filename matches the default export (e.g. `AmountInput.jsx`).
- Pass data and callbacks via props; avoid hardcoding copy or IDs.
- Keep components presentation-focused; **pages** fetch data and wire routes; pass results down.
- Use `children` when the shell is stable but inner content varies (`SectionCard`, `SidePanel`).
- Sensible defaults for optional props.

## When NOT to extract a component

- The pattern exists in only one place with no second use case in sight.
- Extraction would require an unwieldy number of props (often a sign the split is wrong).
- The shared part is trivial (a single unstyled wrapper).

## Styling

This project uses **design tokens** in `frontend/src/tokens.css` (imported from `main.jsx` before other styles), then **shared CSS classes** in `frontend/src/App.css` (and `index.css`).

- **Tokens** define colors (`--color-*`, legacy `--text`, `--primary`, …), typography (`--font-*`), spacing (`--space-*`), radii (`--radius-*`), shadows (`--shadow-*`), and layout (`--sidebar-width`, `--page-max-width`). New UI should use `var(--token)` or existing classes — not raw hex in `App.css`.
- Prefer existing classes: `page`, `page-header`, `card`, `section-header`, `form-group`, `form-row`, `form-actions`, `btn`, `filter-bar`, `stat-card`, `empty`, `error`, `loading`, and utilities like `u-text-right`, `u-mb-4`, `u-muted`, etc.
- Add new global rules in `App.css` only when the pattern is reused or clearly will be; keep selectors scoped (e.g. under a page-specific class) when something is truly one-off.
- **Inline `style={...}`** — avoid except for small, dynamic values (e.g. chart widths); prefer token-backed utility classes.

## Project conventions

- ES modules, 2-space indentation, async/await
- Format currency with `formatCurrency()` from `src/utils/format.js`
- All data fetching goes through `src/api.js`
- Use the `useData` hook for data that should auto-refresh on CSV changes
- Loading / error / empty: prefer `AsyncContent` + `EmptyState` (or the same UX pattern) for data-dependent sections
