import { useState, useEffect, useRef } from 'react';
import { FiCalendar, FiList, FiSearch, FiPieChart, FiLayout, FiSettings, FiEye, FiEyeOff, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';
import EmojiPixel from './EmojiPixel';
import SidebarNavItem from './SidebarNavItem';
import { H2 } from './Typography';
import {
  SidebarAside,
  SidebarBrand,
  SidebarFooter,
  SidebarHeader,
  SidebarHeaderActions,
  SidebarNav,
  SidebarToggle,
} from './shell/AppShell.styled';

/** Default main app navigation — override via `items` prop for different routes or labels. */
export const APP_NAV_ITEMS = [
  {
    to: '/',
    label: 'This month',
    icon: <FiCalendar size={20} />,
  },
  {
    to: '/savings',
    label: 'Accounts',
    icon: <MdAccountBalance size={20} />,
  },
  {
    to: '/operations',
    label: 'Operations',
    icon: <FiList size={20} />,
  },
  {
    to: '/study',
    label: 'Study',
    icon: <FiSearch size={20} />,
  },
  {
    to: '/budget',
    label: 'Budgets',
    icon: <FiPieChart size={20} />,
  },
];

/** Design System lives in the sidebar footer alongside Settings. */
export const APP_SIDEBAR_DESIGN_SYSTEM_ITEM = {
  to: '/design-system',
  label: 'Design System',
  icon: <FiLayout size={20} />,
};

/** Settings lives in the sidebar footer (with privacy), not in the main nav list. */
export const APP_SIDEBAR_SETTINGS_ITEM = {
  to: '/settings',
  label: 'Settings',
  icon: <FiSettings size={20} />,
};

/**
 * Collapsible app sidebar: main nav (scrollable) + footer (Settings + privacy toggle).
 */
export default function AppSidebar({
  brandTitle = 'Bud-a',
  collapsed,
  onToggleCollapsed,
  privacyMode,
  onTogglePrivacy,
  items = APP_NAV_ITEMS,
  settingsItem = APP_SIDEBAR_SETTINGS_ITEM,
  designSystemItem = APP_SIDEBAR_DESIGN_SYSTEM_ITEM,
}) {
  const [dsUnlocked, setDsUnlocked] = useState(false);
  const bufferRef = useRef('');

  useEffect(() => {
    const secret = 'AAABBB';
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      bufferRef.current = (bufferRef.current + e.key.toUpperCase()).slice(-secret.length);
      if (bufferRef.current === secret) setDsUnlocked(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <SidebarAside className="sidebar" $collapsed={collapsed}>
      <SidebarHeader className="sidebar-header" $collapsed={collapsed}>
        {!collapsed && (
          <SidebarBrand className="sidebar-brand">
            <EmojiPixel emoji="🧘" size="2" pixelsAcross={20} title={brandTitle} aria-hidden />
            <H2 as="h2" variant="overline">{brandTitle}</H2>
          </SidebarBrand>
        )}
        <SidebarHeaderActions className="sidebar-header-actions">
          {!collapsed ? <SidebarToggle
            type="button"
            className="sidebar-toggle"
            onClick={onTogglePrivacy}
            title={privacyMode ? 'Show amounts' : 'Hide amounts'}
            aria-pressed={privacyMode}
            aria-label={privacyMode ? 'Show amounts' : 'Hide amounts'}
          >
            {privacyMode ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </SidebarToggle> : null}
          <SidebarToggle
            type="button"
            className="sidebar-toggle"
            onClick={onToggleCollapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </SidebarToggle>
        </SidebarHeaderActions>
      </SidebarHeader>
      <SidebarNav className="sidebar-nav" aria-label="Main">
        {items.map((item) => (
          <SidebarNavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
            end={item.end}
          />
        ))}
      </SidebarNav>
      <SidebarFooter className="sidebar-footer">
        <SidebarNavItem
          to={settingsItem.to}
          label={settingsItem.label}
          icon={settingsItem.icon}
          collapsed={collapsed}
        />
        {dsUnlocked ? (
          <SidebarNavItem
            to={designSystemItem.to}
            label={designSystemItem.label}
            icon={designSystemItem.icon}
            collapsed={collapsed}
          />
        ) : null}
      </SidebarFooter>
    </SidebarAside>
  );
}
