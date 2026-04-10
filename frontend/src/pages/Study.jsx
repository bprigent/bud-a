import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getOperations, getCategories, getBudgets, getBudgetPlans, getMembers } from '../api';
import { useData } from '../hooks/useData';
import { usePrivacy } from '../contexts/PrivacyContext';
import { formatCurrency, toYMD, getMonthEnd, getMonthRange, shortMonthLabel } from '../utils/format';
import { buildOperationsUrl } from '../utils/operationsUrl';
import { DEFAULT_CURRENCY } from '../config';
import Redacted from '../components/Redacted';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import Select from '../components/Select';
import MiniKpiCard from '../components/MiniKpiCard';
import SectionCard from '../components/SectionCard';
import EmojiPixel from '../components/EmojiPixel';
import { FiTrendingUp, FiTarget, FiMaximize2 } from 'react-icons/fi';
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  ComposedChart,
} from 'recharts';
import { PageRoot } from './PageRoot.styled';
import { memberColor, memberFilterSelectOptions } from '../utils/memberSelectOptions';

const ALLOWED_MONTH_COUNTS = new Set([2, 3, 4, 5, 6]);
const DEFAULT_STUDY_MONTHS = 2;

/** Recharts `ResponsiveContainer` height for category bar charts (was 160px; +25%). */
const STUDY_CATEGORY_CHART_HEIGHT_PX = 200;

/** Absent `plans` = all named plans; `plans=` (empty) = none; `plans=id1,id2` = subset. Invalid ids → all. */
function planSelectionFromParams(params, allIds) {
  if (allIds.length === 0) return null;
  const raw = params.get('plans');
  if (raw === null) return new Set(allIds);
  const trimmed = raw.trim();
  if (trimmed === '') return new Set();
  const valid = trimmed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((id) => allIds.includes(id));
  if (valid.length === 0) return new Set(allIds);
  return new Set(valid);
}

function rangeFromMonths(numMonths) {
  const now = new Date();
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startMonth = new Date(now.getFullYear(), now.getMonth() - (numMonths - 1), 1);
  return { start: toYMD(startMonth), end: toYMD(endMonth) };
}

function StudyKpiIconAvg() {
  return <FiTrendingUp className="mini-kpi-svg" size={11} aria-hidden />;
}

function StudyKpiIconBudget() {
  return <FiTarget className="mini-kpi-svg" size={11} aria-hidden />;
}

function StudyKpiIconGap() {
  return <FiMaximize2 className="mini-kpi-svg" size={11} aria-hidden />;
}

function StackedTooltip({ active, payload, label, memberMap }) {
  if (!active || !payload?.length) return null;
  const budget = payload.find((p) => p.dataKey === 'budget');
  const memberBars = payload.filter((p) => p.dataKey !== 'budget' && p.value > 0);
  const total = memberBars.reduce((s, p) => s + p.value, 0);
  return (
    <div className="study-tooltip">
      <div className="study-tooltip-title">{label}</div>
      {memberBars.map((p) => (
        <div key={p.dataKey} className="study-tooltip-member" style={{ '--member-color': p.fill }}>
          {memberMap[p.dataKey] || p.dataKey}: <Redacted>{formatCurrency(p.value, DEFAULT_CURRENCY)}</Redacted>
        </div>
      ))}
      {memberBars.length > 1 && (
        <div className="study-tooltip-value">Total: <Redacted>{formatCurrency(total, DEFAULT_CURRENCY)}</Redacted></div>
      )}
      {budget && budget.value > 0 && (
        <div className="study-tooltip-budget">Budget: <Redacted>{formatCurrency(budget.value, DEFAULT_CURRENCY)}</Redacted></div>
      )}
    </div>
  );
}

