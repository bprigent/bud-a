---
paths:
  - "frontend/**"
---

# Frontend Rules

- Use ES modules (import/export), never CommonJS
- 2-space indentation
- Use async/await, not callbacks or raw promises
- Format currency amounts with proper locale formatting (e.g., $1,234.56)
- Always handle loading and error states in UI components
- No financial data in localStorage or client-side storage
- Always use styled-components for styling — no plain CSS files, inline styles, or CSS modules
