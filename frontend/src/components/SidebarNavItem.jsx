import { SidebarNavIcon, SidebarNavLabel, SidebarNavLink } from './SidebarNavItem.styled';

/**
 * One navigation row for the app sidebar: react-router link, icon, optional label when expanded.
 */
export default function SidebarNavItem({
  to,
  label,
  icon,
  collapsed,
  end: endProp,
}) {
  const end = endProp ?? to === '/';

  return (
    <SidebarNavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      title={collapsed ? label : undefined}
      $collapsed={collapsed}
    >
      <SidebarNavIcon className="nav-icon">{icon}</SidebarNavIcon>
      {!collapsed && <SidebarNavLabel className="nav-label">{label}</SidebarNavLabel>}
    </SidebarNavLink>
  );
}
