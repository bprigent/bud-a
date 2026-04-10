import {
  PageSubHeaderPrimary,
  PageSubHeaderSection,
  PageSubHeaderTrailing,
} from './PageChrome.styled';

/**
 * Toolbar strip below `PageHeader` — tabs, filter bars, compact controls.
 * Pass `trailing` for end-aligned actions or filters; otherwise `children` fill the row.
 *
 * @param {import('react').ReactNode} [children]
 * @param {import('react').ReactNode} [trailing]
 * @param {string} [className]
 * @param {string} [ariaLabel='Page toolbar']
 */
export default function PageSubHeader({
  children,
  trailing = null,
  className = '',
  ariaLabel = 'Page toolbar',
}) {
  const split = trailing != null;

  return (
    <PageSubHeaderSection
      className={`page-sub-header${split ? ' page-sub-header--split' : ''} ${className}`.trim()}
      $split={split}
      aria-label={ariaLabel ?? undefined}
    >
      {split ? (
        <>
          <PageSubHeaderPrimary className="page-sub-header__primary">{children}</PageSubHeaderPrimary>
          <PageSubHeaderTrailing className="page-sub-header__trailing">{trailing}</PageSubHeaderTrailing>
        </>
      ) : (
        children
      )}
    </PageSubHeaderSection>
  );
}
