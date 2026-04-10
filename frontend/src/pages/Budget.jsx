import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  getBudgets,
  getBudgetsAsOf,
  getCategories,
  getBudgetPlans,
  createBudget,
  createBudgetPlan,
  updateBudgetPlan,
  updateBudget,
  deleteBudget,
} from '../api';
import { useData } from '../hooks/useData';
import { formatCurrency, centsFromDollars, dollarsFromCents, todayStr, formatDate } from '../utils/format';
import Redacted from '../components/Redacted';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import PageSubHeader from '../components/PageSubHeader';
import SidePanel from '../components/SidePanel';
import SectionCard from '../components/SectionCard';
import MiniKpiCard from '../components/MiniKpiCard';
import PieChart from '../components/PieChart';
import BudgetCategoryCard from '../components/BudgetCategoryCard';
import { PIE_CHART_COLORS } from '../utils/pieChartColors';
import Button from '../components/Button';
import Select from '../components/Select';
import Tabs from '../components/Tabs';
import { PageRoot } from './PageRoot.styled';
import { DEFAULT_CURRENCY, CURRENCIES } from '../config';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { categorySelectLabel, categorySelectContent } from '../utils/categoryLabels';

const emptyForm = () => ({
  category_id: '',
  amount: '',
  currency: DEFAULT_CURRENCY,
  period: 'monthly',
  start_date: todayStr(),
  end_date: '',
});

