import styled, { css } from 'styled-components';

export const PageMainRoot = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  -webkit-overflow-scrolling: touch;

  ${(p) =>
    p.$fill &&
    css`
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `}
`;

export const PageHeaderRoot = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--space-3);
  min-width: 0;
  box-sizing: border-box;
  min-height: 80px;
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  overflow-x: auto;
  overflow-y: hidden;

  ${(p) =>
    p.$withSubtitle &&
    css`
      height: auto;
      align-items: center;
      overflow-y: visible;
    `}

  ${(p) =>
    p.$withSubHeader &&
    css`
      padding-bottom: 0;
      border-bottom: none;
    `}
`;

export const PageHeaderLead = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-1);

  ${(p) =>
    p.$withSubtitle &&
    css`
      justify-content: center;
    `}
`;

export const PageHeaderTitle = styled.h1`
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-leading-tight);
  color: var(--color-neutral-900);
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PageHeaderSubtitle = styled.p`
  margin: 0;
  max-width: 42rem;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--font-leading-normal);
  color: var(--color-text-muted);
`;

export const PageHeaderActions = styled.div`
  flex-shrink: 0;
`;

export const PageSubHeaderSection = styled.section`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  margin-bottom: 0;
  padding-inline: var(--space-4);
  padding-top: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);

  & .segmented-tabs,
  & .filter-bar {
    margin-bottom: 0;
  }

  ${(p) =>
    p.$split &&
    css`
      justify-content: space-between;
    `}
`;

export const PageSubHeaderPrimary = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  flex: 1 1 auto;
  min-width: 0;
`;

export const PageSubHeaderTrailing = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1-5);
  flex-shrink: 0;
`;

/** Optional full-width row inside a non-split PageSubHeader */
export const PageSubHeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  width: 100%;
  min-width: 0;
`;
