import styled, { css } from 'styled-components';
import PageSubHeader from '../components/PageSubHeader';

/** Merges with global `.page` / `.page--full-width` from `styles/global/appGlobal01-*.css`. */
export const DesignSystemRoot = styled.div``;

export const DsPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);

`;

export const DsLayerIntro = styled.p`
  margin: 0 0 var(--space-2);
  max-width: 42rem;
  font-size: var(--font-size-sm);
  line-height: var(--font-leading-normal);
  color: var(--color-text-muted);
`;

export const DsLayerTabsWrap = styled(PageSubHeader)`
  & .segmented-tabs {
    margin-bottom: 0;
  }
`;

export const DsSidebarPreview = styled.div`
  display: flex;
  max-width: 100%;
`;

/** In-document sidebar preview (not fixed) — includes chrome so `.sidebar` global rules are not required. */
export const DsSidebarPreviewAside = styled.aside`
  width: ${(p) => (p.$previewCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)')};
  background: var(--color-sidebar-bg);
  color: var(--color-sidebar-fg);
  border-right: 1px solid var(--color-sidebar-border);
  display: flex;
  flex-direction: column;
  position: relative;
  top: auto;
  left: auto;
  bottom: auto;
  z-index: auto;
  flex-shrink: 0;
  min-height: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);

`;

export const DsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => (p.$gap ? `var(--space-${p.$gap})` : 'var(--space-3)')};
  align-items: flex-start;

  ${(p) =>
    p.$alignCenter &&
    css`
      align-items: center;
    `}
`;

export const DsButtonMatrixWrap = styled.div`
  overflow-x: auto;
  margin-bottom: var(--space-4);
  -webkit-overflow-scrolling: touch;
`;

export const DsButtonMatrixTable = styled.table`
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-xs);

  caption {
    caption-side: top;
    text-align: left;
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    padding: 0 0 var(--space-2);
  }

  th,
  td {
    padding: var(--space-2) var(--space-2-5);
    text-align: center;
    vertical-align: middle;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    border-radius: 0;
  }

  thead th {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--font-tracking-wide);
    font-size: var(--font-size-2xs);
  }

  th[scope='row'] {
    text-align: left;
    text-transform: capitalize;
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;
    color: var(--color-text-primary);
  }
`;

export const DsButtonMatrixCornerTh = styled.th`
  background: var(--color-surface-muted);
  border-right-color: var(--color-border-strong);
`;

export const DsTypeScale = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

export const DsTypeRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
`;

export const DsToken = styled.code`
  flex-shrink: 0;
  width: ${(p) => (p.$inline ? 'auto' : '200px')};
  ${(p) => p.$center && 'text-align: center;'}
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
`;

export const DsTypeWeights = styled.div`
  display: flex;
  gap: var(--space-6);
  margin-top: var(--space-4);
  font-size: var(--font-size-md);
`;

export const DsSwatches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
`;

export const DsSwatch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
`;

export const DsSwatchColor = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: ${(p) => p.$bg || 'transparent'};
`;

export const DsSwatchLabel = styled.code`
  font-size: var(--font-size-2xs);
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
`;

export const DsRadiusGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
  margin-top: var(--space-2);
`;

export const DsRadiusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
`;

export const DsRadiusSample = styled.div`
  width: ${(p) => (p.$full ? '3.5rem' : '4rem')};
  height: ${(p) => (p.$full ? '3.5rem' : '4rem')};
  background: var(--color-neutral-200);
  border: 1px solid var(--color-border-strong);
  border-radius: ${(p) => (p.$radius ? `var(${p.$radius})` : '0')};
`;

export const DsRadiusToken = styled.code`
  font-size: var(--font-size-2xs);
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
  max-width: 11rem;
  word-break: break-all;
`;

export const DsRadiusHint = styled.span`
  font-size: var(--font-size-2xs);
  color: var(--color-text-muted);
  opacity: 0.85;
`;

export const DsMutedP = styled.p`
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: ${(p) => `var(--space-${p.$mb ?? 4})`};
`;

export const DsTypeSample = styled.span`
  font-size: var(${(p) => p.$token});
`;

export const DsWeightSample = styled.span`
  font-weight: var(${(p) => p.$token});
`;

export const DsFormStack = styled.div.attrs({ className: 'form-control-stack' })`
  max-width: 20rem;
`;

export const DsTitleAddon = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
`;

export const DsModalBody = styled.div`
  padding: var(--space-6);
`;

export const DsModalFooter = styled.div`
  margin-top: var(--space-4);
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
`;

export const DsIconSizeDemo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
`;

export const DsFormPanel = styled.div.attrs({ className: 'form-control-stack' })`
  max-width: 20rem;
  padding: var(--space-4);
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

export const DsSidePanelMuted = styled.p`
  color: var(--color-text-muted);
`;

export const DsSelectGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
`;

export const DsStatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-2);
`;

export const DsProgressStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

export const DsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: var(--font-size-sm);

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    border-radius: 0;
  }

  th {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: var(--font-tracking-wide);
  }

  thead th + th {
    border-left: none;
  }
`;

export const DsEmojiPixelMatrixWrap = styled.div`
  overflow-x: auto;
  margin: 0 calc(-1 * var(--space-2));
  padding: 0 var(--space-2);
`;

export const DsEmojiPixelMatrixTable = styled.table`
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);

  caption {
    caption-side: top;
    text-align: left;
    padding-bottom: var(--space-3);
    color: var(--color-text-muted);
  }

  th,
  td {
    border: 1px solid var(--color-border);
    padding: var(--space-2) var(--space-2);
    text-align: center;
    vertical-align: middle;
  }

  thead th {
    background: var(--color-neutral-50);
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;
  }

  th[scope='row'] {
    text-align: left;
    background: var(--color-neutral-50);
    white-space: nowrap;
  }
`;

export const DsEmojiPixelMatrixCornerTh = styled.th`
  min-width: 7rem;
`;

export const DsEmojiPixelMatrixGridN = styled.span`
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

export const DsEmojiPixelMatrixMeta = styled.span`
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-muted);
  margin-top: 0.125rem;
`;

export const DsEmojiPixelMatrixCell = styled.td`
  background: ${(p) =>
    p.$isDefault ? 'var(--color-neutral-100)' : 'var(--color-surface)'};
`;

export const DsEmojiPixelMatrixFit = styled.div`
  position: relative;
  overflow: hidden;
  margin-inline: auto;
  width: ${(p) => (p.$boxRem ? `${p.$boxRem}rem` : 'auto')};
  height: ${(p) => (p.$boxRem ? `${p.$boxRem}rem` : 'auto')};
`;

export const DsEmojiPixelMatrixFitInner = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(${(p) => p.$scale ?? 1});
`;
