import styled, { css } from 'styled-components';

export const AppLayout = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const AppMain = styled.main`
  margin-left: var(--sidebar-width);
  flex: 1;
  min-height: 0;
  padding: 0;
  transition: margin-left var(--duration-normal) ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-surface);

  ${(p) =>
    p.$sidebarCollapsed &&
    css`
      margin-left: var(--sidebar-collapsed-width);
    `}

  ${(p) =>
    (p.$isBudgetPage || p.$isOperationsPage) &&
    css`
      overflow: hidden;
    `}

  @media (max-width: 768px) {
    margin-left: var(--sidebar-collapsed-width);
    padding: 0;
  }
`;

export const SidebarAside = styled.aside`
  width: ${(p) => (p.$collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)')};
  background: var(--color-sidebar-bg);
  color: var(--color-sidebar-fg);
  border-right: 1px solid var(--color-sidebar-border);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: var(--z-sidebar);
  transition: width var(--duration-normal) ease;

  @media (max-width: 768px) {
    width: var(--sidebar-collapsed-width);
  }
`;

export const SidebarHeader = styled.div`
  padding: var(--space-5) 12px 0;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: auto;

  h2 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-sidebar-fg-emphasis);
    letter-spacing: var(--font-tracking-tight);
    white-space: nowrap;
    overflow: hidden;
  }

  ${(p) =>
    p.$collapsed &&
    css`
      justify-content: center;
    `}
`;

export const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;

  .emoji-pixel {
    flex-shrink: 0;
  }

  h2 {
    min-width: 0;
  }
`;

export const SidebarHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

export const SidebarToggle = styled.button`
  background: none;
  border: none;
  color: var(--color-sidebar-fg);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: var(--color-sidebar-hover);
    color: var(--color-sidebar-fg-emphasis);
  }

  &.sidebar-toggle--active {
    color: var(--color-sidebar-accent);
  }
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-2);
  gap: var(--space-0-5);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const SidebarFooter = styled.footer`
  display: flex;
  flex-direction: column;
  gap: var(--space-0-5);
  flex-shrink: 0;
  margin-top: auto;
  padding: var(--space-2);
  border-top: none;
`;

export const SidebarFooterPrivacy = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-2-5) var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-sidebar-fg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

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

  ${(p) =>
    p.$active &&
    css`
      color: var(--color-sidebar-accent);

      &:hover {
        color: var(--color-sidebar-accent);
      }
    `}
`;

export const SidebarFooterPrivacyIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const SidebarFooterPrivacyLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`;

export const PageFooterRoot = styled.footer`
  flex-shrink: 0;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: var(--space-3) var(--content-padding-x);
  font-size: var(--font-size-sm);
  line-height: var(--font-leading-normal);
  color: var(--color-text-muted);

  @media (max-width: 768px) {
    padding-left: var(--space-5);
    padding-right: var(--space-5);
  }
`;

export const PageFooterInner = styled.div`
  width: 100%;
  max-width: ${(p) => (p.$contained ? 'var(--page-max-width)' : 'unset')};
  margin-inline: ${(p) => (p.$contained ? 'auto' : '0')};
`;

export const PageFooterDefault = styled.span`
  display: block;
`;
