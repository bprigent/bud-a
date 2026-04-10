import { useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBudgetPlans, getMonthlyReport, getMembers, getCategories, getAccounts } from '../api';
import { useData } from '../hooks/useData';
import { useDashboardWidgets } from '../hooks/useDashboardWidgets';
import { currentMonth, formatMonthYear } from '../utils/format';
import { buildOperationsUrl } from '../utils/operationsUrl';
import { FiPlus, FiEdit } from 'react-icons/fi';
import Button from '../components/Button';
import AsyncContent from '../components/AsyncContent';
import EmptyState from '../components/EmptyState';
import PageMain from '../components/PageMain';
import PageHeader from '../components/PageHeader';
import MonthAccountsSidePanel from '../components/MonthAccountsSidePanel';
import WidgetCard from '../components/dashboard/WidgetCard';
import WidgetConfigPanel from '../components/dashboard/WidgetConfigPanel';
import { PageRoot } from './PageRoot.styled';


function AddWidgetButton({ onClick }) {
  return (
    <Button
      variant="secondary"
      size="md"
      type="button"
      onClick={onClick}
      className="dashboard-add-widget-btn"
    >
      <FiPlus size={16} />
      Add widget
    </Button>
  );
}

function WidgetColumn({ col, widgets, month, allPlans, isLayoutEditing, activeEditWidgetId, onConfigureWidget, onAdd }) {
  const colWidgets = widgets.filter((w) => (w.column ?? 1) === col);
  return (
    <div className="month-column-stack">
      {isLayoutEditing && colWidgets.length === 0 && <AddWidgetButton onClick={() => onAdd(col)} />}
      {colWidgets.map((widget, i) => (
        <div key={widget.id}>
          {isLayoutEditing && i > 0 && <AddWidgetButton onClick={() => onAdd(col)} />}
          <WidgetCard
            widget={widget}
            month={month}
            allPlans={allPlans}
            isLayoutEditing={isLayoutEditing}
            onConfigure={() => onConfigureWidget(widget.id)}
          />
        </div>
      ))}
      {isLayoutEditing && colWidgets.length > 0 && <AddWidgetButton onClick={() => onAdd(col)} />}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const month = currentMonth();

  const { widgets, addWidget, updateWidget, removeWidget, replaceWidgets } = useDashboardWidgets();
  const [isLayoutEditing, setIsLayoutEditing] = useState(false);
  const [activeEditWidgetId, setActiveEditWidgetId] = useState(null);
  const activeWidget = widgets.find((w) => w.id === activeEditWidgetId) ?? null;

  /** Widgets JSON captured when entering layout edit — used for cancel + dirty detection. */
  const layoutEditSnapshotRef = useRef(null);
  const hasUnsavedLayoutChanges = useMemo(() => {
    if (!isLayoutEditing || layoutEditSnapshotRef.current == null) return false;
    return JSON.stringify(widgets) !== layoutEditSnapshotRef.current;
  }, [isLayoutEditing, widgets]);

  function beginLayoutEditing() {
    layoutEditSnapshotRef.current = JSON.stringify(widgets);
  }

  function exitLayoutEditing() {
    layoutEditSnapshotRef.current = null;
    setIsLayoutEditing(false);
    setActiveEditWidgetId(null);
  }

  const { data: allPlans } = useData(getBudgetPlans, 'budget_plans.csv');
  const { data: allCategories } = useData(getCategories, 'categories.csv');
  const { data: allAccounts } = useData(getAccounts, 'accounts.csv');
  const { data: members } = useData(getMembers, 'members.csv');

  const fetchReport = useCallback(() => getMonthlyReport(month), [month]);
  const { data: report, loading, error } = useData(fetchReport, ['operations.csv', 'budgets.csv', 'budget_plans.csv', 'accounts.csv']);

  const accountRows = report?.accounts ?? [];

  function handleAddWidget(col) {
    if (!isLayoutEditing) beginLayoutEditing();
    const newWidget = {
      id: crypto.randomUUID(),
      name: '',
      source: 'budget',
      planId: '',
      column: col,
      opsFilters: { type: '', category_id: '', account_id: '', member_id: '' },
    };
    addWidget(newWidget);
    setActiveEditWidgetId(newWidget.id);
    setIsLayoutEditing(true);
  }

  function handleConfigureWidget(widgetId) {
    setActiveEditWidgetId(widgetId);
  }

  return (
    <PageRoot className="page page--full-width">
      <PageHeader
        title={formatMonthYear(month)}
        subtitle="This month's income, budgets, savings, and spending at a glance."
      >
        {isLayoutEditing ? (
          <div className="dashboard-layout-edit-actions">
            {hasUnsavedLayoutChanges ? (
              <span className="side-panel-footer-unsaved dashboard-layout-edit-actions__unsaved" aria-live="polite">
                Unsaved changes
              </span>
            ) : null}
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={() => {
                if (layoutEditSnapshotRef.current != null) {
                  try {
                    replaceWidgets(JSON.parse(layoutEditSnapshotRef.current));
                  } catch {
                    /* ignore bad snapshot */
                  }
                }
                exitLayoutEditing();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" size="md" type="button" onClick={exitLayoutEditing}>
              Save
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="md"
            icon
            type="button"
            title="Edit widgets"
            aria-label="Edit widgets"
            onClick={() => {
              setActiveEditWidgetId(null);
              beginLayoutEditing();
              setIsLayoutEditing(true);
            }}
          >
            <FiEdit size={16} />
          </Button>
        )}
      </PageHeader>
      <PageMain fill>
        <div className="month-page-layout">
          <div className="month-page-layout__main">
            <AsyncContent loading={loading} error={error}>
              {!report ? (
                <EmptyState message="No data available." />
              ) : (
                <div className="month-page-columns">
                  {[1, 2, 3].map((col) => (
                    <WidgetColumn
                      key={col}
                      col={col}
                      widgets={widgets}
                      month={month}
                      allPlans={allPlans}
                      isLayoutEditing={isLayoutEditing}
                      activeEditWidgetId={activeEditWidgetId}
                      onConfigureWidget={handleConfigureWidget}
                      onAdd={handleAddWidget}
                    />
                  ))}
                </div>
              )}
            </AsyncContent>
          </div>
          <MonthAccountsSidePanel
            accounts={accountRows}
            members={members ?? []}
            onAccountClick={(row) => navigate(buildOperationsUrl({ account: row.account_id }))}
          />
        </div>
      </PageMain>

      <WidgetConfigPanel
        open={activeEditWidgetId !== null}
        onClose={() => setActiveEditWidgetId(null)}
        widget={activeWidget}
        allPlans={allPlans}
        categories={allCategories}
        accounts={allAccounts}
        members={members}
        onChange={(updated) => updateWidget(updated.id, updated)}
        onRemove={() => {
          if (activeWidget) removeWidget(activeWidget.id);
          setActiveEditWidgetId(null);
        }}
      />
    </PageRoot>
  );
}
