import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getOperations, deleteOperation, getCategories, getMembers, getAccounts, createMatchingRule } from '../api';
import { useData } from '../hooks/useData';
import {
  matchDateRangePreset,
  thisAndLastMonthDateRange,
} from '../utils/format';
import { parseOperationsSearchQuery, operationMatchesSearch } from '../utils/operationsSearch';
import { memberFilterSelectOptions } from '../utils/memberSelectOptions';
import { categorySelectLabel, categorySelectContent } from '../utils/categoryLabels';
import { operationsAccountFilterLabel } from '../utils/accountLabels';
import { DEFAULT_CURRENCY } from '../config';
import DateRangePicker from '../components/DateRangePicker';
import SidePanel from '../components/SidePanel';
import RowActionsMenu from '../components/RowActionsMenu';
import PageHeader from '../components/PageHeader';
import PageMain from '../components/PageMain';
import PageSubHeader from '../components/PageSubHeader';
import { TableBlockSticky } from '../components/TableBlock';
import Button from '../components/Button';
import { PageRoot } from './PageRoot.styled';
import Select from '../components/Select';
import OperationAmountCell from '../components/OperationAmountCell';
import SortableTh from '../components/SortableTh';
import AsyncContent from '../components/AsyncContent';
import OperationAdd from './OperationAdd';
import OperationEdit from './OperationEdit';
import OperationDetail from '../components/operation-detail';
import MemberBadge from '../components/MemberBadge';
import AccountBadge from '../components/AccountBadge';
import MiniKpiCard from '../components/MiniKpiCard';
import { FiPlus } from 'react-icons/fi';

