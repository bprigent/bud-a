---
name: react19-patterns
description: React 19 patterns and APIs. Use when writing or modifying React components in frontend/src/ to leverage modern React features.
user-invocable: false
---

# React 19 Patterns

This project uses React 19. Prefer these modern patterns over older alternatives.

## Ref as Prop

Pass refs directly as props — no `forwardRef` needed.

```jsx
// Good (React 19)
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// Avoid (old pattern)
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

## use() Hook

Use `use()` to read context — works in conditionals and loops unlike `useContext`.

```jsx
import { use } from 'react';

function Component() {
  const theme = use(ThemeContext);
  if (condition) {
    const user = use(UserContext);
  }
}
```

## useActionState for Forms

Use `useActionState` for form submissions with built-in pending state.

```jsx
import { useActionState } from 'react';

function AddForm() {
  const [state, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const result = await api.create(Object.fromEntries(formData));
      return result;
    },
    null
  );

  return (
    <form action={submitAction}>
      <input name="label" />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

## useOptimistic

Use `useOptimistic` for instant UI feedback before server confirmation.

```jsx
import { useOptimistic } from 'react';

function ExpenseList({ expenses }) {
  const [optimisticExpenses, addOptimistic] = useOptimistic(
    expenses,
    (current, newExpense) => [...current, newExpense]
  );
}
```

## Document Metadata

Render `<title>` and `<meta>` directly in components — React 19 hoists them to `<head>`.

```jsx
function Dashboard() {
  return (
    <>
      <title>Dashboard — Budget App</title>
      {/* page content */}
    </>
  );
}
```

## What NOT to Use

- No server components — this is a client-side Vite app
- No `useFormStatus` — use `useActionState` which provides `isPending` directly
- No `React.lazy` for code splitting unless explicitly needed — Vite handles bundling
