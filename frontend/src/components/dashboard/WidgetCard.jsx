import { useState, useCallback, useMemo } from 'react';
import { FiEdit } from 'react-icons/fi';
import { LuArrowDownWideNarrow, LuArrowDownNarrowWide } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { getMonthlyReport, getOperations } from '../../api';
import { useData } from '../../hooks/useData';
import SectionCard from '../SectionCard';
import Button from '../Button';
import BudgetProgressBar from '../BudgetProgressBar';
import CategoryAmountTable from '../CategoryAmountTable';
import MiniKpiCard from '../MiniKpiCard';
import EmptyState from '../EmptyState';
import AsyncContent from '../AsyncContent';
import OperationAmountCell from '../OperationAmountCell';
import { TableBlockSticky } from '../TableBlock';
import { formatDate, getMonthRange } from '../../utils/format';
import { buildOperationsUrl } from '../../utils/operationsUrl';
import { categorySelectContent } from '../../utils/categoryLabels';
import { DEFAULT_CURRENCY } from '../../config';
import { mergeOpsFooterKpis } from '../../utils/operationsWidgetKpis';

/** Idle mode: open configure side panel only. */
function WidgetConfigureControl({ onConfigure }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      icon
      type="button"
      title="Configure widget"
      aria-label="Configure widget"
      onClick={onConfigure}
    >
      <FiEdit size={15} />
    </Button>
  );
}

/** Configure — only while layout edit mode; see `.dashboard-widget__chrome`. Sort stays outside this wrapper. */
function WidgetHeaderChrome({ controls }) {
  if (!controls) return null;
  return <div className="dashboard-widget__chrome">{controls}</div>;
}

function WidgetTitleAddon({ sortAddon, controls }) {
  return (
    <>
      {sortAddon}
      <WidgetHeaderChrome controls={controls} />
    </>
  );
}

function BudgetWidgetContent({ widget, month, allPlans, controls }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState('spent');
  const currency = DEFAULT_CURRENCY;
  const { start: monthStart, end: monthEnd } = getMonthRange(month);

  const fetchFn = useCallback(
    () => getMonthlyReport(month, widget.planId),
    [month, widget.planId],
  );
  const { data: report, loading, error } = useData(fetchFn, [
    'operations.csv',
    'budgets.csv',
    'budget_plans.csv',
  ]);

  const plan = allPlans?.find((p) => p.id === widget.planId);
  const planKind = plan?.kind ?? report?.budget_plan?.kind ?? 'spending';
  const budgets = report?.budget_vs_actual || [];
  const actual = budgets.reduce((s, b) => s + (b.actual_spent || 0), 0);
  const planned = budgets.reduce((s, b) => s + (b.budget_amount || 0), 0);
  const diff = actual - planned;

  const sorted = [...budgets].sort((a, b) =>
    sort === 'spent'
      ? (b.actual_spent || 0) - (a.actual_spent || 0)
      : (a.category_name || '').localeCompare(b.category_name || ''),
  );

  const diffTone = diff === 0 ? undefined : planKind === 'savings' ? (diff > 0 ? 'good' : 'bad') : (diff > 0 ? 'bad' : 'good');

  const showSort = widget.showSort !== false;
  const sortAddon =
    showSort && budgets.length > 0 ? (
      <Button
        variant="ghost"
        size="sm"
        icon
        type="button"
        title={sort === 'spent' ? 'Sort by name' : 'Sort by amount'}
        onClick={() => setSort((s) => (s === 'spent' ? 'name' : 'spent'))}
      >
        {sort === 'name' ? <LuArrowDownNarrowWide size={16} aria-hidden /> : <LuArrowDownWideNarrow size={16} aria-hidden />}
      </Button>
    ) : null;

  return (
    <SectionCard
      key={`${widget.id}-collapsed-${widget.defaultCollapsed === true ? '1' : '0'}`}
      className="dashboard-widget"
      title={widget.name || 'Widget'}
      titleAddon={<WidgetTitleAddon sortAddon={sortAddon} controls={controls} />}
      collapsible
      defaultCollapsed={widget.defaultCollapsed === true}
      footer={
        report && budgets.length > 0 ? (
          <>
            <MiniKpiCard label="Plan" amountCents={planned} currency={currency} />
            <MiniKpiCard label="Actual" amountCents={actual} currency={currency} />
            <MiniKpiCard label="Diff" amountCents={diff} currency={currency} amountTone={diffTone} />
          </>
        ) : null
      }
    >
      <AsyncContent loading={loading} error={error}>
        {budgets.length === 0 ? (
          <EmptyState message="No budgets set for this plan." />
        ) : (
          <div className="budget-list section-card__budget-list">
            {sorted.map((b) => (
              <div
                key={b.category_id || b.category_name}
                className="u-cursor-pointer budget-list-nav-row"
                role="button"
                tabIndex={0}
                onClick={() => navigate(buildOperationsUrl({ start: monthStart, end: monthEnd, category: b.category_id }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(buildOperationsUrl({ start: monthStart, end: monthEnd, category: b.category_id }));
                  }
                }}
              >
                <BudgetProgressBar
                  label={categorySelectContent({ name: b.category_name, emoji: b.category_emoji })}
                  spent={b.actual_spent}
                  budgeted={b.budget_amount}
                  currency={b.currency || currency}
                  planKind={planKind === 'savings' ? 'savings' : 'spending'}
                />
              </div>
            ))}
          </div>
        )}
      </AsyncContent>
    </SectionCard>
  );
}

