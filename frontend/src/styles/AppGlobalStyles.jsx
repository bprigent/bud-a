import TokenStyles from './TokenStyles';
import BaseStyles from './BaseStyles';
import { TypographyStyles } from '../components/Typography';
import { BudgetProgressBarStyles } from '../components/BudgetProgressBar';
import AppGlobal01 from './global/appGlobal01-base-page-layout.jsx';
import AppGlobal02 from './global/appGlobal02-month-dashboard.jsx';
import AppGlobal03 from './global/appGlobal03-tables-forms-tabs-toolbar.jsx';
import AppGlobal04 from './global/appGlobal04-chrome-widgets-modals-part1.jsx';
import AppGlobal05 from './global/appGlobal05-modals-panels-responsive-start.jsx';
import AppGlobal06 from './global/appGlobal06-study-budget-settings-rest.jsx';

/**
 * App-wide global styles: tokens, base reset, then class-based chunks.
 * Render order matches cascade priority.
 */
export function AppGlobalStyles() {
  return (
    <>
      <TokenStyles />
      <BaseStyles />
      <TypographyStyles />
      <BudgetProgressBarStyles />
      <AppGlobal01 />
      <AppGlobal02 />
      <AppGlobal03 />
      <AppGlobal04 />
      <AppGlobal05 />
      <AppGlobal06 />
    </>
  );
}