export default function Budget() {
  const asOfDate = todayStr();
  const [activePlanId, setActivePlanId] = useState(null);
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState(() => new Set());

  const { data: plans, loading: plansLoading, error: plansError, refetch: refetchPlans } = useData(
    getBudgetPlans,
    'budget_plans.csv',
  );

  useEffect(() => {
    if (!plans?.length) return;
    setActivePlanId((prev) => {
      if (prev && plans.some((p) => p.id === prev)) return prev;
      return plans[0].id;
    });
  }, [plans]);

  useEffect(() => {
    setHiddenCategoryIds(new Set());
  }, [activePlanId]);

  const fetchBudgets = useCallback(() => {
    if (!activePlanId) return Promise.resolve([]);
    return getBudgetsAsOf(asOfDate, activePlanId);
  }, [asOfDate, activePlanId]);
  const { data: budgets, loading, error, refetch } = useData(fetchBudgets, [
    'budgets.csv',
    'budget_plans.csv',
  ]);
  const fetchAllForPlan = useCallback(() => {
    if (!activePlanId) return Promise.resolve([]);
    return getBudgets({ budget_plan_id: activePlanId });
  }, [activePlanId]);
  const { data: allBudgets, refetch: refetchAll } = useData(fetchAllForPlan, [
    'budgets.csv',
    'budget_plans.csv',
  ]);
  const { data: categories } = useData(getCategories, 'categories.csv');

  const { catMap, catEmoji } = useMemo(() => {
    const nameMap = {};
    const emojiMap = {};
    (categories || []).forEach((c) => {
      nameMap[c.id] = c.name;
      emojiMap[c.id] = c.emoji || '';
    });
    return { catMap: nameMap, catEmoji: emojiMap };
  }, [categories]);

  const colorIndexByCategoryId = useMemo(() => {
    const ids = [...new Set((budgets || []).map((b) => b.category_id))].sort();
    const m = {};
    ids.forEach((id, i) => {
      m[id] = i;
    });
    return m;
  }, [budgets]);

  useEffect(() => {
    if (!budgets?.length) return;
    const valid = new Set(budgets.map((b) => b.category_id));
    setHiddenCategoryIds((prev) => {
      const next = new Set(prev);
      for (const id of prev) {
        if (!valid.has(id)) next.delete(id);
      }
      return next;
    });
  }, [budgets]);

  const visibleBudgets = useMemo(
    () => (budgets || []).filter((b) => !hiddenCategoryIds.has(b.category_id)),
    [budgets, hiddenCategoryIds],
  );

  const pieItems = useMemo(
    () => visibleBudgets.map((b) => {
      const idx = colorIndexByCategoryId[b.category_id] ?? 0;
      return {
        label: catMap[b.category_id] || b.category_id,
        value: Number(b.amount) || 0,
        fill: PIE_CHART_COLORS[idx % PIE_CHART_COLORS.length],
      };
    }),
    [visibleBudgets, colorIndexByCategoryId, catMap],
  );

  const visibleTotal = useMemo(
    () => visibleBudgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
    [visibleBudgets],
  );

  const sortedBudgets = useMemo(() => {
    const list = [...(budgets || [])];
    list.sort((a, b) => {
      const da = Number(a.amount) || 0;
      const db = Number(b.amount) || 0;
      return db - da;
    });
    return list;
  }, [budgets]);

  const setCategoryChartVisibility = (categoryId, visible) => {
    setHiddenCategoryIds((prev) => {
      const next = new Set(prev);
      if (visible) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  // Add panel state
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [newPlanOpen, setNewPlanOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanError, setNewPlanError] = useState(null);
  const [newPlanSubmitting, setNewPlanSubmitting] = useState(false);

  const [planSettingsOpen, setPlanSettingsOpen] = useState(false);
  const [planSettingsName, setPlanSettingsName] = useState('');
  const [planSettingsKind, setPlanSettingsKind] = useState('spending');
  const [planSettingsError, setPlanSettingsError] = useState(null);
  const [planSettingsSubmitting, setPlanSettingsSubmitting] = useState(false);

  const planTabs = useMemo(
    () => (plans || []).map((p) => ({ id: p.id, label: p.name })),
    [plans],
  );

  const activePlan = useMemo(
    () => (plans || []).find((p) => p.id === activePlanId),
    [plans, activePlanId],
  );

  const budgetUiReady =
    !plansLoading && !plansError && Boolean(activePlanId) && planTabs.length > 0;

  // Edit panel state
  const [editOpen, setEditOpen] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editError, setEditError] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  // New entry form within the edit panel
  const [newEntry, setNewEntry] = useState({ amount: '', start_date: todayStr() });

  const openAdd = () => {
    setForm(emptyForm());
    setFormError(null);
    setAddOpen(true);
  };

  const closeAdd = useCallback(() => {
    setAddOpen(false);
    setFormError(null);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createBudget({
        budget_plan_id: activePlanId,
        category_id: form.category_id,
        amount: centsFromDollars(form.amount),
        currency: form.currency,
        period: form.period,
        start_date: form.start_date || todayStr(),
        end_date: form.end_date,
      });
      closeAdd();
      refetch();
      refetchAll();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Get all budget entries for the edit panel's category, sorted by start_date
  const catHistory = useMemo(() => {
    if (!editCatId || !allBudgets) return [];
    return allBudgets
      .filter((b) => b.category_id === editCatId)
      .sort((a, b) => (a.start_date || '').localeCompare(b.start_date || ''));
  }, [editCatId, allBudgets]);

  const editCategory = useMemo(
    () => (categories || []).find((c) => c.id === editCatId),
    [categories, editCatId],
  );

  const openEdit = (b) => {
    setEditCatId(b.category_id);
    setEditError(null);
    setNewEntry({ amount: '', start_date: todayStr() });
    setEditOpen(true);
  };

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditCatId(null);
    setEditError(null);
  }, []);

  const handleUpdateEntry = async (id, updates) => {
    setEditSubmitting(true);
    setEditError(null);
    try {
      await updateBudget(id, updates);
      refetch();
      refetchAll();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!confirm('Delete this budget entry?')) return;
    setEditError(null);
    try {
      await deleteBudget(id);
      refetch();
      refetchAll();
    } catch (err) {
      setEditError(err.message);
    }
  };

  const handleDeleteCategoryBudgets = async () => {
    if (!editCatId || catHistory.length === 0) return;
    const name = catMap[editCatId] || 'this category';
    if (
      !confirm(
        `Remove all budget entries for "${name}"? The spending category is kept — only its budget history is deleted.`,
      )
    ) {
      return;
    }
    setEditSubmitting(true);
    setEditError(null);
    try {
      await Promise.all(catHistory.map((entry) => deleteBudget(entry.id)));
      closeEdit();
      refetch();
      refetchAll();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.amount || !newEntry.start_date) return;
    setEditSubmitting(true);
    setEditError(null);
    try {
      // Find the currently active entry and close it at the new start date
      const active = catHistory.find((b) => !b.end_date?.trim());
      if (active && active.start_date < newEntry.start_date) {
        await updateBudget(active.id, { end_date: newEntry.start_date });
      }
      await createBudget({
        budget_plan_id: activePlanId,
        category_id: editCatId,
        amount: centsFromDollars(newEntry.amount),
        currency: active?.currency || DEFAULT_CURRENCY,
        period: active?.period || 'monthly',
        start_date: newEntry.start_date,
        end_date: '',
      });
      setNewEntry({ amount: '', start_date: todayStr() });
      refetch();
      refetchAll();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const openNewPlan = () => {
    setNewPlanName('');
    setNewPlanError(null);
    setNewPlanOpen(true);
  };

  const closeNewPlan = useCallback(() => {
    setNewPlanOpen(false);
    setNewPlanError(null);
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const name = newPlanName.trim();
    if (!name) return;
    setNewPlanSubmitting(true);
    setNewPlanError(null);
    try {
      const row = await createBudgetPlan({ name });
      setNewPlanName('');
      closeNewPlan();
      await refetchPlans();
      setActivePlanId(row.id);
    } catch (err) {
      setNewPlanError(err.message);
    } finally {
      setNewPlanSubmitting(false);
    }
  };

  const openPlanSettings = useCallback(() => {
    if (!activePlan) return;
    setPlanSettingsName(activePlan.name || '');
    setPlanSettingsKind(activePlan.kind === 'savings' ? 'savings' : 'spending');
    setPlanSettingsError(null);
    setPlanSettingsOpen(true);
  }, [activePlan]);

  const closePlanSettings = useCallback(() => {
    setPlanSettingsOpen(false);
    setPlanSettingsError(null);
  }, []);

  const handlePlanSettingsSubmit = async (e) => {
    e.preventDefault();
    const name = planSettingsName.trim();
    if (!name) {
      setPlanSettingsError('Name is required');
      return;
    }
    if (!activePlanId) return;
    setPlanSettingsSubmitting(true);
    setPlanSettingsError(null);
    try {
      await updateBudgetPlan(activePlanId, { name, kind: planSettingsKind });
      await refetchPlans();
      closePlanSettings();
    } catch (err) {
      setPlanSettingsError(err.message);
    } finally {
      setPlanSettingsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!planSettingsOpen || !activePlan) return;
    setPlanSettingsName(activePlan.name || '');
    setPlanSettingsKind(activePlan.kind === 'savings' ? 'savings' : 'spending');
  }, [activePlanId, activePlan, planSettingsOpen]);

  return (
    <PageRoot className="page page--full-width page--budget">
      <PageHeader
        title="Budgets"
        subtitle="Plans for spending and savings—targets and progress by category."
        withSubHeader={budgetUiReady && !error}
      >
        {budgetUiReady && !error ? (
          <Button
            type="button"
            variant="primary"
            icon
            onClick={openNewPlan}
            aria-label="New named budget"
            title="New named budget"
          >
            <FiPlus size={20} />
          </Button>
        ) : null}
      </PageHeader>

      <SidePanel title="New budget" open={newPlanOpen} onClose={closeNewPlan}>
        {newPlanError && <div className="error">{newPlanError}</div>}
        <form onSubmit={handleCreatePlan}>
          <div className="form-group">
            <label htmlFor="new-budget-name">Name</label>
            <input
              id="new-budget-name"
              type="text"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder="e.g. Savings, Construction"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="secondary" disabled={newPlanSubmitting}>
              {newPlanSubmitting ? 'Creating…' : 'Create'}
            </Button>
            <Button type="button" variant="text" onClick={closeNewPlan}>Cancel</Button>
          </div>
        </form>
      </SidePanel>

      <SidePanel title="Edit plan" open={planSettingsOpen} onClose={closePlanSettings}>
        {planSettingsError && <div className="error">{planSettingsError}</div>}
        <form onSubmit={handlePlanSettingsSubmit}>
          <div className="form-group">
            <label htmlFor="plan-settings-name">Plan name</label>
            <input
              id="plan-settings-name"
              type="text"
              value={planSettingsName}
              onChange={(e) => setPlanSettingsName(e.target.value)}
              placeholder="e.g. Monthly budget"
              autoComplete="off"
              required
            />
          </div>
          <Select
            label="Plan type"
            value={planSettingsKind}
            onChange={(v) => setPlanSettingsKind(v)}
            options={[
              { value: 'spending', label: 'Spending — going over is bad' },
              { value: 'savings', label: 'Savings — beating the goal is good' },
            ]}
          />
          <p className="form-hint budget-plan-kind-hint">
            Spending plans track limits. Savings plans treat extra contributions as ahead of schedule.
          </p>
          <div className="form-actions">
            <Button type="submit" variant="secondary" disabled={planSettingsSubmitting}>
              {planSettingsSubmitting ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="text" onClick={closePlanSettings} disabled={planSettingsSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </SidePanel>

      {/* Add Budget Panel */}
      <SidePanel title="Add Budget" open={addOpen} onClose={closeAdd}>
        {formError && <div className="error">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <Select
            label="Category"
            value={form.category_id}
            onChange={(v) => setForm({ ...form, category_id: v })}
            options={(categories || []).map((c) => ({
              value: c.id,
              label: categorySelectLabel(c),
              content: categorySelectContent(c),
            }))}
            placeholder="Select category"
            searchable
            required
          />
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <Select
              label="Currency"
              value={form.currency}
              onChange={(v) => setForm({ ...form, currency: v })}
              options={CURRENCIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <Select
            label="Period"
            value={form.period}
            onChange={(v) => setForm({ ...form, period: v })}
            options={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start date</label>
              <input type="date" id="start_date" name="start_date" value={form.start_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End date (optional)</label>
              <input type="date" id="end_date" name="end_date" value={form.end_date} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <Button type="submit" variant="secondary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Budget'}
            </Button>
            <Button type="button" variant="text" onClick={closeAdd}>Cancel</Button>
          </div>
        </form>
      </SidePanel>

      {/* Edit Budget Panel — shows history timeline */}
      <SidePanel
        title={
          <>
            Budget:{' '}
            {editCategory ? categorySelectContent(editCategory) : catMap[editCatId] || ''}
          </>
        }
        open={editOpen}
        onClose={closeEdit}
      >
        {editError && <div className="error">{editError}</div>}

        <div className="budget-history">
          <label className="budget-history-label">History</label>
          {catHistory.length === 0 ? (
            <p className="empty">No entries.</p>
          ) : (
            <div className="budget-timeline">
              {catHistory.map((entry) => (
                <BudgetEntry
                  key={entry.id}
                  entry={entry}
                  onUpdate={handleUpdateEntry}
                  onDelete={handleDeleteEntry}
                  disabled={editSubmitting}
                />
              ))}
            </div>
          )}
        </div>

        <div className="budget-new-entry">
          <label className="budget-history-label">Add new amount</label>
          <form onSubmit={handleAddEntry}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new-start">Start date</label>
                <input
                  type="date"
                  id="new-start"
                  value={newEntry.start_date}
                  onChange={(e) => setNewEntry({ ...newEntry, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-amount">Amount</label>
                <input
                  type="number"
                  id="new-amount"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" variant="secondary" size="sm" disabled={editSubmitting}>
                {editSubmitting ? 'Saving...' : 'Add Entry'}
              </Button>
            </div>
          </form>
        </div>

        <div className="budget-panel-remove">
          <p className="budget-panel-remove-hint">
            Deletes every budget line for this category. Operations and the category are unchanged.
          </p>
          <Button
            type="button"
            variant="danger"
            disabled={editSubmitting || catHistory.length === 0}
            onClick={handleDeleteCategoryBudgets}
          >
            Remove budget for this category
          </Button>
        </div>
      </SidePanel>

      {budgetUiReady && !error && (
        <PageSubHeader className="budget-plan-tabs-row" ariaLabel="Budget plans">
          <Tabs
            className="budget-plan-tabs"
            variant="small-shrink"
            tabs={planTabs}
            active={activePlanId}
            onChange={setActivePlanId}
          />
        </PageSubHeader>
      )}

      <PageMain fill>
      {plansError && <div className="error">Error loading budgets: {plansError}</div>}
      {!budgetUiReady && !error && !plansError && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {budgetUiReady && !error && (
        <>
      {loading && <div className="loading">Loading...</div>}

      {!loading && (
        <div className="budget-dashboard-root">
        <div
          className={[
            'budget-dashboard-layout',
            (!budgets || budgets.length === 0) ? 'budget-dashboard-layout--empty' : '',
          ].filter(Boolean).join(' ')}
        >
          <div className="budget-dashboard-layout__list">
            <SectionCard
              className="dashboard-widget budget-dashboard-widget"
              title={
                <span className="budget-dashboard-widget__title-cluster">
                  <span className="budget-dashboard-widget__title-text">
                    {activePlan?.name?.trim() || 'Budget plan'}
                  </span>
                  <BudgetPlanEditIconButton onClick={openPlanSettings} />
                </span>
              }
              titleAs="h2"
              headerExtra={
                budgets?.length > 0 ? (
                  <MiniKpiCard
                    label="Total"
                    amountCents={visibleTotal}
                    currency={DEFAULT_CURRENCY}
                    title="Sum of budgets for categories included in the chart"
                  />
                ) : null
              }
            >
              {(!budgets || budgets.length === 0) ? (
                <div className="budget-dashboard-widget__empty">
                  <p className="empty budget-empty-categories-hint">Add a budget for a category to see it here.</p>
                  <div className="budget-category-list-add budget-category-list-add--empty">
                    <BudgetAddCategoryButton onClick={openAdd} />
                  </div>
                </div>
              ) : (
                <div
                  className="budget-category-scroll"
                  role="region"
                  aria-label={
                    activePlan?.name?.trim()
                      ? `${activePlan.name.trim()} — categories`
                      : 'Budget categories'
                  }
                >
                  <ul className="budget-category-list">
                    {sortedBudgets.map((b) => {
                      const amount = Number(b.amount) || 0;
                      const currency = b.currency || DEFAULT_CURRENCY;
                      const catName = catMap[b.category_id] || b.category_id;
                      const emoji = catEmoji[b.category_id];
                      const shown = !hiddenCategoryIds.has(b.category_id);
                      const sharePercent =
                        shown && visibleTotal > 0 ? (amount / visibleTotal) * 100 : null;
                      return (
                        <BudgetCategoryCard
                          key={b.id}
                          categoryName={catName}
                          emoji={emoji}
                          amount={amount}
                          currency={currency}
                          sharePercent={sharePercent}
                          showInChart={shown}
                          chartToggleId={b.category_id}
                          showChartToggle
                          onChartVisibilityChange={(visible) =>
                            setCategoryChartVisibility(b.category_id, visible)}
                          showActions
                          onEdit={() => openEdit(b)}
                        />
                      );
                    })}
                  </ul>
                  <div className="budget-category-list-add">
                    <BudgetAddCategoryButton onClick={openAdd} />
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
          {(!budgets || budgets.length === 0) ? null : (
            <div className="budget-dashboard-layout__chart">
              <div className="budget-chart-stack">
                {visibleBudgets.length === 0 ? (
                  <p className="empty budget-chart-empty">Turn on at least one category to see the chart.</p>
                ) : (
                  <PieChart items={pieItems} currency={DEFAULT_CURRENCY} showLegend={false} />
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      )}
        </>
      )}
      </PageMain>
    </PageRoot>
  );
}

function BudgetPlanEditIconButton({ onClick, className = '' }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      icon
      className={className}
      onClick={onClick}
      aria-label="Edit budget plan"
      title="Edit budget plan"
    >
      <FiEdit size={18} />
    </Button>
  );
}

function BudgetAddCategoryButton({ onClick }) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      className="budget-add-category-btn"
      onClick={onClick}
    >
      Add budget category
    </Button>
  );
}

/** Single budget history entry — inline editable */
function BudgetEntry({ entry, onUpdate, onDelete, disabled }) {
  const [editing, setEditing] = useState(false);
  const [localAmount, setLocalAmount] = useState('');
  const [localStart, setLocalStart] = useState('');
  const [localEnd, setLocalEnd] = useState('');

  const startEditing = () => {
    setLocalAmount(dollarsFromCents(entry.amount));
    setLocalStart(entry.start_date || '');
    setLocalEnd(entry.end_date || '');
    setEditing(true);
  };

  const save = async () => {
    const updates = {};
    const newAmt = centsFromDollars(localAmount);
    if (String(newAmt) !== String(entry.amount)) updates.amount = newAmt;
    if (localStart !== (entry.start_date || '')) updates.start_date = localStart;
    if (localEnd !== (entry.end_date || '')) updates.end_date = localEnd;
    if (Object.keys(updates).length > 0) {
      await onUpdate(entry.id, updates);
    }
    setEditing(false);
  };

  const isActive = !entry.end_date?.trim();

  if (editing) {
    return (
      <div className="budget-entry budget-entry-editing">
        <div className="form-row">
          <div className="form-group">
            <label>Start</label>
            <input
              type="date"
              value={localStart}
              onChange={(e) => setLocalStart(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End</label>
            <input
              type="date"
              value={localEnd}
              onChange={(e) => setLocalEnd(e.target.value)}
              placeholder="Active"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={localAmount}
            onChange={(e) => setLocalAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="budget-entry-actions">
          <Button variant="secondary" size="sm" onClick={save} disabled={disabled}>Save</Button>
          <Button variant="text" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`budget-entry ${isActive ? 'budget-entry-active' : ''}`}>
      <div className="budget-entry-dates">
        <span>{formatDate(entry.start_date)}</span>
        <span className="budget-entry-arrow">&rarr;</span>
        <span>{entry.end_date ? formatDate(entry.end_date) : 'Present'}</span>
      </div>
      <div className="budget-entry-amount">
        <Redacted>{formatCurrency(Number(entry.amount) || 0, entry.currency || DEFAULT_CURRENCY)}</Redacted>
      </div>
      <div className="budget-entry-actions">
        <Button variant="ghost" size="sm" icon onClick={startEditing} title="Edit">
          <FiEdit size={14} />
        </Button>
        <Button variant="ghost" size="sm" icon onClick={() => onDelete(entry.id)} title="Delete">
          <FiTrash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
