import TypeBadge from '../TypeBadge';
import { OPERATION_TYPE_DESCRIPTION } from './constants';

export default function OperationDetailTypeLine({ type }) {
  return (
    <p className="operation-detail-type-line">
      <TypeBadge type={type} />
      <span className="operation-detail-type-hint">
        {OPERATION_TYPE_DESCRIPTION[type] || ''}
      </span>
    </p>
  );
}
