export default function AmountInput({
  id,
  name,
  value,
  onChange,
  required = false,
  min = '0.01',
  step = '0.01',
  placeholder = '0.00',
  ...rest
}) {
  return (
    <input
      type="number"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
      placeholder={placeholder}
      {...rest}
    />
  );
}
