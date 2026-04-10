/** Filter dropdown options for operations list (includes “All types”). */
export const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
  { value: 'money_movement', label: 'Transfers' },
];

/** Badge display for operation `type` field. */
export const TYPE_BADGES = {
  expense: { className: 'type-expense', label: 'Expense' },
  income: { className: 'type-income', label: 'Income' },
  money_movement: { className: 'type-transfer', label: 'Transfer' },
};
