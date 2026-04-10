import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SidePanel from './SidePanel';

describe('SidePanel', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <SidePanel open={false} onClose={() => {}} title="Settings">
        <p>Content</p>
      </SidePanel>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders dialog with title and children when open', () => {
    render(
      <SidePanel open={true} onClose={() => {}} title="Settings">
        <p>Panel body</p>
      </SidePanel>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Panel body')).toBeInTheDocument();
  });

  it('has aria-modal and aria-labelledby', () => {
    render(
      <SidePanel open={true} onClose={() => {}} title="Edit">
        <p>body</p>
      </SidePanel>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(document.getElementById(labelId).textContent).toBe('Edit');
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <SidePanel open={true} onClose={onClose} title="T">
        <p>body</p>
      </SidePanel>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the overlay', () => {
    const onClose = vi.fn();
    render(
      <SidePanel open={true} onClose={onClose} title="T">
        <p>body</p>
      </SidePanel>
    );
    fireEvent.click(document.querySelector('.side-panel-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the panel', () => {
    const onClose = vi.fn();
    render(
      <SidePanel open={true} onClose={onClose} title="T">
        <p>inner</p>
      </SidePanel>
    );
    fireEvent.click(screen.getByText('inner'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose via close button', () => {
    const onClose = vi.fn();
    render(
      <SidePanel open={true} onClose={onClose} title="T">
        <p>body</p>
      </SidePanel>
    );
    fireEvent.click(screen.getByLabelText('Close panel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders footer when provided', () => {
    render(
      <SidePanel open={true} onClose={() => {}} title="T" footer={<button>Save</button>}>
        <p>body</p>
      </SidePanel>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('does not render footer when omitted', () => {
    const { container } = render(
      <SidePanel open={true} onClose={() => {}} title="T">
        <p>body</p>
      </SidePanel>
    );
    expect(container.querySelector('.side-panel-footer')).toBeNull();
  });

  it('renders headerActions when provided', () => {
    render(
      <SidePanel open={true} onClose={() => {}} title="T" headerActions={<span>Actions</span>}>
        <p>body</p>
      </SidePanel>
    );
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('sets body overflow to hidden when open', () => {
    render(
      <SidePanel open={true} onClose={() => {}} title="T">
        <p>body</p>
      </SidePanel>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });
});
