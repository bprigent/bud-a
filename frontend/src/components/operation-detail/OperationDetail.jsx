import { useState, useEffect } from 'react';
import { getOperation } from '../../api';
import Button from '../Button';
import OperationDetailBody from './OperationDetailBody';

/**
 * Read-only view of a single operation for the side panel.
 * Fetches the row by id; delegates layout to OperationDetailBody.
 */
export default function OperationDetail({
  operationId,
  onClose,
  onDelete,
  categories = [],
  members = [],
  accounts = [],
}) {
  const [op, setOp] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    getOperation(operationId)
      .then((row) => {
        if (!cancelled) setOp(row);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [operationId]);

  if (loadError) {
    return (
      <div className="operation-detail">
        <p className="error">{loadError}</p>
        <div className="operation-detail-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  if (!op) {
    return (
      <div className="operation-detail">
        <p className="loading">Loading…</p>
      </div>
    );
  }

  return (
    <OperationDetailBody
      op={op}
      categories={categories}
      members={members}
      accounts={accounts}
      onDelete={onDelete}
    />
  );
}
