import {
  PageHeaderActions,
  PageHeaderLead,
  PageHeaderRoot,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from './PageChrome.styled';

export default function PageHeader({ title, subtitle = null, children, withSubHeader = false }) {
  const hasSubtitle = subtitle != null && subtitle !== '';

  return (
    <PageHeaderRoot
      className={[
        'page-header',
        hasSubtitle ? 'page-header--with-subtitle' : '',
        withSubHeader ? 'page-header--with-sub-header' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      $withSubtitle={hasSubtitle}
      $withSubHeader={withSubHeader}
    >
      <PageHeaderLead className="page-header__lead" $withSubtitle={hasSubtitle}>
        <PageHeaderTitle>{title}</PageHeaderTitle>
        {hasSubtitle ? (
          <PageHeaderSubtitle className="page-header__subtitle">{subtitle}</PageHeaderSubtitle>
        ) : null}
      </PageHeaderLead>
      {children ? (
        <PageHeaderActions className="header-actions">{children}</PageHeaderActions>
      ) : null}
    </PageHeaderRoot>
  );
}
