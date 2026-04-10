import OperationDetailRow from './OperationDetailRow';

export default function OperationDetailAccountRows({ type, fromLabel, toLabel }) {
  const isTransfer = type === 'money_movement';
  const isIncome = type === 'income';

  if (isTransfer) {
    return (
      <>
        <OperationDetailRow label="From account">{fromLabel}</OperationDetailRow>
        <OperationDetailRow label="To account">{toLabel}</OperationDetailRow>
      </>
    );
  }
  if (isIncome) {
    return <OperationDetailRow label="To account">{toLabel}</OperationDetailRow>;
  }
  return <OperationDetailRow label="From account">{fromLabel}</OperationDetailRow>;
}
