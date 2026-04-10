import { useState, useCallback } from 'react';

const STORAGE_KEY = 'dashboard_widgets';
const OLD_PLAN_KEY = 'dashboard_savings_plan_id';
const OLD_NAME_KEY = 'dashboard_savings_card_name';

function migrateFromOldKeys() {
  const planId = localStorage.getItem(OLD_PLAN_KEY);
  if (!planId) return null;
  const name = localStorage.getItem(OLD_NAME_KEY) || 'Savings';
  localStorage.removeItem(OLD_PLAN_KEY);
  localStorage.removeItem(OLD_NAME_KEY);
  return [{
    id: crypto.randomUUID(),
    name,
    source: 'budget',
    planId,
    column: 1,
    opsFilters: { type: '', category_id: '', account_id: '', member_id: '' },
  }];
}

const DEFAULT_WIDGETS = [
  { id: 'default-revenue',          name: 'Revenue',          source: 'revenue',     planId: '', column: 1, opsFilters: { type: '', category_id: '', account_id: '', member_id: '' } },
  { id: 'default-monthly-spending', name: 'Monthly spending',  source: 'budget',      planId: '', column: 2, opsFilters: { type: '', category_id: '', account_id: '', member_id: '' } },
  { id: 'default-non-budget',       name: 'Non-budget',        source: 'non_budget',  planId: '', column: 3, opsFilters: { type: '', category_id: '', account_id: '', member_id: '' } },
];

function ensureDefaults(widgets) {
  // Backfill missing column (widgets saved before column was added)
  let result = widgets.map((w) => ('column' in w ? w : { ...w, column: 1 }));

  const hasSource = (src) => result.some((w) => w.source === src);

  if (!hasSource('revenue'))    result = [DEFAULT_WIDGETS[0], ...result];
  if (!hasSource('budget'))     result = [...result, DEFAULT_WIDGETS[1]];
  if (!hasSource('non_budget')) result = [...result, DEFAULT_WIDGETS[2]];

  return result;
}

function loadWidgets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return ensureDefaults(JSON.parse(raw));
  } catch { /* ignore parse errors */ }
  const migrated = migrateFromOldKeys();
  return migrated ? ensureDefaults(migrated) : [...DEFAULT_WIDGETS];
}

function persist(widgets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

export function useDashboardWidgets() {
  const [widgets, setWidgets] = useState(() => loadWidgets());

  const addWidget = useCallback((widget) => {
    setWidgets((prev) => {
      const next = [...prev, widget];
      persist(next);
      return next;
    });
  }, []);

  const updateWidget = useCallback((id, updates) => {
    setWidgets((prev) => {
      const next = prev.map((w) => (w.id === id ? { ...w, ...updates } : w));
      persist(next);
      return next;
    });
  }, []);

  const removeWidget = useCallback((id) => {
    setWidgets((prev) => {
      const next = prev.filter((w) => w.id !== id);
      persist(next);
      return next;
    });
  }, []);

  /** Replace the full widget list (e.g. cancel layout edit). */
  const replaceWidgets = useCallback((next) => {
    setWidgets(() => {
      persist(next);
      return next;
    });
  }, []);

  return { widgets, addWidget, updateWidget, removeWidget, replaceWidgets };
}
