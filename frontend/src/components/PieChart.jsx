import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatCurrency } from '../utils/format';
import { DEFAULT_CURRENCY } from '../config';
import { PIE_CHART_COLORS } from '../utils/pieChartColors';
import Redacted from './Redacted';

/** Truncate long category names so outside labels stay readable. */
function truncatePieLabel(name, maxLen = 16) {
  const s = String(name ?? '');
  if (s.length <= maxLen) return s;
  return `${s.slice(0, maxLen - 1)}…`;
}

/**
 * Outside slice labels (name + %). Uses x/y/textAnchor from Recharts so
 * connector lines match the text position.
 */
function PieSliceLabel(props) {
  const { x, y, textAnchor, name, percent } = props;
  if (percent == null) return null;
  const pct = Math.round(percent * 100);
  const text = `${truncatePieLabel(name)} · ${pct}%`;
  return (
    <text
      x={x}
      y={y}
      fill="var(--text)"
      className="pie-chart-slice-label"
      textAnchor={textAnchor}
      dominantBaseline="central"
    >
      {text}
    </text>
  );
}

function BudgetTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const value = row.value;
  const name = row.name;
  return (
    <div className="pie-chart-tooltip">
      <div className="pie-chart-tooltip-title">{name}</div>
      <div className="pie-chart-tooltip-value"><Redacted>{formatCurrency(value, currency)}</Redacted></div>
    </div>
  );
}

export default function PieChart({
  items,
  currency = DEFAULT_CURRENCY,
  showLegend = true,
  showSliceLabels = true,
}) {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  if (total === 0) return null;

  const data = items.map((item, i) => ({
    name: item.label,
    value: item.value,
    fill: item.fill ?? PIE_CHART_COLORS[i % PIE_CHART_COLORS.length],
  }));

  return (
    <div className={`pie-chart-container${showLegend ? '' : ' pie-chart-container--solo'}`}>
      <div className="pie-chart-svg-wrap">
        <ResponsiveContainer
          width="100%"
          height={showLegend ? 280 : '100%'}
          minHeight={showLegend ? 280 : 300}
          minWidth={280}
        >
          <RechartsPieChart margin={{ top: 28, right: 32, bottom: 28, left: 32 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={showLegend ? 110 : '48%'}
              innerRadius={0}
              paddingAngle={0}
              stroke="#ffffff"
              strokeWidth={2}
              isAnimationActive={false}
              label={showSliceLabels ? PieSliceLabel : false}
              labelLine={
                showSliceLabels
                  ? { stroke: 'var(--color-border)', strokeWidth: 1 }
                  : false
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={(props) => <BudgetTooltip {...props} currency={currency} />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      {showLegend && (
        <div className="pie-legend">
          {data.map((row, i) => {
            const pct = row.value / total;
            return (
              <div key={`${row.name}-${i}`} className="pie-legend-item">
                <span className="pie-legend-color" style={{ '--legend-color': row.fill }} />
                <span className="pie-legend-label">{row.name}</span>
                <span className="pie-legend-value">
                  <Redacted>{formatCurrency(row.value, currency)} ({Math.round(pct * 100)}%)</Redacted>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
