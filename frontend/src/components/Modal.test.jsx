import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal title="Test" open={false} onClose={() => {}}>
        <p>Body</p>
      </Modal>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders dialog with title and children when open', () => {
    render(
      <Modal title="Confirm" open={true} onClose={() => {}}>
        <p>Are you sure?</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('has aria-modal and aria-labelledby', () => {
    render(
      <Modal title="My Title" open={true} onClose={() => {}}>
        <p>content</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(document.getElementById(labelId).textContent).toBe('My Title');
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" open={true} onClose={onClose}>
        <p>body</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the overlay', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" open={true} onClose={onClose}>
        <p>body</p>
      </Modal>
    );
    fireEvent.click(document.querySelector('.modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" open={true} onClose={onClose}>
        <p>body</p>
      </Modal>
    );
    fireEvent.click(screen.getByText('body'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn();
    render(
      <Modal title="T" open={true} onClose={onClose}>
        <p>body</p>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
