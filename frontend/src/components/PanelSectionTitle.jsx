/**
 * Section label for grouped controls inside side panels, modals, and long forms.
 * Uses global `.form-control-group-title`. Inside `.side-panel-content`, titles are larger and sentence case.
 *
 * @param {object} props
 * @param {string} [props.id] - For `aria-labelledby` on a wrapping `<section>`
 * @param {import('react').ReactNode} props.children
 * @param {keyof JSX.IntrinsicElements} [props.as='h3'] - Heading level (or `p` if no heading outline slot)
 * @param {string} [props.className]
 */
export default function PanelSectionTitle({
  id,
  children,
  as: Tag = 'h3',
  className = '',
}) {
  return (
    <Tag
      id={id}
      className={['form-control-group-title', className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  );
}
