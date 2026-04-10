import { useState, useEffect, useMemo } from 'react';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import FormField from '../FormField';
import PanelSectionTitle from '../PanelSectionTitle';
import Select from '../Select';
import SidePanel from '../SidePanel';
import { categorySelectLabel, categorySelectContent } from '../../utils/categoryLabels';
import { operationsAccountFilterLabel } from '../../utils/accountLabels';
import { mergeOpsFooterKpis } from '../../utils/operationsWidgetKpis';

function PanelSection({ id, title, children, danger = false }) {
  return (
    <section
      className={danger ? 'widget-config-section widget-config-section--danger' : 'widget-config-section'}
      aria-labelledby={id}
    >
      <PanelSectionTitle id={id}>{title}</PanelSectionTitle>
      <div className="widget-config-section__fields">{children}</div>
    </section>
  );
}

function widgetSupportsSort(source) {
  return source === 'revenue' || source === 'non_budget' || source === 'budget' || source == null || source === '';
}

const TOP_CONTENT_OPTIONS = [
  { value: 'budget', label: 'Budget' },
  { value: 'operations', label: 'Operations' },
];

/** Budget side: budget + non_budget sources. Operations side: revenue + operations. */
function widgetContentBranch(source) {
  const s = source || 'budget';
  if (s === 'revenue' || s === 'operations') return 'operations';
  return 'budget';
}

const EMPTY_OPS_FILTERS = { type: '', category_id: '', account_id: '', member_id: '' };

/** Matches backend `get_monthly_dashboard_plan_id` — used when widget.planId is empty. */
function planNameKey(name) {
  return (name || '').trim().toLowerCase();
}

function resolveMonthlyDashboardPlanId(plans) {
  if (!plans?.length) return '';
  const byName = {};
  for (const p of plans) {
    const k = planNameKey(p.name);
    if (k && !(k in byName)) byName[k] = p;
  }
  const preferred = planNameKey('Monthly budget');
  if (preferred in byName) return byName[preferred].id;
  return plans[0].id;
}

function isAllTransfersPreset(draft) {
  if (draft?.source !== 'operations') return false;
  const f = { ...EMPTY_OPS_FILTERS, ...(draft.opsFilters || {}) };
  return f.type === 'money_movement' && !f.category_id && !f.account_id && !f.member_id;
}

/** revenue | transfers | custom — only meaningful when branch is operations */
function operationsPopularMode(draft) {
  if (draft?.source === 'revenue') return 'revenue';
  if (draft?.source === 'operations' && isAllTransfersPreset(draft)) return 'transfers';
  if (draft?.source === 'operations') return 'custom';
  return 'revenue';
}

