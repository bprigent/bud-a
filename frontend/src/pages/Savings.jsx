import { useState, useMemo, useCallback } from 'react';
import { getMembers, getSavingsHistory } from '../api';
import { useData } from '../hooks/useData';
import { formatCurrency, matchDateRangePreset } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import { usePrivacy } from '../contexts/PrivacyContext';
import { PIE_CHART_COLORS } from '../utils/pieChartColors';
import AsyncContent from '../components/AsyncContent';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import PageSubHeader from '../components/PageSubHeader';
import Select from '../components/Select';
import { operationsAccountFilterLabel } from '../utils/accountLabels';
import DateRangePicker from '../components/DateRangePicker';
import MiniKpiCard from '../components/MiniKpiCard';
import Redacted from '../components/Redacted';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { PageRoot } from './PageRoot.styled';

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DATE_PRESETS = [
  { id: 'all_time', label: 'All time' },
  { id: 'this_and_last_month', label: 'This and last month' },
  { id: 'this_month', label: 'This month' },
  { id: 'last_month', label: 'Last month' },
];
const DATE_PRESET_LABELS = Object.fromEntries(DATE_PRESETS.map((p) => [p.id, p.label]));

/** Sentinel value for the "All accounts" row in the account filter (multi-select). */
const SAVINGS_ALL_ACCOUNTS_VALUE = '__all_accounts__';