function RedactedYTick({ x, y, payload, tickFormatter }) {
  const privacyMode = usePrivacy();
  const label = tickFormatter ? tickFormatter(payload.value) : payload.value;
  if (!label) return null;
  if (privacyMode) {
    return <rect x={x - 32} y={y - 5} width={28} height={10} rx={5} fill="var(--color-neutral-600, #555)" />;
  }
  return (
    <text x={x} y={y} textAnchor="end" fill="var(--text-secondary)" fontSize={11} dominantBaseline="central">
      {label}
    </text>
  );
}

function CategoryChart({ name, emoji, dataByMember, allMonths, catId, onBarClick, budgetByMonth, memberList, memberMap }) {
  const hasBudget = budgetByMonth && Object.values(budgetByMonth).some((v) => v > 0);

  const chartData = allMonths.map((m) => {
    const point = { month: shortMonthLabel(m), monthKey: m };
    for (const mem of memberList) {
      point[mem.id] = dataByMember[mem.id]?.[m] || 0;
    }
    if (hasBudget) point.budget = budgetByMonth[m] || 0;
    return point;
  });

  const maxVal = Math.max(...chartData.map((d) => {
    const memberTotal = memberList.reduce((s, mem) => s + (d[mem.id] || 0), 0);
    return Math.max(memberTotal, d.budget || 0);
  }), 0);
  const avg = chartData.length
    ? chartData.reduce((s, d) => s + memberList.reduce((ms, mem) => ms + (d[mem.id] || 0), 0), 0) / chartData.length
    : 0;
  const budgetMonthValues = hasBudget
    ? allMonths.map((m) => budgetByMonth[m] || 0).filter((v) => v > 0)
    : [];
  const budgetAvgCents = budgetMonthValues.length
    ? Math.round(budgetMonthValues.reduce((a, b) => a + b, 0) / budgetMonthValues.length)
    : 0;

  let totalGapVsBudgetCents = 0;
  if (hasBudget && budgetByMonth) {
    for (const m of allMonths) {
      const budgetCents = budgetByMonth[m] || 0;
      if (budgetCents <= 0) continue;
      const actual = memberList.reduce(
        (s, mem) => s + (dataByMember[mem.id]?.[m] || 0),
        0,
      );
      totalGapVsBudgetCents += actual - budgetCents;
    }
  }

  const titleNode = (
    <>
      {emoji?.trim() ? (
        <EmojiPixel size="2" aria-hidden className="study-category-card__emoji">
          {emoji.trim()}
        </EmojiPixel>
      ) : null}
      {name}
    </>
  );

  return (
    <SectionCard
      id={`study-cat-${catId}`}
      className="study-category-card"
      titleAs="h3"
      title={titleNode}
      headerExtra={
        <>
          <MiniKpiCard icon={<StudyKpiIconAvg />} label="Avg / mo" amountCents={Math.round(avg)} currency={DEFAULT_CURRENCY} />
          {hasBudget && budgetAvgCents > 0 && (
            <>
              <MiniKpiCard icon={<StudyKpiIconBudget />} label="Budget" amountCents={budgetAvgCents} currency={DEFAULT_CURRENCY} />
              <MiniKpiCard
                icon={<StudyKpiIconGap />}
                label="Gap"
                amountCents={totalGapVsBudgetCents}
                currency={DEFAULT_CURRENCY}
                amountTone={totalGapVsBudgetCents > 0 ? 'bad' : totalGapVsBudgetCents < 0 ? 'good' : undefined}
                title="Sum of (spend − budget) for each month with a budget—positive is over budget for the period, negative is under"
              />
            </>
          )}
        </>
      }
    >
      <ResponsiveContainer width="100%" height={STUDY_CATEGORY_CHART_HEIGHT_PX}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={<RedactedYTick tickFormatter={(v) => v >= 100 ? `${(v / 100).toFixed(0)}` : ''} />}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[0, maxVal > 0 ? 'auto' : 100]}
          />
          <Tooltip
            content={<StackedTooltip memberMap={memberMap} />}
            cursor={{ fill: 'var(--hover-bg, rgba(0,0,0,0.04))' }}
          />
          {memberList.map((mem, i) => (
            <Bar
              key={mem.id}
              dataKey={mem.id}
              stackId="members"
              fill={memberColor(mem, i)}
              maxBarSize={48}
              cursor="pointer"
              radius={i === memberList.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              onClick={(barData) => onBarClick(catId, barData.monthKey, mem.id)}
            />
          ))}
          {hasBudget && (
            <Line
              dataKey="budget"
              stroke="var(--danger)"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}

export default function Study() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const monthCount = useMemo(() => {
    const raw = searchParams.get('months');
    if (raw == null || raw === '') return DEFAULT_STUDY_MONTHS;
    const n = parseInt(raw, 10);
    return ALLOWED_MONTH_COUNTS.has(n) ? n : DEFAULT_STUDY_MONTHS;
  }, [searchParams]);

  const { start: startDate, end: endDate } = useMemo(() => rangeFromMonths(monthCount), [monthCount]);

  const setMonthCount = useCallback((n) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (n === DEFAULT_STUDY_MONTHS) next.delete('months');
      else next.set('months', String(n));
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  /** Categories with spend but no budget in selected plans (URL: other=0 to hide) */
  const showOtherCategories = searchParams.get('other') !== '0';

  const setShowOtherCategories = useCallback((checked) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (checked) next.delete('other');
      else next.set('other', '0');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const { data: budgetPlans } = useData(getBudgetPlans, 'budget_plans.csv');
  const fetchAllBudgets = useCallback(() => getBudgets({ all_plans: true }), []);
  const { data: budgets } = useData(fetchAllBudgets, ['budgets.csv', 'budget_plans.csv']);

  /** null = no named plans in data; Set = selected plan ids (empty = none — show only non-budgeted when that toggle is on) */
  const enabledPlanIds = useMemo(() => {
    const allIds = (budgetPlans || []).map((p) => p.id);
    return planSelectionFromParams(searchParams, allIds);
  }, [searchParams, budgetPlans]);

  const setPlanInFilter = useCallback(
    (planId, checked) => {
      const allIds = (budgetPlans || []).map((p) => p.id);
      if (allIds.length === 0) return;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          let cur = planSelectionFromParams(next, allIds);
          if (cur == null) return next;
          if (checked) cur.add(planId);
          else cur.delete(planId);
          if (cur.size === allIds.length) next.delete('plans');
          else if (cur.size === 0) next.set('plans', '');
          else next.set('plans', [...cur].join(','));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams, budgetPlans],
  );

  const handleBarClick = (catId, monthKey, memberId) => {
    const { start, end } = getMonthRange(monthKey);
    navigate(buildOperationsUrl({ start, end, category: catId, type: 'expense', member: memberId }));
  };

  const fetchOps = useCallback(
    () => getOperations({ start_date: startDate, end_date: endDate }),
    [startDate, endDate],
  );
  const { data: operations, loading, error } = useData(fetchOps, 'operations.csv');
  const { data: categories } = useData(getCategories, 'categories.csv');
  const { data: members } = useData(getMembers, 'members.csv');

  const memberList = useMemo(() => members || [], [members]);

  const memberViewId = useMemo(() => {
    const raw = searchParams.get('member') || 'all';
    if (raw === 'all') return 'all';
    if (memberList.some((m) => m.id === raw)) return raw;
    return 'all';
  }, [searchParams, memberList]);

  const setMemberViewId = useCallback((id) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (id === 'all') next.delete('member');
      else next.set('member', id);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const chartMembers = useMemo(() => {
    if (memberList.length <= 1) return memberList;
    if (memberViewId === 'all') return memberList;
    return memberList.filter((m) => m.id === memberViewId);
  }, [memberList, memberViewId]);

  const memberSelectOptions = useMemo(
    () => memberFilterSelectOptions(memberList, { allValue: 'all', allLabel: 'Everyone' }),
    [memberList],
  );
  const memberMap = useMemo(() => {
    const m = {};
    (members || []).forEach((mem) => { m[mem.id] = mem.first_name; });
    return m;
  }, [members]);

  const catMap = useMemo(() => {
    const m = {};
    (categories || []).forEach((c) => { m[c.id] = c; });
    return m;
  }, [categories]);

  // Build monthly spend per category per member + ordered month list
  const { categoryData, allMonths } = useMemo(() => {
    const monthSet = new Set();
    // byCat[catId][memberId][monthKey] = amount (expenses + categorized transfers — same as monthly report)
    const byCat = {};

    const addToMonth = (categoryId, memberId, monthKey, amt) => {
      if (!categoryId || !monthKey) return;
      monthSet.add(monthKey);
      if (!byCat[categoryId]) byCat[categoryId] = {};
      if (!byCat[categoryId][memberId]) byCat[categoryId][memberId] = {};
      byCat[categoryId][memberId][monthKey] = (byCat[categoryId][memberId][monthKey] || 0) + amt;
    };

    for (const op of (operations || [])) {
      const amt = parseInt(op.amount, 10) || 0;
      if (amt <= 0) continue;
      const monthKey = op.date?.slice(0, 7);
      if (!monthKey) continue;

      if (op.type === 'expense') {
        addToMonth(op.category_id, op.member_id, monthKey, amt);
      } else if (op.type === 'money_movement') {
        const cid = (op.category_id || '').trim();
        if (!cid) continue;
        // Transfers with a category fund savings goals — included in plan actuals on the dashboard
        addToMonth(cid, op.member_id, monthKey, amt);
      }
    }

    const months = [...monthSet].sort();

    // Sort categories by total spend descending
    const entries = Object.entries(byCat).map(([catId, byMember]) => {
      const total = Object.values(byMember).reduce(
        (s, memberMonths) => s + Object.values(memberMonths).reduce((ms, v) => ms + v, 0), 0
      );
      return { catId, dataByMember: byMember, total };
    });
    entries.sort((a, b) => b.total - a.total);

    return { categoryData: entries, allMonths: months };
  }, [operations]);

  // Monthly budget amounts per category/month — only selected named plans; sum if a category appears in more than one
  const budgetMap = useMemo(() => {
    if (!budgets || allMonths.length === 0) return {};
    const map = {};
    for (const b of budgets) {
      if (enabledPlanIds != null && !enabledPlanIds.has(b.budget_plan_id)) continue;
      if (b.period !== 'monthly') continue;
      const amt = parseInt(b.amount, 10) || 0;
      if (amt <= 0) continue;
      for (const monthKey of allMonths) {
        const monthStart = `${monthKey}-01`;
        const monthEnd = getMonthEnd(monthKey);
        if (b.start_date && b.start_date > monthEnd) continue;
        if (b.end_date && b.end_date < monthStart) continue;
        if (!map[b.category_id]) map[b.category_id] = {};
        map[b.category_id][monthKey] = (map[b.category_id][monthKey] || 0) + amt;
      }
    }
    return map;
  }, [budgets, allMonths, enabledPlanIds]);

  const filteredCategoryData = useMemo(() => {
    if (!budgetPlans || budgetPlans.length === 0) return categoryData;
    return categoryData.filter(({ catId }) => {
      const m = budgetMap[catId];
      const hasBudgetInSelection = m && Object.values(m).some((v) => v > 0);
      return hasBudgetInSelection || showOtherCategories;
    });
  }, [categoryData, budgetPlans, budgetMap, showOtherCategories]);

  const scrollToCategory = useCallback((catId) => {
    const el = document.getElementById(`study-cat-${catId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <PageRoot className="page page--full-width page--study">
      <PageHeader
        title="Study"
        subtitle="Category spending over time—filters, quick navigation, and charts."
      />
      <PageMain fill>
      <div className="study-layout">
        <aside className="study-sidebar" aria-label="Filters, member colors, and category navigation">
          <div className="study-sidebar__scroll">
          <div className="study-sidebar-section">
            <div className="study-sidebar-label" id="study-label-budget">
              Budgets
            </div>
            {budgetPlans && budgetPlans.length > 0 ? (
              <div
                className="study-plan-checks"
                role="group"
                aria-labelledby="study-label-budget"
              >
                {budgetPlans.map((p) => (
                  <label key={p.id} className="study-checkbox-label">
                    <input
                      type="checkbox"
                      checked={enabledPlanIds == null || enabledPlanIds.has(p.id)}
                      onChange={(e) => setPlanInFilter(p.id, e.target.checked)}
                    />
                    <span>{p.name}</span>
                  </label>
                ))}
                <label className="study-checkbox-label">
                  <input
                    type="checkbox"
                    checked={showOtherCategories}
                    onChange={(e) => setShowOtherCategories(e.target.checked)}
                  />
                  <span>Non budgeted</span>
                </label>
              </div>
            ) : (
              <p className="study-sidebar-empty">No named budgets yet. Create them on the Budgets page.</p>
            )}
          </div>
          <div className="study-sidebar-section">
            <Select
              id="study-period-select"
              className="study-sidebar-select"
              label="Period"
              value={String(monthCount)}
              onChange={(v) => setMonthCount(parseInt(v, 10))}
              options={[
                { value: '2', label: '2 months' },
                { value: '3', label: '3 months' },
                { value: '4', label: '4 months' },
                { value: '5', label: '5 months' },
                { value: '6', label: '6 months' },
              ]}
            />
          </div>
          {memberList.length > 1 && !loading && !error && (
            <div className="study-sidebar-section">
              <Select
                id="study-members-select"
                className="study-sidebar-select"
                label="Members"
                value={memberViewId}
                onChange={setMemberViewId}
                options={memberSelectOptions}
              />
            </div>
          )}
          <div className="study-sidebar-section">
            <div className="study-sidebar-label" id="study-label-jump">
              Jump to
            </div>
            <nav className="study-jump-nav" aria-labelledby="study-label-jump">
              {filteredCategoryData.length === 0 ? (
                <p className="study-sidebar-empty">No categories in this view.</p>
              ) : (
                <ul className="study-jump-list">
                  {filteredCategoryData.map(({ catId }) => {
                    const cat = catMap[catId] || {};
                    return (
                      <li key={catId}>
                        <button
                          type="button"
                          className="study-jump-link"
                          onClick={() => scrollToCategory(catId)}
                        >
                          {cat.emoji?.trim() ? (
                            <>
                              <EmojiPixel size="1" aria-hidden>
                                {cat.emoji.trim()}
                              </EmojiPixel>{' '}
                            </>
                          ) : null}
                          {cat.name || catId}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </nav>
          </div>
          </div>
        </aside>

        <div className="study-main">
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">Error: {error}</div>}

          {!loading && !error && categoryData.length === 0 && (
            <div className="card"><p className="empty">No spending or categorized transfers in this date range.</p></div>
          )}

          {!loading && !error && categoryData.length > 0 && filteredCategoryData.length === 0 && (
            <div className="card">
              <p className="empty">No categories match the filters. Turn on &quot;Non budgeted&quot; or select more plans.</p>
            </div>
          )}

          {!loading && !error && filteredCategoryData.length > 0 && (
            <>
              <div className="study-grid">
                {filteredCategoryData.map(({ catId, dataByMember }) => {
                  const cat = catMap[catId] || {};
                  return (
                    <CategoryChart
                      key={catId}
                      name={cat.name || catId}
                      emoji={cat.emoji || ''}
                      dataByMember={dataByMember}
                      allMonths={allMonths}
                      catId={catId}
                      onBarClick={handleBarClick}
                      budgetByMonth={budgetMap[catId]}
                      memberList={chartMembers}
                      memberMap={memberMap}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      </PageMain>
    </PageRoot>
  );
}
