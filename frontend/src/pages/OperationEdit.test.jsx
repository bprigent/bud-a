import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OperationEdit from './OperationEdit';

const MOCK_OP = {
  id: 'op-1',
  type: 'expense',
  date: '2026-03-15',
  label: 'Lunch',
  amount: 1250,
  currency: 'EUR',
  category_id: 'cat-1',
  member_id: 'mem-1',
  from_account_id: 'acc-1',
  to_account_id: '',
};
const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Food', emoji: '🍔' },
];
const MOCK_MEMBERS = [
  { id: 'mem-1', first_name: 'Alice', last_name: 'Smith' },
];
const MOCK_ACCOUNTS = [
  { id: 'acc-1', nickname: 'Checking', bank_name: 'Bank A', member_id: 'mem-1' },
];

vi.mock('../api', () => ({
  getOperation: vi.fn(() => Promise.resolve(MOCK_OP)),
  getCategories: vi.fn(() => Promise.resolve(MOCK_CATEGORIES)),
  getMembers: vi.fn(() => Promise.resolve(MOCK_MEMBERS)),
  getAccounts: vi.fn(() => Promise.resolve(MOCK_ACCOUNTS)),
  updateOperation: vi.fn(() => Promise.resolve({ id: 'op-1' })),
}));

function renderEdit(props = {}) {
  return render(
    <OperationEdit operationId="op-1" onSuccess={vi.fn()} onCancel={vi.fn()} {...props} />
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OperationEdit', () => {
  it('shows loading state initially', () => {
    renderEdit();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads and displays existing operation data', async () => {
    renderEdit();
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toHaveValue('Lunch');
    });
    expect(screen.getByLabelText('Date')).toHaveValue('2026-03-15');
    expect(screen.getByLabelText('Amount')).toHaveValue(12.50);
  });

  it('submits updated data and calls onSuccess', async () => {
    const { updateOperation } = await import('../api');
    const onSuccess = vi.fn();
    renderEdit({ onSuccess });

    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toHaveValue('Lunch');
    });

    fireEvent.change(screen.getByLabelText('Label'), { target: { value: 'Dinner', name: 'label' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '30.00', name: 'amount' } });

    fireEvent.submit(screen.getByLabelText('Label').closest('form'));

    await waitFor(() => {
      expect(updateOperation).toHaveBeenCalledWith('op-1', expect.objectContaining({
        label: 'Dinner',
        amount: 3000,
      }));
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('shows error on update failure', async () => {
    const { updateOperation } = await import('../api');
    updateOperation.mockRejectedValueOnce(new Error('Update failed'));

    renderEdit();
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toHaveValue('Lunch');
    });

    fireEvent.submit(screen.getByLabelText('Label').closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });

  it('shows load error and close button when operation fetch fails', async () => {
    const { getOperation } = await import('../api');
    getOperation.mockRejectedValueOnce(new Error('Not found'));

    const onCancel = vi.fn();
    renderEdit({ onCancel });

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('cancel calls onCancel', async () => {
    const onCancel = vi.fn();
    renderEdit({ onCancel });

    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toHaveValue('Lunch');
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('submit button shows Save Expense for expense type', async () => {
    renderEdit();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Expense/i })).toBeInTheDocument();
    });
  });
});
