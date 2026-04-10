import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Operations from './pages/Operations.jsx';
import OperationAdd from './pages/OperationAdd.jsx';
import OperationEditRedirect from './pages/OperationEditRedirect.jsx';
import Budget from './pages/Budget.jsx';
import Study from './pages/Study.jsx';
import Settings from './pages/Settings.jsx';
import Savings from './pages/Savings.jsx';
import DesignSystem from './pages/DesignSystem.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="operations" element={<Operations />} />
          <Route path="operations/add" element={<OperationAdd />} />
          <Route path="operations/edit/:id" element={<OperationEditRedirect />} />
          <Route path="budget" element={<Budget />} />
          <Route path="savings" element={<Savings />} />
          <Route path="study" element={<Study />} />
          <Route path="settings" element={<Settings />} />
          <Route path="design-system" element={<DesignSystem />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
