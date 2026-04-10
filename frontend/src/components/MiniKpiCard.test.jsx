import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MiniKpiCard from './MiniKpiCard';
import PrivacyContext from '../contexts/PrivacyContext';

/** Wrap in PrivacyContext with privacy off so Redacted renders children directly. */
function renderCard(props) {
  return render(
    <PrivacyContext.Provider value={false}>
      <MiniKpiCard {...props} />
    </PrivacyContext.Provider>
  );
}

describe('MiniKpiCard', () => {
  it('renders label', () => {
    renderCard({ label: 'Total spent', amountCents: 150000 });
    expect(screen.getByText('Total spent')).toBeInTheDocument();
  });

  it('renders amount in currency mode (cents → whole dollars)', () => {
    renderCard({ label: 'Budget', amountCents: 123456, currency: 'USD' });
    // 123456 cents → 1235 rounded, formatted with Intl → "1,235"
    expect(screen.getByText('1,235')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders zero amount', () => {
    renderCard({ label: 'Savings', amountCents: 0, currency: 'EUR' });
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('€')).toBeInTheDocument();
  });

  it('renders count mode (no currency)', () => {
    renderCard({ label: 'Items', count: 42 });
    expect(screen.getByText('42')).toBeInTheDocument();
    // Should not render a currency symbol element
    const card = screen.getByText('42').closest('.mini-kpi');
    expect(card.querySelector('.mini-kpi-currency')).toBeNull();
  });

  it('renders icon when provided', () => {
    renderCard({ label: 'Trips', amountCents: 5000, icon: <span data-testid="icon">★</span> });
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('adds no-icon class when icon is omitted', () => {
    const { container } = renderCard({ label: 'Test', amountCents: 100 });
    expect(container.querySelector('.mini-kpi--no-icon')).toBeInTheDocument();
  });

  it('adds tone class for bad amount', () => {
    const { container } = renderCard({ label: 'Over', amountCents: -500, amountTone: 'bad' });
    expect(container.querySelector('.mini-kpi--amount-bad')).toBeInTheDocument();
  });

  it('adds tone class for good amount', () => {
    const { container } = renderCard({ label: 'Under', amountCents: 500, amountTone: 'good' });
    expect(container.querySelector('.mini-kpi--amount-good')).toBeInTheDocument();
  });

  it('handles NaN amountCents gracefully (falls back to 0)', () => {
    renderCard({ label: 'Broken', amountCents: NaN, currency: 'USD' });
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('passes title attribute', () => {
    const { container } = renderCard({ label: 'Tip', amountCents: 100, title: 'Tooltip text' });
    expect(container.querySelector('.mini-kpi')).toHaveAttribute('title', 'Tooltip text');
  });
});
