---
name: recharts
description: Use Recharts for charts in frontend/ — pie, bar, line, tooltips, responsive layout. Use when adding or changing charts, dashboards, or visualizations.
user-invocable: false
---

# Recharts (this project)

## Why Recharts

- **Open source**: MIT license ([recharts.org](https://recharts.org), [GitHub](https://github.com/recharts/recharts))
- **React-native API**: Composable JSX (`<PieChart>`, `<Bar>`, `<Line>`), works with React 19 and Vite
- **SVG-based**: Crisp at any size; good default styling and theming hooks
- **Alternatives considered**: Chart.js + react-chartjs-2 (canvas, very popular), Nivo (heavier bundle), Visx (lower-level D3 primitives). Recharts balances ease of use and dashboard fit for this app.

**Installed dependency**: `recharts` in `frontend/package.json` (see exact version there).

## Install / upgrade (if needed)

```bash
cd frontend && npm install recharts
```

## Core patterns

### Always wrap charts in `ResponsiveContainer`

Charts need a sized parent. Use width `100%` and an explicit `height` (px).

```jsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

<div style={{ width: '100%', height: 320 }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>
```

### Data shape

Recharts expects an **array of objects**. Each series uses a `dataKey` string that matches object keys.

```js
const data = [
  { name: 'Food', amount: 45000 }, // cents
  { name: 'Transport', amount: 12000 },
];
```

### This app’s money rules

- Amounts in CSV/API are often **integer cents**. For axis labels and tooltips, use `formatCurrency` from `frontend/src/utils/format.js` inside a custom `tickFormatter` or `<Tooltip content={...} />`.
- Do not log raw financial payloads in chart code.

### Pie / donut

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

<ResponsiveContainer width="100%" height={280}>
  <PieChart>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {data.map((_, i) => (
        <Cell key={i} fill={COLORS[i % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

### Line / area (trends over time)

Use `dataKey` for the date or period label on `XAxis`, and amount on `Line` / `Area`.

### Styling

- Prefer **CSS variables** already in `App.css` (e.g. `var(--primary)`, `var(--text)`) for fills and strokes where possible so charts match the rest of the UI.
- Recharts components accept `className` on many elements; use `App.css` or scoped classes for fine control.

## Existing code

- `frontend/src/components/PieChart.jsx` is a **custom SVG** pie used on the Budget page. New work can use **Recharts** instead when you need tooltips, animation, or less manual geometry.
- Do not remove the custom component unless a page is migrated and tested.

## References

- Official docs & examples: [recharts.org](https://recharts.org)
- Release notes / breaking changes: see the installed major version in `package.json` and the [Recharts changelog](https://github.com/recharts/recharts/releases) before upgrading major versions.
