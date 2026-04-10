import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const SidebarNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2-5) var(--space-4);
  color: var(--color-sidebar-fg);
  text-decoration: none;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  box-shadow: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s,
    font-weight 0.15s ease;
  white-space: nowrap;
  overflow: hidden;

  ${(p) =>
    p.$collapsed &&
    css`
      justify-content: center;
      padding: var(--space-2-5);
    `}

  &:hover {
    background: var(--color-sidebar-hover);
    color: var(--color-sidebar-fg-emphasis);
  }

  &.active {
    background: var(--color-sidebar-active-bg);
    border-color: var(--color-border);
    box-shadow: var(--shadow-tab-indicator);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-bold);
  }
`;

export const SidebarNavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const SidebarNavLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;
