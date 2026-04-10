---
name: forms
description: Form handling patterns for this budget app. Use when creating or modifying forms in frontend/src/.
user-invocable: false
---

# Form Patterns

## Data Conventions

- **Currency amounts**: User types dollars (e.g., `25.00`), store as integer cents (`2500`). Convert on submit: `Math.round(parseFloat(value) * 100)`
- **Dates**: Use `<input type="date">`, store as ISO 8601 (`YYYY-MM-DD`)
- **IDs**: All records use UUID primary keys. Generate with `crypto.randomUUID()` on the backend
- **Foreign keys**: Dropdowns for member, account, category — always validate the ID exists before submit

## Form Structure

```jsx
import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;
```

## State Management

- Use controlled inputs with `useState` for simple forms
- Use `useActionState` (React 19) for forms with async submission
- Always track loading state to disable the submit button during API calls
- Show validation errors inline next to the relevant field

## Validation

- Validate on submit, not on every keystroke
- Required fields: check for empty/null before calling the API
- Amount fields: must be a positive number
- Date fields: must be a valid date string
- Show a clear error message and focus the first invalid field

## Dropdowns for Reference Data

Load categories, members, and accounts from the API. Render as `<select>`:

```jsx
<FormGroup>
  <Label htmlFor="category">Category</Label>
  <Select id="category" name="category_id" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
    <option value="">Select a category</option>
    {categories.map(c => (
      <option key={c.id} value={c.id}>{c.name}</option>
    ))}
  </Select>
</FormGroup>
```

## After Submission

- Clear the form or navigate back to the list page
- Show a brief success message
- The `useData` hook handles auto-refreshing lists via WebSocket
