import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './components/AppSidebar';
import PrivacyContext from './contexts/PrivacyContext';
import { AppLayout, AppMain } from './components/shell/AppShell.styled';
import { AppGlobalStyles } from './styles/AppGlobalStyles.jsx';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const { pathname } = useLocation();
  const isBudgetPage = pathname === '/budget';
  const isOperationsPage = pathname === '/operations';
  return (
    <PrivacyContext.Provider value={privacyMode}>
      <AppGlobalStyles />
      <AppLayout>
        <AppSidebar
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          privacyMode={privacyMode}
          onTogglePrivacy={() => setPrivacyMode((p) => !p)}
        />
        <AppMain
          className="main-content"
          $sidebarCollapsed={collapsed}
          $isBudgetPage={isBudgetPage}
          $isOperationsPage={isOperationsPage}
        >
          <Outlet />
        </AppMain>
      </AppLayout>
    </PrivacyContext.Provider>
  );
}