/** Tick label: "Jan 26", "Feb 26", etc. Show only on month boundaries. */
function weekTickFormatter(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const day = parseInt(d, 10);
  if (day > 7) return '';
  return `${SHORT_MONTHS[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

/** Tooltip header: "Jan 6 – 12, 2026" */
function weekRangeLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const sun = new Date(d);
  sun.setDate(d.getDate() + 6);
  const mo = SHORT_MONTHS[d.getMonth()];
  if (d.getMonth() === sun.getMonth()) {
    return `${mo} ${d.getDate()} – ${sun.getDate()}, ${d.getFullYear()}`;
  }
  return `${mo} ${d.getDate()} – ${SHORT_MONTHS[sun.getMonth()]} ${sun.getDate()}, ${sun.getFullYear()}`;
}

/** Format a date string as "Jan 6, 2026" */
function shortDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${SHORT_MONTHS[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

function SavingsTooltip({ active, payload, privacyMode, accountMap, colorMap }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const entries = [...payload].reverse();
  const total = entries.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="savings-tooltip">
      <span className="savings-tooltip-month">{weekRangeLabel(d.date)}</span>
      {entries.map((p) => (
        <span key={p.dataKey} className="savings-tooltip-row">
          <span className="savings-tooltip-dot" style={{ '--dot-color': colorMap[p.dataKey] }} />
          <span className="savings-tooltip-acct">{accountMap[p.dataKey] || p.dataKey}</span>
          <span className="savings-tooltip-value">
            {privacyMode ? '***' : formatCurrency(p.value * 100, DEFAULT_CURRENCY)}
          </span>
        </span>
      ))}
      {entries.length > 1 && (
        <span className="savings-tooltip-row savings-tooltip-total">
          <span>Total</span>
          <span className="savings-tooltip-value">
            {privacyMode ? '***' : formatCurrency(total * 100, DEFAULT_CURRENCY)}
          </span>
        </span>
      )}
    </div>
  );
}

export default function Savings() {
  const { data, loading, error } = useData(getSavingsHistory, ['accounts.csv', 'operations.csv']);
  const { data: members } = useData(getMembers, 'members.csv');
  const privacyMode = usePrivacy();

  const accounts = data?.accounts || [];
  const allIds = useMemo(() => accounts.map((a) => a.id), [accounts]);
  const [selectedIds, setSelectedIds] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const activeIds = selectedIds === null ? allIds : selectedIds;

  const accountMap = useMemo(() => {
    const m = {};
    accounts.forEach((a) => { m[a.id] = operationsAccountFilterLabel(a, members); });
    return m;
  }, [accounts, members]);

  const colorMap = useMemo(() => {
    const m = {};
    accounts.forEach((a, i) => { m[a.id] = PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]; });
    return m;
  }, [accounts]);

  const selectOptions = useMemo(
    () => [
      { value: SAVINGS_ALL_ACCOUNTS_VALUE, label: 'All accounts' },
      ...accounts.map((a) => ({
        value: a.id,
        label: operationsAccountFilterLabel(a, members),
      })),
    ],
    [accounts, members],
  );

  const handleAccountFilterChange = useCallback(
    (next) => {
      const hasAllToken = next.includes(SAVINGS_ALL_ACCOUNTS_VALUE);
      const ids = next.filter((id) => id !== SAVINGS_ALL_ACCOUNTS_VALUE);

      if (hasAllToken) {
        setSelectedIds(null);
        return;
      }
      if (ids.length === allIds.length) {
        setSelectedIds(null);
        return;
      }
      setSelectedIds(ids);
    },
    [allIds],
  );

  const accountFilterMultiIsSelected = useCallback(
    (optValue) => {
      if (optValue === SAVINGS_ALL_ACCOUNTS_VALUE) {
        if (selectedIds === null) return true;
        return Array.isArray(selectedIds) && selectedIds.length === allIds.length && allIds.length > 0;
      }
      if (selectedIds === null) return allIds.includes(optValue);
      return Array.isArray(selectedIds) && selectedIds.includes(optValue);
    },
    [selectedIds, allIds],
  );

  // All points (unfiltered by date) for account totals
  const allPoints = data?.points || [];

  // Filter chart data by date range
  const chartData = useMemo(() => {
    let points = allPoints;
    if (startDate) points = points.filter((p) => p.date >= startDate);
    if (endDate) points = points.filter((p) => p.date <= endDate);
    return points.map((p) => {
      const row = { date: p.date };
      for (const id of activeIds) {
        row[id] = (p[id] || 0) / 100;
      }
      return row;
    });
  }, [allPoints, activeIds, startDate, endDate]);

  // Start and end totals for the visible range (in cents)
  const { rangeStart, rangeEnd, rangeDelta } = useMemo(() => {
    if (chartData.length === 0) return { rangeStart: 0, rangeEnd: 0, rangeDelta: 0 };
    const firstPt = allPoints.find((p) => {
      if (startDate && p.date < startDate) return false;
      if (endDate && p.date > endDate) return false;
      return true;
    });
    const filtered = allPoints.filter((p) => {
      if (startDate && p.date < startDate) return false;
      if (endDate && p.date > endDate) return false;
      return true;
    });
    const lastPt = filtered.length > 0 ? filtered[filtered.length - 1] : null;
    const s = firstPt ? activeIds.reduce((sum, id) => sum + (firstPt[id] || 0), 0) : 0;
    const e = lastPt ? activeIds.reduce((sum, id) => sum + (lastPt[id] || 0), 0) : 0;
    return { rangeStart: s, rangeEnd: e, rangeDelta: e - s };
  }, [allPoints, activeIds, startDate, endDate, chartData.length]);

  const handleDateRangeChange = (s, e) => {
    setStartDate(s);
    setEndDate(e);
  };

  const dateRangeTriggerLabel = useMemo(() => {
    if (!startDate && !endDate) return '';
    const m = matchDateRangePreset(startDate, endDate);
    if (m) return DATE_PRESET_LABELS[m];
    if (startDate && endDate) return `${shortDateLabel(startDate)} – ${shortDateLabel(endDate)}`;
    return '';
  }, [startDate, endDate]);

  const displayValue = activeIds.length === allIds.length ? 'All accounts' : undefined;

  return (
    <PageRoot className="page page--full-width page--savings">
      <PageHeader
        title="Accounts"
        subtitle="Track your total wealth over time."
        withSubHeader
      />
      <PageSubHeader
        className="savings-sub-header"
        trailing={
          <div className="savings-kpi-row">
            <MiniKpiCard
              label="Start"
              amountCents={rangeStart}
              currency={DEFAULT_CURRENCY}
              title={chartData.length > 0 ? shortDateLabel(chartData[0].date) : undefined}
            />
            <MiniKpiCard
              label="End"
              amountCents={rangeEnd}
              currency={DEFAULT_CURRENCY}
              title={chartData.length > 0 ? shortDateLabel(chartData[chartData.length - 1].date) : undefined}
            />
            <MiniKpiCard
              label="Change"
              amountCents={rangeDelta}
              currency={DEFAULT_CURRENCY}
              amountTone={rangeDelta >= 0 ? 'good' : 'bad'}
            />
          </div>
        }
      >
        <div className="savings-header-filters">
          <DateRangePicker
            className="savings-date-filter select-wrap"
            start={startDate}
            end={endDate}
            onRangeChange={handleDateRangeChange}
            presets={DATE_PRESETS}
            triggerLabel={dateRangeTriggerLabel}
            placeholder="All time"
          />
          {accounts.length > 0 && (
            <Select
              multi
              options={selectOptions}
              value={activeIds}
              onChange={handleAccountFilterChange}
              multiIsSelected={accountFilterMultiIsSelected}
              placeholder="All accounts"
              displayValue={displayValue}
              searchable
              className="savings-account-filter"
              dropdownClassName="select-dropdown-wide savings-account-filter__dropdown"
            />
          )}
        </div>
      </PageSubHeader>
      <PageMain fill>
        <AsyncContent loading={loading} error={error}>

          {chartData.length === 0 || activeIds.length === 0 ? (
            <p className="u-muted savings-empty">
              {accounts.length === 0
                ? 'No savings accounts found. Mark accounts as savings in Settings.'
                : 'No accounts selected.'}
            </p>
          ) : (
            <div className="savings-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 16, right: 24, bottom: 8, left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e2e8f0)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={weekTickFormatter}
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted, #94a3b8)' }}
                    axisLine={{ stroke: 'var(--color-border, #e2e8f0)' }}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(v) => privacyMode ? '***' : formatCurrency(v * 100, DEFAULT_CURRENCY)}
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted, #94a3b8)' }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    content={<SavingsTooltip privacyMode={privacyMode} accountMap={accountMap} colorMap={colorMap} />}
                  />
                  {activeIds.map((id) => (
                    <Area
                      key={id}
                      type="monotone"
                      dataKey={id}
                      stackId="savings"
                      stroke={colorMap[id]}
                      fill={colorMap[id]}
                      fillOpacity={0.35}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </AsyncContent>
      </PageMain>
    </PageRoot>
  );
}
