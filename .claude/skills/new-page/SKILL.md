---
name: new-page
description: Scaffold a new page with routing, styled-components, and data fetching wired up
argument-hint: [PageName]
disable-model-invocation: true
---

# New Page Scaffolder

Create a new page in the budget app frontend.

## Steps

1. **Read existing patterns** — look at `frontend/src/pages/Dashboard.jsx` and `frontend/src/App.jsx` to match the established style

2. **Create the page file** at `frontend/src/pages/$ARGUMENTS.jsx`:
   - Import `useState`, `useCallback` from React
   - Import `useData` from `../hooks/useData` if fetching data
   - Import `formatCurrency` from `../utils/format` if displaying amounts
   - Import `styled` from `styled-components`
   - Export a default function component named `$ARGUMENTS`
   - Include loading, error, and empty states
   - Use styled-components for all styling (no CSS classes)

3. **Add the route** in `frontend/src/main.jsx`:
   - Import the new page component
   - Add a `<Route>` inside the existing layout route
   - Use a kebab-case path (e.g., `MyPage` → `/my-page`)

4. **Add navigation** if appropriate:
   - Add an entry to `navItems` in `frontend/src/App.jsx`

5. **Add any needed API functions** in `frontend/src/api.js`

## Template Structure

```jsx
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useData } from '../hooks/useData';

const PageWrapper = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export default function PageName() {
  // data fetching with useData hook
  // loading/error/empty states
  // page content with styled-components
}
```
