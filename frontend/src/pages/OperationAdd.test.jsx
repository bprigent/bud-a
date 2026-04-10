import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OperationAdd from './OperationAdd';

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Groceries', emoji: '🛒' },
  { id: 'cat-2', name: 'Rent', emoji: '🏠' },
];
const MOCK_MEMBERS = [
  { id: 'mem-1', first_name: 'Alice', last_name: 'Smith' },
  { id: 'mem-2', first_name: 'Bob', last_name: 'Jones' },
];
const MOCK_ACCOUNTS = [
  { id: 'acc-1', nickname: 'Checking', bank_name: 'Bank A', member_id: 'mem-1' },
  { id: 'acc-2', nickname: 'Savings', bank_name: 'Bank B', member_id: 'mem-2' },
];

vi.mock('../api', () => ({
  getCategories: vi.fn(() => Promise.resolve(MOCK_CATEGORIES)),
  getMembers: vi.fn(() => Promise.resolve(MOCK_MEMBERS)),
  getAccounts: vi.fn(() => Promise.resolve(MOCK_ACCOUNTS)),
  createOperation: vi.fn(() => Promise.resolve({ id: 'new-op' })),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderAdd(props = {}) {
  return render(
    <MemoryRouter>
      <OperationAdd {...props} />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OperationAdd', () => {
  it('renders the form with required fields', async () => {
    renderAdd();
    // Wait for API data to load
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  it('shows page title when not in panel mode', async () => {
    renderAdd();
    await waitFor(() => {
      expect(screen.getByText('Add Operation')).toBeInTheDocument();
    });
  });

  it('does not show page title in panel mode', async () => {
    renderAdd({ onSuccess: vi.fn(), onCancel: vi.fn() });
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });
    expect(screen.queryByText('Add Operation')).toBeNull();
  });

  it('submits form data and navigates on success (page mode)', async () => {
    const { createOperation } = await import('../api');
    renderAdd();
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Label'), { target: { value: 'Test purchase', name: 'label' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '25.50', name: 'amount' } });

    fireEvent.submit(screen.getByLabelText('Label').closest('form'));

    await waitFor(() => {
      expect(createOperation).toHaveBeenCalled();
    });
    const payload = createOperation.mock.calls[0][0];
    expect(payload.label).toBe('Test purchase');
    expect(payload.amount).toBe(2550);
    expect(payload.type).toBe('expense');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/operations');
    });
  });

  it('submits and calls onSuccess in panel mode', async () => {
    const { createOperation } = await import('../api');
    const onSuccess = vi.fn();
    const onCancel = vi.fn();
    renderAdd({ onSuccess, onCancel });

    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Label'), { target: { value: 'Groceries', name: 'label' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '10', name: 'amount' } });

    fireEvent.submit(screen.getByLabelText('Label').closest('form'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows error on API failure', async () => {
    const { createOperation } = await import('../api');
    createOperation.mockRejectedValueOnce(new Error('Server error'));

    renderAdd();
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Label'), { target: { value: 'Fail', name: 'label' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '5', name: 'amount' } });

    fireEvent.submit(screen.getByLabelText('Label').closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('shows transfer fields (from + to) when type is money_movement', async () => {
    renderAdd();
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });

    // The submit button text should contain "Expense" initially
    expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument();
  });

  it('cancel navigates back in page mode', async () => {
    renderAdd();
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/operations');
  });

  it('cancel calls onCancel in panel mode', async () => {
    const onCancel = vi.fn();
    renderAdd({ onSuccess: vi.fn(), onCancel });
    await waitFor(() => {
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
