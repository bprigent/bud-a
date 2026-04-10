import { API_BASE_URL } from './config.js';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Members
export const getMembers = () => request('/api/members');
export const getMember = (id) => request(`/api/members/${id}`);
export const createMember = (data) => request('/api/members', { method: 'POST', body: JSON.stringify(data) });
export const updateMember = (id, data) => request(`/api/members/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMember = (id) => request(`/api/members/${id}`, { method: 'DELETE' });

// Accounts
export const getAccounts = () => request('/api/accounts');
export const getAccount = (id) => request(`/api/accounts/${id}`);
export const createAccount = (data) => request('/api/accounts', { method: 'POST', body: JSON.stringify(data) });
export const updateAccount = (id, data) => request(`/api/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAccount = (id) => request(`/api/accounts/${id}`, { method: 'DELETE' });

// Categories
export const getCategories = () => request('/api/categories');
export const getCategory = (id) => request(`/api/categories/${id}`);
export const createCategory = (data) => request('/api/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id, data) => request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategory = (id) => request(`/api/categories/${id}`, { method: 'DELETE' });

// Operations (expenses, income, money movements)
export const getOperations = (params = {}) => {
  const query = new URLSearchParams();
  if (params.month) query.set('month', params.month);
  if (params.member_id) query.set('member_id', params.member_id);
  if (params.category_id) query.set('category_id', params.category_id);
  if (params.account_id) query.set('account_id', params.account_id);
  if (params.type) query.set('type', params.type);
  if (params.start_date) query.set('start_date', params.start_date);
  if (params.end_date) query.set('end_date', params.end_date);
  const qs = query.toString();
  return request(`/api/operations${qs ? '?' + qs : ''}`);
};
export const getOperation = (id) => request(`/api/operations/${id}`);
export const createOperation = (data) => request('/api/operations', { method: 'POST', body: JSON.stringify(data) });
export const updateOperation = (id, data) => request(`/api/operations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteOperation = (id) => request(`/api/operations/${id}`, { method: 'DELETE' });

// Budget plans (named budgets — tabs)
export const getBudgetPlans = () => request('/api/budget-plans');
export const createBudgetPlan = (data) =>
  request('/api/budget-plans', { method: 'POST', body: JSON.stringify(data) });
export const updateBudgetPlan = (id, data) =>
  request(`/api/budget-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// Budgets
export const getBudgets = (params = {}) => {
  const q = new URLSearchParams();
  if (params.budget_plan_id) q.set('budget_plan_id', params.budget_plan_id);
  if (params.all_plans) q.set('all_plans', 'true');
  const qs = q.toString();
  return request(`/api/budgets${qs ? '?' + qs : ''}`);
};
export const getCurrentBudgets = (budgetPlanId) => {
  const q = new URLSearchParams();
  if (budgetPlanId) q.set('budget_plan_id', budgetPlanId);
  const qs = q.toString();
  return request(`/api/budgets/current${qs ? '?' + qs : ''}`);
};
export const getBudgetsAsOf = (date, budgetPlanId) => {
  const q = new URLSearchParams({ as_of: date });
  if (budgetPlanId) q.set('budget_plan_id', budgetPlanId);
  return request(`/api/budgets/as-of?${q}`);
};
export const getBudget = (id) => request(`/api/budgets/${id}`);
export const createBudget = (data) => request('/api/budgets', { method: 'POST', body: JSON.stringify(data) });
export const updateBudget = (id, data) => request(`/api/budgets/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBudget = (id) => request(`/api/budgets/${id}`, { method: 'DELETE' });

// Reports
export const getMonthlyReport = (month, budgetPlanId) => {
  const q = new URLSearchParams({ month });
  if (budgetPlanId) q.set('budget_plan_id', budgetPlanId);
  return request(`/api/reports/monthly?${q}`);
};
export const getAccountBalances = () => request('/api/reports/account-balances');
export const getSavingsHistory = () => request('/api/reports/savings-history');

// Preferences
export const getPreferences = () => request('/api/preferences');
export const updateCurrency = (currency) =>
  request('/api/preferences/currency', { method: 'PUT', body: JSON.stringify({ currency }) });
export const setBackupPassword = (new_password) =>
  request('/api/preferences/backup-password', { method: 'POST', body: JSON.stringify({ new_password }) });
export const changeBackupPassword = (old_password, new_password) =>
  request('/api/preferences/backup-password', { method: 'PUT', body: JSON.stringify({ old_password, new_password }) });

// Export
export const exportData = async (password) => {
  const res = await fetch(`${API_BASE_URL}/api/preferences/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.status === 403) throw new Error('Incorrect password');
  if (!res.ok) throw new Error(`Export failed (${res.status})`);
  return res.blob();
};

// Matching Rules
export const getMatchingRules = () => request('/api/matching-rules');
export const createMatchingRule = (data) => request('/api/matching-rules', { method: 'POST', body: JSON.stringify(data) });
export const updateMatchingRule = (id, data) =>
  request(`/api/matching-rules/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteMatchingRule = (id) => request(`/api/matching-rules/${id}`, { method: 'DELETE' });
