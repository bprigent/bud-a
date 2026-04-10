---
name: migrate-to-styled
description: Migrate a page or component from plain CSS classes to styled-components
argument-hint: [file-path]
disable-model-invocation: true
---

# Migrate to Styled-Components

Convert a React component from plain CSS classes to styled-components.

## Steps

1. **Read the target file** at `$ARGUMENTS`

2. **Identify all CSS class usage**:
   - Find all `className="..."` and `className={...}` references
   - Look up the corresponding CSS rules in `frontend/src/App.css` or `frontend/src/index.css`

3. **Create styled components** for each element:
   - Replace `<div className="stat-card">` with `<StatCard>` using `styled.div`
   - Convert CSS rules to styled-component template literals
   - Handle conditional classes with props: `${props => props.$active ? '...' : '...'}`
   - Prefix transient props with `$`

4. **Place styled definitions** at the bottom of the component file, or in a separate `.styles.js` file if there are more than 10 styled elements

5. **Remove the old CSS**:
   - Delete the CSS class rules that were migrated
   - Remove any `import './Component.css'` lines
   - Keep CSS rules that are still used by other components

6. **Verify** the component still renders correctly by checking the structure matches

## Rules

- Don't change component logic or behavior — styling only
- Keep the same visual appearance
- Use the existing theme if `src/theme.js` exists, otherwise use raw values
- Preserve responsive behavior and media queries
- Preserve hover/focus/active states
