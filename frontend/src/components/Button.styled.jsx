import styled, { css } from 'styled-components';

const variantStyles = {
  primary: css`
    background: var(--primary);
    color: var(--color-neutral-0);
    border-color: var(--primary);
    font-weight: var(--font-weight-semibold);
    box-shadow: var(--shadow-tab-indicator);

    &:hover:not(:disabled) {
      background: var(--primary-hover);
      border-color: var(--primary-hover);
      color: var(--color-neutral-0);
    }
  `,
  secondary: css`
    background: var(--color-neutral-100);
    color: var(--color-text-primary);
    border-color: var(--color-border);
    box-shadow: var(--shadow-tab-indicator);

    &:hover:not(:disabled) {
      background: var(--color-neutral-200);
      border-color: var(--color-border-strong);
      color: var(--color-text-primary);
    }
  `,
  danger: css`
    background: var(--danger);
    color: var(--color-neutral-0);
    border-color: var(--danger);
    box-shadow: var(--shadow-tab-indicator);

    &:hover:not(:disabled) {
      background: var(--danger-hover);
      border-color: var(--danger-hover);
    }
  `,
  ghost: css`
    background: transparent;
    border-color: transparent;
    color: var(--text);
    box-shadow: none;

    &:hover:not(:disabled) {
      background: var(--color-neutral-100);
      border-color: var(--border);
    }
  `,
  text: css`
    background: transparent;
    border-color: transparent;
    padding: var(--space-1-5) var(--space-2-5);
    color: var(--text-secondary);
    font-weight: var(--font-weight-medium);
    box-shadow: none;

    &:hover:not(:disabled) {
      color: var(--text);
      background: var(--color-black-alpha-04);
      border-color: transparent;
    }
  `,
};

const sizeStyles = {
  xs: css`
    padding: var(--space-0-5) var(--space-2);
    font-size: var(--font-size-2xs);
    border-radius: var(--radius-xs);
  `,
  sm: css`
    padding: var(--space-1) var(--space-2-5);
    font-size: var(--font-size-xs);
    border-radius: var(--radius-5);
  `,
  md: css``,
  lg: css`
    padding: var(--space-3) var(--space-6);
    font-size: var(--font-size-md);
    border-radius: var(--radius-lg);
  `,
  xl: css`
    padding: var(--space-3-5) var(--space-7);
    font-size: var(--font-size-lg);
    border-radius: var(--radius-xl);
  `,
};

const textSizePadding = {
  xs: css`
    padding: var(--space-px) var(--space-1-5);
  `,
  sm: css`
    padding: var(--space-1) var(--space-2);
  `,
  md: css``,
  lg: css`
    padding: var(--space-2-5) var(--space-4);
  `,
  xl: css`
    padding: var(--space-3) var(--space-5);
  `,
};

const iconMin = {
  xs: css`
    padding: var(--space-0-5);
    min-width: 24px;
    min-height: 24px;
  `,
  sm: css`
    padding: var(--space-1);
    min-width: 28px;
    min-height: 28px;
  `,
  md: css`
    padding: var(--space-1-5);
    min-width: 36px;
    min-height: 36px;
  `,
  lg: css`
    padding: var(--space-2-5);
    min-width: 44px;
    min-height: 44px;
  `,
  xl: css`
    padding: var(--space-3);
    min-width: 52px;
    min-height: 52px;
  `,
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--color-neutral-0);
  color: var(--text);
  cursor: pointer;
  text-decoration: none;
  box-shadow: var(--shadow-tab-track);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
  gap: var(--space-1-5);
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: var(--color-neutral-100);
    border-color: var(--color-neutral-300);
  }

  &:focus-visible {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${(p) => variantStyles[p.$variant] ?? variantStyles.secondary}
  ${(p) => sizeStyles[p.$size] ?? sizeStyles.md}
  ${(p) => p.$variant === 'text' && (textSizePadding[p.$size] ?? textSizePadding.md)}
  ${(p) =>
    p.$icon &&
    css`
      ${iconMin[p.$size] ?? iconMin.md};
    `}
  ${(p) =>
    p.$icon &&
    p.$variant === 'ghost' &&
    css`
      color: var(--color-neutral-600);

      &:hover:not(:disabled) {
        color: var(--color-text-primary);
      }
    `}
`;
