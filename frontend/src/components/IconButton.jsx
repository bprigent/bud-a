import { forwardRef } from 'react';
import Button from './Button';

/**
 * Icon-only ghost button: transparent until hover (see `.btn-icon.btn-ghost`).
 * Sizes: `xs` | `sm` | `md` | `lg` | `xl` (same as `Button`).
 * Pass `aria-label` (and optional `title`) — required for icon-only controls.
 */
const IconButton = forwardRef(function IconButton(
  { size = 'md', className = '', ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      {...rest}
      variant="ghost"
      icon
      size={size}
      className={className}
    />
  );
});

export default IconButton;