function shortDate(dateStr) {
  if (!dateStr) return '';
  const [, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
}

function OperationRowActions({ onDelete, onCreateRule, onEdit }) {
  return (
    <RowActionsMenu
      items={[
        { label: 'Edit', onClick: onEdit },
        { label: 'Create rule', onClick: onCreateRule },
        { label: 'Delete', onClick: onDelete, danger: true },
      ]}
    />
  );
}

const initialRange = thisAndLastMonthDateRange();

const DATE_PRESETS = [
  { id: 'all_time', label: 'All time' },
  { id: 'this_and_last_month', label: 'This and last month' },
  { id: 'this_month', label: 'This month' },
  { id: 'last_month', label: 'Last month' },
];

const DATE_PRESET_LABELS = Object.fromEntries(DATE_PRESETS.map((p) => [p.id, p.label]));

export default function Operations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const editId = searchParams.get('edit') || '';
  const detailId = searchParams.get('detail') || '';

  const startDate = searchParams.has('start') ? searchParams.get('start') : initialRange.start;
  const endDate = searchParams.has('end') ? searchParams.get('end') : initialRange.end;
  const typeFilter = searchParams.get('type') || '';
  const categoryFilters = useMemo(
    () => [...new Set(searchParams.getAll('category'))].filter(Boolean),
    [searchParams],
  );
  const accountFilter = searchParams.get('account') || '';
  const transferFromParam = searchParams.get('from') || '';
  const transferToParam = searchParams.get('to') || '';
  const memberFilter = searchParams.get('member') || '';
  const searchQuery = searchParams.get('q') || '';
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const dateRangeTriggerLabel = useMemo(() => {
    const m = matchDateRangePreset(startDate, endDate);
    if (m) return DATE_PRESET_LABELS[m];
    return `${shortDate(startDate)} – ${shortDate(endDate)}`;
  }, [startDate, endDate]);

  const setFilter = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    }, { replace: true });
  };

  const handleDateRangeChange = useCallback((start, end) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('start', start);
      next.set('end', end);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const closeEditPanel = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('edit');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const closeDetailPanel = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('detail');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const openEditPanel = useCallback((id) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('edit', id);
      next.delete('detail');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const openDetailPanel = useCallback((id) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('detail', id);
      next.delete('edit');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setTypeFilter = (v) => setFilter('type', v);

  const setCategoriesFilter = useCallback((ids) => {
    const list = Array.isArray(ids) ? [...new Set(ids)].filter(Boolean) : [];
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('category');
      for (const id of list) {
        next.append('category', id);
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setAccountFilter = (v) => setFilter('account', v);
  const setMemberFilter = (v) => setFilter('member', v);
  const setSearchQuery = (v) => setFilter('q', v);

  const fetchOps = useCallback(() => {
    const params = {};
    if (typeFilter) params.type = typeFilter;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return getOperations(params);
  }, [typeFilter, startDate, endDate]);
  const { data: operations, loading, error, refetch } = useData(fetchOps, 'operations.csv');
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [rulePanelOpen, setRulePanelOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState({ category_id: '', pattern: '' });
  const [ruleSubmitting, setRuleSubmitting] = useState(false);
  const { data: categories } = useData(getCategories, 'categories.csv');
  const { data: members } = useData(getMembers, 'members.csv');
  const { data: accounts } = useData(getAccounts, 'accounts.csv');

  const categoriesById = useMemo(() => {
    const m = {};
    (categories || []).forEach((c) => { m[c.id] = c; });
    return m;
  }, [categories]);

  const catNameMap = useMemo(() => {
    const m = {};
    (categories || []).forEach((c) => { m[c.id] = c.name; });
    return m;
  }, [categories]);

  const memberFilterOptions = useMemo(
    () => memberFilterSelectOptions(members || [], { allValue: '', allLabel: 'Everyone' }),
    [members],
  );

  // Client-side filtering + sorting
  const filtered = useMemo(() => {
    let rows = operations || [];
    if (categoryFilters.length > 0) {
      rows = rows.filter((r) => categoryFilters.includes(r.category_id));
    }
    if (transferFromParam && transferToParam) {
      rows = rows.filter(
        (r) =>
          r.type === 'money_movement' &&
          r.from_account_id === transferFromParam &&
          r.to_account_id === transferToParam,
      );
    } else if (accountFilter) {
      rows = rows.filter((r) => r.from_account_id === accountFilter || r.to_account_id === accountFilter);
    }
    if (memberFilter) {
      rows = rows.filter((r) => r.member_id === memberFilter);
    }
    if (searchQuery.trim()) {
      const { amountPattern, textQuery, labelNeedle } = parseOperationsSearchQuery(searchQuery);
      rows = rows.filter((r) => operationMatchesSearch(r, amountPattern, textQuery, labelNeedle));
    }
    // Sort
    rows = [...rows].sort((a, b) => {
      let valA, valB;
      if (sortField === 'amount') {
        valA = parseInt(a.amount, 10) || 0;
        valB = parseInt(b.amount, 10) || 0;
      } else if (sortField === 'category') {
        valA = (catNameMap[a.category_id] || '').toLowerCase();
        valB = (catNameMap[b.category_id] || '').toLowerCase();
      } else {
        valA = a[sortField] || '';
        valB = b[sortField] || '';
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [
    operations,
    categoryFilters,
    accountFilter,
    transferFromParam,
    transferToParam,
    memberFilter,
    searchQuery,
    sortField,
    sortDir,
    catNameMap,
  ]);

  const opsKpis = useMemo(() => {
    const rows = filtered;
    const expenseRows = rows.filter((r) => r.type === 'expense');
    const incomeRows = rows.filter((r) => r.type === 'income');
    const expenseSum = expenseRows.reduce((s, r) => s + (parseInt(r.amount, 10) || 0), 0);
    const incomeSum = incomeRows.reduce((s, r) => s + (parseInt(r.amount, 10) || 0), 0);
    const fallbackCurrency = rows[0]?.currency || DEFAULT_CURRENCY;
    return {
      rowCount: rows.length,
      expenseSum,
      incomeSum,
      incomeCount: incomeRows.length,
      expenseCurrency: expenseRows[0]?.currency || fallbackCurrency,
      incomeCurrency: incomeRows[0]?.currency || fallbackCurrency,
    };
  }, [filtered]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'amount' ? 'desc' : 'asc');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this operation?')) return false;
    try {
      await deleteOperation(id);
      refetch();
      return true;
    } catch (err) {
      alert('Failed to delete: ' + err.message);
      return false;
    }
  };

  const handleDeleteFromDetail = async () => {
    if (!detailId) return;
    const ok = await handleDelete(detailId);
    if (ok) closeDetailPanel();
  };

  const detailTitle = useMemo(() => {
    if (!detailId) return 'Operation';
    const row = (operations || []).find((o) => o.id === detailId);
    if (row?.label) {
      const t = row.label.trim();
      return t.length > 72 ? `${t.slice(0, 69)}…` : t;
    }
    return 'Operation';
  }, [detailId, operations]);

  const typeOptions = [
    { value: '', label: 'All operations' },
    { value: 'expense', label: 'Expenses' },
    { value: 'income', label: 'Income' },
    { value: 'money_movement', label: 'Transfers' },
  ];

  const openCreateRule = (op) => {
    setRuleForm({
      category_id: op.category_id,
      pattern: `when you see something like: "${op.label}"`,
    });
    setRulePanelOpen(true);
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!ruleForm.category_id || !ruleForm.pattern.trim()) return;
    setRuleSubmitting(true);
    try {
      await createMatchingRule({
        category_id: ruleForm.category_id,
        pattern: ruleForm.pattern.trim(),
      });
      setRulePanelOpen(false);
      setRuleForm({ category_id: '', pattern: '' });
    } catch (err) {
      alert('Failed to create rule: ' + err.message);
    } finally {
      setRuleSubmitting(false);
    }
  };

  // Categories present in the current result set, plus any active filter ids (so labels resolve
  // when switching type/date leaves zero rows for those categories).
  const catOptions = useMemo(() => {
    const ids = new Set((operations || []).map((o) => o.category_id));
    categoryFilters.forEach((id) => ids.add(id));
    return [...ids]
      .map((id) => categoriesById[id] || { id, name: catNameMap[id] || id, emoji: '' })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [operations, catNameMap, categoryFilters, categoriesById]);

  const categorySelectDisplayValue = useMemo(() => {
    if (categoryFilters.length <= 1) return undefined;
    return `${categoryFilters.length} categories`;
  }, [categoryFilters]);

  return (
    <PageRoot className="page page--full-width page--operations">
      <PageHeader
        title="Operations"
        subtitle="Search, filter, and review income, expenses, and transfers."
        withSubHeader
      >
        <input
          type="text"
          className="ops-toolbar-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          title="Search labels; amount:1 (digit sequence in amount), amount:17 (e.g. €17 or 1017¢); label:…"
          aria-label="Search operations"
        />
        <Button
          type="button"
          variant="primary"
          icon
          onClick={() => setAddPanelOpen(true)}
          aria-label="Add operation"
          title="Add operation"
        >
          <FiPlus size={20} />
        </Button>
      </PageHeader>

      <PageSubHeader
        className="ops-toolbar"
        ariaLabel="Filter operations"
        trailing={
          !loading && !error ? (
            <div className="ops-toolbar-kpis" aria-label="Summary for current filters">
              <MiniKpiCard label="Ops" count={opsKpis.rowCount} title="Operations in the table after filters" />
              <MiniKpiCard
                label="Expenses"
                amountCents={opsKpis.expenseSum}
                currency={opsKpis.expenseCurrency}
                title="Sum of expense amounts"
              />
              {opsKpis.incomeCount > 0 ? (
                <MiniKpiCard
                  label="Income"
                  amountCents={opsKpis.incomeSum}
                  currency={opsKpis.incomeCurrency}
                  title="Sum of income amounts"
                />
              ) : null}
            </div>
          ) : null
        }
      >
        <div className="ops-toolbar-left">
          <DateRangePicker
            className="ops-toolbar-period-select select-wrap"
            start={startDate}
            end={endDate}
            onRangeChange={handleDateRangeChange}
            presets={DATE_PRESETS}
            triggerLabel={dateRangeTriggerLabel}
            placeholder="Date range"
          />
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
            placeholder="All operations"
            dropdownClassName="select-dropdown-wide"
          />
          <Select
            multi
            value={categoryFilters}
            onChange={setCategoriesFilter}
            options={[
              { value: '', label: 'All categories' },
              ...catOptions.map((c) => ({
                value: c.id,
                label: categorySelectLabel(c),
                content: categorySelectContent(c),
              })),
            ]}
            placeholder="All categories"
            displayValue={categorySelectDisplayValue}
            multiClearLabel="Clear categories"
            searchable
            dropdownClassName="select-dropdown-wide"
          />
          <Select
            value={accountFilter}
            onChange={setAccountFilter}
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
          {(members || []).length > 1 && (
            <Select
              value={memberFilter}
              onChange={setMemberFilter}
              options={memberFilterOptions}
              placeholder="Everyone"
              dropdownClassName="select-dropdown-wide"
            />
          )}
        </div>
      </PageSubHeader>

      <PageMain fill>
      <div className="operations-main">
        <AsyncContent loading={loading} error={error}>
          <div className="card operations-card">
            {filtered.length === 0 ? (
              <p className="empty">No operations match your filters.</p>
            ) : (
              <TableBlockSticky fill>
                <table className="table-compact">
                  <thead>
                    <tr>
                      <SortableTh field="date" sortField={sortField} sortDir={sortDir} onSort={handleSort}>
                        Date
                      </SortableTh>
                      <th className="th-member-badge">Member</th>
                      <SortableTh field="label" sortField={sortField} sortDir={sortDir} onSort={handleSort}>
                        Label
                      </SortableTh>
                      <SortableTh field="category" sortField={sortField} sortDir={sortDir} onSort={handleSort}>
                        Category
                      </SortableTh>
                      <th className="th-account-badge">From</th>
                      <th className="th-account-badge">To</th>
                      <SortableTh field="amount" sortField={sortField} sortDir={sortDir} onSort={handleSort} align="right">
                        Amount
                      </SortableTh>
                      <th scope="col" className="th-actions-head" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((op) => (
                      <tr
                        key={op.id}
                        className="table-row-clickable"
                        onClick={() => openDetailPanel(op.id)}
                      >
                        <td>{shortDate(op.date)}</td>
                        <td className="td-member-badge">
                          <MemberBadge memberId={op.member_id} members={members} />
                        </td>
                        <td>{op.label}</td>
                        <td
                          className="table-cell-ellipsis"
                          title={categorySelectLabel(categoriesById[op.category_id]) || op.category_id}
                        >
                          {categoriesById[op.category_id]
                            ? categorySelectContent(categoriesById[op.category_id], '1')
                            : op.category_id}
                        </td>
                        <td className="td-account-badge">
                          <AccountBadge accountId={op.from_account_id} accounts={accounts} />
                        </td>
                        <td className="td-account-badge">
                          <AccountBadge accountId={op.to_account_id} accounts={accounts} />
                        </td>
                        <td className="u-text-right">
                          <OperationAmountCell
                            amount={op.amount}
                            currency={op.currency}
                            type={op.type}
                          />
                        </td>
                        <td
                          className="td-row-actions"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <OperationRowActions
                            onEdit={() => openEditPanel(op.id)}
                            onDelete={() => handleDelete(op.id)}
                            onCreateRule={() => openCreateRule(op)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableBlockSticky>
            )}
          </div>
        </AsyncContent>
      </div>
      </PageMain>

      <SidePanel
        open={Boolean(detailId)}
        onClose={closeDetailPanel}
        title={detailTitle}
        width="min(520px, 100vw)"
        footer={detailId ? (
          <div className="side-panel-footer__inner">
            <div className="side-panel-footer__actions">
              <Button variant="primary" type="button" onClick={() => {
                const id = detailId;
                openEditPanel(id);
              }}>
                Edit
              </Button>
              <Button variant="secondary" type="button" onClick={() => {
                const op = (operations || []).find((o) => o.id === detailId);
                if (op) openCreateRule(op);
                closeDetailPanel();
              }}>
                Create rule
              </Button>
            </div>
          </div>
        ) : null}
      >
        {detailId ? (
          <OperationDetail
            key={detailId}
            operationId={detailId}
            onClose={closeDetailPanel}
            onDelete={handleDeleteFromDetail}
            categories={categories}
            members={members}
            accounts={accounts}
          />
        ) : null}
      </SidePanel>

      <SidePanel
        open={addPanelOpen}
        onClose={() => setAddPanelOpen(false)}
        title="Add Operation"
      >
        <OperationAdd
          onSuccess={() => {
            setAddPanelOpen(false);
            refetch();
          }}
          onCancel={() => setAddPanelOpen(false)}
        />
      </SidePanel>

      <SidePanel
        open={Boolean(editId)}
        onClose={closeEditPanel}
        title="Edit Operation"
      >
        {editId ? (
          <OperationEdit
            key={editId}
            operationId={editId}
            onSuccess={() => {
              closeEditPanel();
              refetch();
            }}
            onCancel={closeEditPanel}
          />
        ) : null}
      </SidePanel>

      <SidePanel
        open={rulePanelOpen}
        onClose={() => setRulePanelOpen(false)}
        title="Create Matching Rule"
      >
        <form onSubmit={handleCreateRule}>
          <div className="form-group">
            <label>Rule text</label>
            <input
              type="text"
              value={ruleForm.pattern}
              onChange={(e) => setRuleForm({ ...ruleForm, pattern: e.target.value })}
              required
            />
          </div>
          <Select
            label="Category"
            value={ruleForm.category_id}
            onChange={(v) => setRuleForm({ ...ruleForm, category_id: v })}
            options={(categories || []).map((c) => ({
              value: c.id,
              label: categorySelectLabel(c),
              content: categorySelectContent(c),
            }))}
            placeholder="Select category"
            searchable
            required
          />
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={ruleSubmitting}>
              {ruleSubmitting ? 'Saving...' : 'Create Rule'}
            </Button>
            <Button variant="secondary" onClick={() => setRulePanelOpen(false)}>Cancel</Button>
          </div>
        </form>
      </SidePanel>
    </PageRoot>
  );
}