export default function WidgetConfigPanel({
  open,
  onClose,
  widget,
  allPlans,
  categories,
  accounts,
  members,
  onChange,
  onRemove,
}) {
  const [draft, setDraft] = useState(widget);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset draft when a different widget is opened
  useEffect(() => {
    setDraft(widget);
    setConfirmDelete(false);
  }, [widget?.id]);


  if (!open || !widget) return null;

  const dirty = JSON.stringify(draft) !== JSON.stringify(widget);

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const setFilter = (key, value) =>
    setDraft((d) => ({ ...d, opsFilters: { ...(d.opsFilters || {}), [key]: value } }));
  const setOpsFooterKpi = (key, checked) =>
    setDraft((d) => ({
      ...d,
      opsFooterKpis: { ...mergeOpsFooterKpis(d), [key]: checked },
    }));
  const filters = { ...EMPTY_OPS_FILTERS, ...(draft?.opsFilters || {}) };
  const showSort = draft?.showSort !== false;

  const topBranch = widgetContentBranch(draft?.source);
  const popular = operationsPopularMode(draft);
  const implicitBudgetPlanId = resolveMonthlyDashboardPlanId(allPlans);

  function setTopBranch(next) {
    if (next === 'budget') {
      setDraft((d) => {
        if (widgetContentBranch(d.source) === 'budget') return d;
        return { ...d, source: 'budget', planId: '', opsFilters: { ...EMPTY_OPS_FILTERS, ...(d.opsFilters || {}) } };
      });
    } else {
      setDraft((d) => {
        if (widgetContentBranch(d.source) === 'operations') return d;
        return { ...d, source: 'revenue', opsFilters: { ...EMPTY_OPS_FILTERS } };
      });
    }
  }

  function pickBudgetPlan(planId) {
    setDraft((d) => ({ ...d, source: 'budget', planId }));
  }

  function pickNonBudget() {
    setDraft((d) => ({ ...d, source: 'non_budget', planId: '' }));
  }

  function pickPopularRevenue() {
    setDraft((d) => ({ ...d, source: 'revenue', opsFilters: { ...EMPTY_OPS_FILTERS } }));
  }

  function pickPopularTransfers() {
    setDraft((d) => ({
      ...d,
      source: 'operations',
      opsFilters: { ...EMPTY_OPS_FILTERS, type: 'money_movement' },
    }));
  }

  function pickPopularCustom() {
    setDraft((d) => ({ ...d, source: 'operations', opsFilters: { ...EMPTY_OPS_FILTERS } }));
  }

  function handleSave() {
    onChange(draft);
  }

  function handleCancel() {
    setDraft(widget);
    setConfirmDelete(false);
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Configure widget"
      footer={
        <div className="side-panel-footer__inner">
          {dirty ? (
            <span className="side-panel-footer-unsaved">Unsaved changes</span>
          ) : null}
          <div className="side-panel-footer__actions">
            <Button variant="ghost" type="button" onClick={handleCancel} disabled={!dirty}>
              Cancel
            </Button>
            <Button variant="primary" type="button" onClick={handleSave} disabled={!dirty}>
              Save
            </Button>
          </div>
        </div>
      }
    >
    <div className="widget-config-panel">
      <PanelSection id="wcp-section-header" title="Header">
        <FormField label="Widget name" htmlFor="wcp-name">
          <input
            id="wcp-name"
            type="text"
            value={draft?.name || ''}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Savings, Monthly budget…"
          />
        </FormField>

        <FormField label="Column" htmlFor="wcp-column">
          <Select
            id="wcp-column"
            value={String(draft?.column ?? 1)}
            onChange={(v) => set('column', Number(v))}
            options={[
              { value: '1', label: 'Column 1' },
              { value: '2', label: 'Column 2' },
              { value: '3', label: 'Column 3' },
            ]}
            placeholder="Column"
          />
        </FormField>

        {widgetSupportsSort(draft?.source) && (
          <div className="form-group">
            <label className="form-checkbox-label" htmlFor="wcp-show-sort">
              <input
                id="wcp-show-sort"
                type="checkbox"
                checked={showSort}
                onChange={(e) => set('showSort', e.target.checked)}
              />
              <span>Show sorting control</span>
            </label>
          </div>
        )}
      </PanelSection>

      <PanelSection id="wcp-section-content" title="Content">
        <div className="form-group form-group--widget-branch-toggle">
          <div role="group" aria-label="Budget or operations">
            <ButtonGroup
              className="widget-config-source-toggle"
              size="sm"
              value={topBranch}
              onChange={setTopBranch}
              options={TOP_CONTENT_OPTIONS}
            />
          </div>
        </div>

        {topBranch === 'budget' && (
          <div className="form-group">
            <div className="form-control-group-title" id="wcp-plan-legend">
              Budget plan
            </div>
            <div
              className="form-control-stack"
              role="radiogroup"
              aria-labelledby="wcp-plan-legend"
            >
              {(allPlans || []).map((p) => (
                <label key={p.id} className="form-radio-label" htmlFor={`wcp-plan-${widget.id}-${p.id}`}>
                  <input
                    id={`wcp-plan-${widget.id}-${p.id}`}
                    type="radio"
                    name={`wcp-budget-${widget.id}`}
                    checked={
                      draft?.source === 'budget' &&
                      (draft?.planId === p.id ||
                        (!(draft?.planId || '') && p.id === implicitBudgetPlanId))
                    }
                    onChange={() => pickBudgetPlan(p.id)}
                  />
                  <span>{p.name}</span>
                </label>
              ))}
              <label className="form-radio-label" htmlFor={`wcp-nonbudget-${widget.id}`}>
                <input
                  id={`wcp-nonbudget-${widget.id}`}
                  type="radio"
                  name={`wcp-budget-${widget.id}`}
                  checked={draft?.source === 'non_budget'}
                  onChange={pickNonBudget}
                />
                <span>Everything non-budget</span>
              </label>
            </div>
          </div>
        )}

        {topBranch === 'operations' && (
          <>
            <div className="form-group">
              <div className="form-control-group-title" id="wcp-popular-legend">
                Popular
              </div>
              <div
                className="form-control-stack"
                role="radiogroup"
                aria-labelledby="wcp-popular-legend"
              >
                <label className="form-radio-label" htmlFor={`wcp-pop-rev-${widget.id}`}>
                  <input
                    id={`wcp-pop-rev-${widget.id}`}
                    type="radio"
                    name={`wcp-popular-${widget.id}`}
                    checked={popular === 'revenue'}
                    onChange={pickPopularRevenue}
                  />
                  <span>All revenue</span>
                </label>
                <label className="form-radio-label" htmlFor={`wcp-pop-xfer-${widget.id}`}>
                  <input
                    id={`wcp-pop-xfer-${widget.id}`}
                    type="radio"
                    name={`wcp-popular-${widget.id}`}
                    checked={popular === 'transfers'}
                    onChange={pickPopularTransfers}
                  />
                  <span>All transfers</span>
                </label>
                <label className="form-radio-label" htmlFor={`wcp-pop-custom-${widget.id}`}>
                  <input
                    id={`wcp-pop-custom-${widget.id}`}
                    type="radio"
                    name={`wcp-popular-${widget.id}`}
                    checked={popular === 'custom'}
                    onChange={pickPopularCustom}
                  />
                  <span>Custom</span>
                </label>
              </div>
            </div>

            {popular === 'custom' && (
              <>
                <FormField label="Type" htmlFor="wcp-type">
                  <Select
                    id="wcp-type"
                    value={filters.type || ''}
                    onChange={(v) => setFilter('type', v)}
                    options={[
                      { value: '', label: 'All' },
                      { value: 'expense', label: 'Expenses' },
                      { value: 'income', label: 'Income' },
                      { value: 'money_movement', label: 'Transfers' },
                    ]}
                    placeholder="All"
                  />
                </FormField>

                <FormField label="Category" htmlFor="wcp-category">
                  <Select
                    id="wcp-category"
                    value={filters.category_id || ''}
                    onChange={(v) => setFilter('category_id', v)}
                    options={[
                      { value: '', label: 'All categories' },
                      ...(categories || []).map((c) => ({
                        value: c.id,
                        label: categorySelectLabel(c),
                        content: categorySelectContent(c),
                      })),
                    ]}
                    placeholder="All categories"
                    searchable
                    dropdownClassName="select-dropdown-wide"
                  />
                </FormField>

                <FormField label="Account" htmlFor="wcp-account">
                  <Select
                    id="wcp-account"
                    value={filters.account_id || ''}
                    onChange={(v) => setFilter('account_id', v)}
                    options={[
                      { value: '', label: 'All accounts' },
                      ...(accounts || []).map((a) => ({
                        value: a.id,
                        label: operationsAccountFilterLabel(a, members),
                      })),
                    ]}
                    placeholder="All accounts"
                    searchable
                    dropdownClassName="select-dropdown-wide"
                  />
                </FormField>

                <FormField label="Member" htmlFor="wcp-member">
                  <Select
                    id="wcp-member"
                    value={filters.member_id || ''}
                    onChange={(v) => setFilter('member_id', v)}
                    options={[
                      { value: '', label: 'All people' },
                      ...(members || []).map((m) => ({
                        value: m.id,
                        label: `${m.first_name} ${m.last_name}`.trim(),
                      })),
                    ]}
                    placeholder="All people"
                    dropdownClassName="select-dropdown-wide"
                  />
                </FormField>
              </>
            )}

            {topBranch === 'operations' && (
              <div className="form-group">
                <div className="form-control-group-title" id="wcp-ops-kpis-legend">
                  Footer KPIs
                </div>
                <div
                  className="form-control-stack"
                  role="group"
                  aria-labelledby="wcp-ops-kpis-legend"
                >
                  <label className="form-checkbox-label" htmlFor={`wcp-kpi-total-${widget.id}`}>
                    <input
                      id={`wcp-kpi-total-${widget.id}`}
                      type="checkbox"
                      checked={mergeOpsFooterKpis(draft).total}
                      onChange={(e) => setOpsFooterKpi('total', e.target.checked)}
                    />
                    <span>Total</span>
                  </label>
                  <label className="form-checkbox-label" htmlFor={`wcp-kpi-avg-${widget.id}`}>
                    <input
                      id={`wcp-kpi-avg-${widget.id}`}
                      type="checkbox"
                      checked={mergeOpsFooterKpis(draft).average}
                      onChange={(e) => setOpsFooterKpi('average', e.target.checked)}
                    />
                    <span>Average</span>
                  </label>
                </div>
              </div>
            )}
          </>
        )}

        <div className="form-group">
          <label className="form-checkbox-label" htmlFor="wcp-start-collapsed">
            <input
              id="wcp-start-collapsed"
              type="checkbox"
              checked={draft?.defaultCollapsed === true}
              onChange={(e) => set('defaultCollapsed', e.target.checked)}
            />
            <span>Start collapsed</span>
          </label>
        </div>
      </PanelSection>

      <PanelSection id="wcp-section-danger" title="Danger zone" danger>
        <p className="widget-config-danger__hint">
          Removing a widget is an irrevocable change. You can add one again later, but this card’s settings and placement won’t be restored.
        </p>
        {confirmDelete ? (
          <div className="widget-config-danger__confirm">
            <p className="widget-config-danger__confirm-lead">
              Remove <strong>{widget.name || 'this widget'}</strong> from the dashboard?
            </p>
            <div className="widget-config-danger__actions">
              <Button variant="danger" size="lg" type="button" onClick={onRemove}>
                Yes, remove
              </Button>
              <Button variant="ghost" type="button" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" size="lg" type="button" onClick={() => setConfirmDelete(true)}>
            Remove widget
          </Button>
        )}
      </PanelSection>
    </div>
    </SidePanel>
  );
}