function OperationsWidgetContent({ widget, month, controls }) {
  const navigate = useNavigate();
  const currency = DEFAULT_CURRENCY;
  const { start: monthStart, end: monthEnd } = getMonthRange(month);

  const filters = Object.fromEntries(
    Object.entries(widget.opsFilters || {}).filter(([, v]) => v),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filtersKey = useMemo(() => JSON.stringify(widget.opsFilters), [widget.opsFilters]);

  const fetchFn = useCallback(
    () => getOperations({ month, ...filters }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [month, filtersKey],
  );
  const { data: ops, loading, error } = useData(fetchFn, 'operations.csv');

  const rows = ops || [];
  const footerKpis = mergeOpsFooterKpis(widget);
  const totalCents = rows.reduce((s, op) => s + Number(op.amount || 0), 0);
  const avgCents = rows.length > 0 ? Math.round(totalCents / rows.length) : 0;
  const footerKpiNodes = [];
  if (rows.length > 0) {
    if (footerKpis.total) {
      footerKpiNodes.push(
        <MiniKpiCard key="total" label="Total" amountCents={totalCents} currency={currency} />,
      );
    }
    if (footerKpis.average) {
      footerKpiNodes.push(
        <MiniKpiCard key="average" label="Average" amountCents={avgCents} currency={currency} />,
      );
    }
  }

  return (
    <SectionCard
      key={`${widget.id}-collapsed-${widget.defaultCollapsed === true ? '1' : '0'}`}
      className="dashboard-widget"
      title={widget.name || 'Widget'}
      titleAddon={<WidgetTitleAddon sortAddon={null} controls={controls} />}
      collapsible
      defaultCollapsed={widget.defaultCollapsed === true}
      footer={footerKpiNodes.length > 0 ? <>{footerKpiNodes}</> : null}
    >
      <AsyncContent loading={loading} error={error}>
        {rows.length === 0 ? (
          <EmptyState message="No operations for this period." />
        ) : (
          <TableBlockSticky>
            <table className="table-compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Label</th>
                  <th className="u-text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((op) => (
                  <tr
                    key={op.id}
                    className="u-cursor-pointer"
                    onClick={() => navigate(buildOperationsUrl({ start: monthStart, end: monthEnd, q: op.label }))}
                  >
                    <td className="ops-widget-date">{formatDate(op.date)}</td>
                    <td className="ops-widget-label">{op.label}</td>
                    <td className="u-text-right">
                      <OperationAmountCell amount={op.amount} currency={op.currency || currency} type={op.type} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableBlockSticky>
        )}
      </AsyncContent>
    </SectionCard>
  );
}

function RevenueWidgetContent({ widget, month, controls }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState('amount');
  const currency = DEFAULT_CURRENCY;
  const { start: monthStart, end: monthEnd } = getMonthRange(month);

  const fetchFn = useCallback(() => getMonthlyReport(month), [month]);
  const { data: report, loading, error } = useData(fetchFn, ['operations.csv', 'budget_plans.csv']);

  const incomeCategories = report?.income_by_category || [];
  const totalIncome = report?.total_income || 0;

  const sorted = [...incomeCategories].sort((a, b) =>
    sort === 'amount'
      ? (b.amount || 0) - (a.amount || 0)
      : (a.category_name || '').localeCompare(b.category_name || ''),
  );

  const footerKpis = mergeOpsFooterKpis(widget);
  const categoryCount = incomeCategories.length;
  const avgIncomePerCategoryCents =
    categoryCount > 0 ? Math.round(totalIncome / categoryCount) : 0;
  const revenueFooterNodes = [];
  if (categoryCount > 0) {
    if (footerKpis.total) {
      revenueFooterNodes.push(
        <MiniKpiCard key="total" label="Total" amountCents={totalIncome} currency={currency} />,
      );
    }
    if (footerKpis.average) {
      revenueFooterNodes.push(
        <MiniKpiCard
          key="average"
          label="Average"
          amountCents={avgIncomePerCategoryCents}
          currency={currency}
          title="Average per income category in this list"
        />,
      );
    }
  }

  const showSort = widget.showSort !== false;
  const sortAddon =
    showSort && incomeCategories.length > 0 ? (
      <Button
        variant="ghost"
        size="sm"
        icon
        type="button"
        title={sort === 'amount' ? 'Sort by name' : 'Sort by amount'}
        onClick={() => setSort((s) => (s === 'amount' ? 'name' : 'amount'))}
      >
        {sort === 'name' ? <LuArrowDownNarrowWide size={16} aria-hidden /> : <LuArrowDownWideNarrow size={16} aria-hidden />}
      </Button>
    ) : null;

  return (
    <SectionCard
      key={`${widget.id}-collapsed-${widget.defaultCollapsed === true ? '1' : '0'}`}
      className="dashboard-widget"
      title={widget.name || 'Revenue'}
      titleAddon={<WidgetTitleAddon sortAddon={sortAddon} controls={controls} />}
      collapsible
      defaultCollapsed={widget.defaultCollapsed === true}
      footer={revenueFooterNodes.length > 0 ? <>{revenueFooterNodes}</> : null}
    >
      <AsyncContent loading={loading} error={error}>
        {incomeCategories.length === 0 ? (
          <EmptyState message="No income this month." />
        ) : (
          <CategoryAmountTable
            embedded
            hideHeader
            rows={sorted}
            currency={currency}
            onRowClick={(row) =>
              navigate(buildOperationsUrl({ start: monthStart, end: monthEnd, category: row.category_id, type: 'income' }))
            }
          />
        )}
      </AsyncContent>
    </SectionCard>
  );
}

function NonBudgetWidgetContent({ widget, month, controls }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState('amount');
  const currency = DEFAULT_CURRENCY;
  const { start: monthStart, end: monthEnd } = getMonthRange(month);

  const fetchFn = useCallback(() => getMonthlyReport(month), [month]);
  const { data: report, loading, error } = useData(fetchFn, ['operations.csv', 'budgets.csv', 'budget_plans.csv']);

  const allExpenses = report?.expenses_by_category || [];
  const budgetedIds = new Set((report?.budget_vs_actual || []).map((b) => b.category_id));
  const unbudgeted = allExpenses.filter((c) => !budgetedIds.has(c.category_id));
  const total = unbudgeted.reduce((s, c) => s + (c.amount || 0), 0);

  const sorted = [...unbudgeted].sort((a, b) =>
    sort === 'amount'
      ? (b.amount || 0) - (a.amount || 0)
      : (a.category_name || '').localeCompare(b.category_name || ''),
  );

  const showSort = widget.showSort !== false;
  const sortAddon =
    showSort && unbudgeted.length > 0 ? (
      <Button
        variant="ghost"
        size="sm"
        icon
        type="button"
        title={sort === 'amount' ? 'Sort by name' : 'Sort by amount'}
        onClick={() => setSort((s) => (s === 'amount' ? 'name' : 'amount'))}
      >
        {sort === 'name' ? <LuArrowDownNarrowWide size={16} aria-hidden /> : <LuArrowDownWideNarrow size={16} aria-hidden />}
      </Button>
    ) : null;

  return (
    <SectionCard
      key={`${widget.id}-collapsed-${widget.defaultCollapsed === true ? '1' : '0'}`}
      className="dashboard-widget"
      title={widget.name || 'Non-budget'}
      titleAddon={<WidgetTitleAddon sortAddon={sortAddon} controls={controls} />}
      collapsible
      defaultCollapsed={widget.defaultCollapsed === true}
      footer={<MiniKpiCard label="Total" amountCents={total} currency={currency} />}
    >
      <AsyncContent loading={loading} error={error}>
        {unbudgeted.length === 0 ? (
          <EmptyState message="No non-budget spending this month." />
        ) : (
          <CategoryAmountTable
            embedded
            hideHeader
            rows={sorted}
            currency={currency}
            onRowClick={(row) =>
              navigate(buildOperationsUrl({ start: monthStart, end: monthEnd, category: row.category_id }))
            }
          />
        )}
      </AsyncContent>
    </SectionCard>
  );
}

export default function WidgetCard({
  widget,
  month,
  allPlans,
  isLayoutEditing,
  onConfigure,
}) {
  const controls = isLayoutEditing ? <WidgetConfigureControl onConfigure={onConfigure} /> : null;

  if (widget.source === 'revenue')    return <RevenueWidgetContent    widget={widget} month={month} controls={controls} />;
  if (widget.source === 'non_budget') return <NonBudgetWidgetContent  widget={widget} month={month} controls={controls} />;
  if (widget.source === 'operations') return <OperationsWidgetContent widget={widget} month={month} controls={controls} />;
  return <BudgetWidgetContent widget={widget} month={month} allPlans={allPlans} controls={controls} />;
}
