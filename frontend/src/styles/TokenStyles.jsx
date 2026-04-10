import { createGlobalStyle } from 'styled-components';

/**
 * Design tokens — single source of truth for color, typography, spacing, border radius, elevation.
 * Loaded before other app styles via AppGlobalStyles.
 */
const TokenStyles = createGlobalStyle`
:root {
  /* -------------------------------------------------------------------------
     Color primitives (neutral scale)
     ------------------------------------------------------------------------- */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-300: #d1d5db;
  --color-neutral-400: #9ca3af;
  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #222222;
  --color-neutral-900: #111111;

  /* Brand */
  --color-brand-500: #000000;
  --color-brand-600: #262626;
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;
  --color-success-500: #10b981;
  --color-warning-500: #f59e0b;

  /* Semantic aliases */
  --color-bg: var(--color-neutral-50);
  --color-surface: var(--color-neutral-0);
  --color-surface-muted: var(--color-neutral-50);
  --color-surface-hover: var(--color-neutral-100);
  --color-border: #e0e0e0;
  --color-border-strong: var(--color-neutral-300);
  --color-text-primary: #333333;
  --color-text-muted: #666666;
  --color-text-inverse: var(--color-neutral-0);

  /* Income / expense semantics */
  --color-finance-income: var(--color-success-500);
  --color-finance-expense: var(--color-danger-500);

  /* Sidebar — very light chrome */
  --color-sidebar-bg: var(--color-neutral-50);
  --color-sidebar-fg: var(--color-neutral-600);
  --color-sidebar-hover: var(--color-neutral-100);
  --color-sidebar-border: var(--color-border);
  --color-sidebar-active-bg: var(--color-neutral-100);
  --color-sidebar-accent: var(--color-neutral-900);
  --color-sidebar-fg-emphasis: var(--color-text-primary);

  /* Alpha overlays */
  --color-overlay-scrim: rgba(0, 0, 0, 0.45);
  --color-overlay-modal: rgba(0, 0, 0, 0.5);
  --color-black-alpha-04: rgba(0, 0, 0, 0.04);
  --color-black-alpha-10: rgba(0, 0, 0, 0.1);
  --color-black-alpha-15: rgba(0, 0, 0, 0.15);
  --color-black-alpha-20: rgba(0, 0, 0, 0.2);
  --color-brand-alpha-08: rgba(0, 0, 0, 0.08);
  --color-brand-alpha-10: rgba(0, 0, 0, 0.1);
  --color-brand-alpha-12: rgba(0, 0, 0, 0.12);
  --color-brand-alpha-30: rgba(0, 0, 0, 0.3);
  --color-brand-alpha-04: rgba(0, 0, 0, 0.04);

  /* Type badge backgrounds */
  --color-badge-expense-bg: #fef2f2;
  --color-badge-income-bg: #ecfdf5;
  --color-badge-both-bg: #f0f9ff;
  --color-danger-bg: #fef2f2;
  --color-danger-border: #fecaca;

  /* -------------------------------------------------------------------------
     Typography
     ------------------------------------------------------------------------- */
  --font-family-sans: 'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;

  --font-size-2xs: 0.6875rem; /* 11px */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.8125rem;  /* 13px */
  --font-size-base: 0.875rem; /* 14px */
  --font-size-md: 1rem;       /* 16px */
  --font-size-15: 0.9375rem;  /* 15px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.75rem;   /* 28px */
  --font-size-3xl: 1.5rem;    /* 24px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 600;

  --font-leading-none: 1;
  --font-leading-tight: 1.25;
  --font-leading-snug: 1.375;
  --font-leading-normal: 1.5;
  --font-leading-relaxed: 1.6;

  --font-tracking-tight: -0.3px;
  --font-tracking-wide: 0.5px;

  /* -------------------------------------------------------------------------
     Spacing (4px base)
     ------------------------------------------------------------------------- */
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem; /* 2px */
  --space-1: 0.25rem;    /* 4px */
  --space-1-5: 0.375rem; /* 6px */
  --space-2: 0.5rem;     /* 8px */
  --space-2-5: 0.625rem; /* 10px */
  --space-3: 0.75rem;    /* 12px */
  --space-3-5: 0.875rem;
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-7: 1.75rem;
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;

  /* -------------------------------------------------------------------------
     Layout / chrome
     ------------------------------------------------------------------------- */
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --page-max-width: 960px;
  /* Study filters + Month dashboard accounts column */
  --layout-side-panel-width: 16rem;
  --content-padding-x: var(--space-8);
  --content-padding-y: var(--space-8);

  /* -------------------------------------------------------------------------
     Border radius
     ------------------------------------------------------------------------- */
  --radius-none: 0;
  --radius-xs: 0.1875rem;   /* 3px */
  --radius-sm: 0.25rem;     /* 4px */
  --radius-5: 0.3125rem;    /* 5px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-full: 9999px;    /* pills, circles */

  /* -------------------------------------------------------------------------
     Elevation (shadows)
     ------------------------------------------------------------------------- */

  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.2);
  --shadow-xl: -8px 0 32px rgba(0, 0, 0, 0.15);
  --shadow-select: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-tooltip: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Segmented tabs / toggles: outer shell + inner "pill" (inset highlight + soft drop) */
  --shadow-tab-track: var(--shadow-xs);
  --shadow-tab-indicator:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    0 1px 2px rgba(0, 0, 0, 0.06);

  /* Single-row .select-trigger height matches .btn-group + .btn-group-sm (track pad + inner border + segment pad) */
  --control-compact-pad-y: calc(var(--space-1) + var(--space-px) + var(--space-1-5));
  /* Track inset for compact toggles / small tabs — +0.5px each side so outer height matches 40px .select-trigger (subpixel) */
  --control-compact-track-pad-y: calc(var(--space-1) + 0.5px);

  /* Focus ring */
  --focus-ring-color: var(--color-brand-alpha-10);
  --focus-ring-width: 3px;

  /* -------------------------------------------------------------------------
     Z-index scale
     ------------------------------------------------------------------------- */
  --z-dropdown: 50;
  --z-popover: 60;
  --z-sticky: 100;
  --z-sidebar: 100;
  --z-overlay: 200;

  /* -------------------------------------------------------------------------
     Motion
     ------------------------------------------------------------------------- */
  --duration-fast: 0.15s;
  --duration-normal: 0.2s;
  --ease-default: ease;

  /* -------------------------------------------------------------------------
     Legacy aliases (existing components — keep stable)
     ------------------------------------------------------------------------- */
  --bg: var(--color-bg);
  --card-bg: var(--color-surface);
  --text: var(--color-text-primary);
  --text-secondary: var(--color-text-muted);
  --border: var(--color-border);
  --primary: var(--color-brand-500);
  --primary-hover: var(--color-brand-600);
  --danger: var(--color-danger-500);
  --danger-hover: var(--color-danger-600);
  --success: var(--color-success-500);
  --warning: var(--color-warning-500);
  --income-color: var(--color-finance-income);
  --expense-color: var(--color-finance-expense);
  --radius: var(--radius-lg);
  --shadow: var(--shadow-sm);

  /* Sidebar legacy aliases (prefer --color-sidebar-* in new CSS) */
  --sidebar-bg: var(--color-sidebar-bg);
  --sidebar-text: var(--color-sidebar-fg);
  --sidebar-active: var(--color-sidebar-accent);
  --sidebar-hover: var(--color-sidebar-hover);
}
`;

export default TokenStyles;
