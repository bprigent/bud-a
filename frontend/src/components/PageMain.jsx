import { PageMainRoot } from './PageChrome.styled';

/**
 * Scrollable (or fill) main column below `PageHeader` / `PageSubHeader`.
 * No padding on this shell — add inset on inner layouts or sections as needed.
 * Use `fill` on pages that need an inner scroll region (Operations table, Budget dashboard).
 */
export default function PageMain({ children, className = '', fill = false }) {
  return (
    <PageMainRoot
      className={`page-main${fill ? ' page-main--fill' : ''} ${className}`.trim()}
      $fill={fill}
    >
      {children}
    </PageMainRoot>
  );
}
