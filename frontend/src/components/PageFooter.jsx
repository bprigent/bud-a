/**
 * App-wide footer below routed page content. Render from the shell (e.g. `App.jsx`), not inside `.page`,
 * so it stays fixed at the bottom of the main column while `.page-main` scrolls.
 */
import {
  PageFooterDefault,
  PageFooterInner,
  PageFooterRoot,
} from './shell/AppShell.styled';

export default function PageFooter({ children = null, contained = false }) {
  return (
    <PageFooterRoot
      className={['page-footer', contained ? 'page-footer--contained' : '']
        .filter(Boolean)
        .join(' ')}
      role="contentinfo"
    >
      <PageFooterInner className="page-footer__inner" $contained={contained}>
        {children ?? (
          <PageFooterDefault className="page-footer__default">
            Bud-A · Local household budgeting
          </PageFooterDefault>
        )}
      </PageFooterInner>
    </PageFooterRoot>
  );
}
