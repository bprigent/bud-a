import { forwardRef } from 'react';
import { StyledButton } from './Button.styled';

/** Polymorphic button: primary | secondary | ghost | danger | text, sizes xs | sm | md | lg | xl, icon mode. Icon-only ghost: `IconButton`. */
export const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'secondary',
    size = 'md',
    icon = false,
    className = '',
    type,
    ...rest
  },
  ref
) {
  return (
    <StyledButton
      ref={ref}
      as={Component}
      type={Component === 'button' ? (type ?? 'button') : undefined}
      $variant={variant}
      $size={size}
      $icon={icon}
      className={['btn', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

export default Button;
