import { createGlobalStyle } from 'styled-components';

const TypographyStyles = createGlobalStyle`
/**
 * Typography primitives — use via Typography.jsx components.
 * Tokens: frontend/src/styles/TokenStyles.jsx
 */

.typo {
  font-family: var(--font-family-sans);
}

/* -------------------------------------------------------------------------
   Headings
   ------------------------------------------------------------------------- */

.typo-h1 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-leading-tight);
  color: var(--color-neutral-900);
}

.typo-h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--font-leading-snug);
  color: var(--color-text-primary);
}

.typo-h3 {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: var(--font-leading-snug);
  color: var(--color-text-primary);
}

.typo-h4 {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--font-leading-snug);
  color: var(--color-text-primary);
}

.typo-h4--overline {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: var(--font-leading-normal);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--font-tracking-wide);
}

.typo-h3--subtitle {
  font-weight: var(--font-weight-normal);
  color: var(--color-text-muted);
}

.typo-h2--display {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-leading-tight);
}

.typo-h1--display {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-leading-tight);
}

/* -------------------------------------------------------------------------
   Body paragraphs
   ------------------------------------------------------------------------- */

.typo-p-large {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-normal);
  line-height: var(--font-leading-relaxed);
  color: var(--color-text-primary);
}

.typo-p-medium {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--font-leading-normal);
  color: var(--color-text-primary);
}

.typo-p-small {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--font-leading-normal);
  color: var(--color-text-primary);
}

.typo-p-legal {
  margin: 0;
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--font-leading-relaxed);
  color: var(--color-text-muted);
}

.typo-p-legal--emphasis {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.typo-p-large--emphasis,
.typo-p-medium--emphasis,
.typo-p-small--emphasis {
  font-weight: var(--font-weight-semibold);
}

.typo-p-large--compact,
.typo-p-medium--compact,
.typo-p-small--compact {
  line-height: var(--font-leading-snug);
}

/* -------------------------------------------------------------------------
   Shared modifiers (headings + paragraphs)
   ------------------------------------------------------------------------- */

.typo--tone-muted {
  color: var(--color-text-muted);
}

.typo--tone-inverse {
  color: var(--color-text-inverse);
}

.typo--tone-danger {
  color: var(--color-danger-500);
}

.typo--tone-success {
  color: var(--color-success-500);
}

.typo--weight-normal {
  font-weight: var(--font-weight-normal);
}

.typo--weight-medium {
  font-weight: var(--font-weight-medium);
}

.typo--weight-semibold {
  font-weight: var(--font-weight-semibold);
}

.typo--weight-bold {
  font-weight: var(--font-weight-bold);
}

.typo--align-center {
  text-align: center;
}

.typo--align-right {
  text-align: right;
}

.typo--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`;

export { TypographyStyles };

/**
 * @typedef {'default' | 'muted' | 'inverse' | 'danger' | 'success'} TypoTone
 * @typedef {'normal' | 'medium' | 'semibold' | 'bold'} TypoWeight
 * @typedef {'left' | 'center' | 'right'} TypoAlign
 */

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/** @type {Record<TypoTone, string>} */
const TONE_CLASS = {
  default: '',
  muted: 'typo--tone-muted',
  inverse: 'typo--tone-inverse',
  danger: 'typo--tone-danger',
  success: 'typo--tone-success',
};

/** @type {Record<TypoWeight, string>} */
const WEIGHT_CLASS = {
  normal: 'typo--weight-normal',
  medium: 'typo--weight-medium',
  semibold: 'typo--weight-semibold',
  bold: 'typo--weight-bold',
};

/** @type {Record<TypoAlign, string>} */
const ALIGN_CLASS = {
  left: '',
  center: 'typo--align-center',
  right: 'typo--align-right',
};

/**
 * @param {object} opts
 * @param {string} opts.baseClass
 * @param {string} [opts.variantClass]
 * @param {TypoTone} [opts.tone]
 * @param {TypoWeight} [opts.weight]
 * @param {TypoAlign} [opts.align]
 * @param {boolean} [opts.truncate]
 * @param {string} [opts.className]
 */
function typoClasses({
  baseClass,
  variantClass,
  tone = 'default',
  weight,
  align = 'left',
  truncate = false,
  className,
}) {
  return cx(
    'typo',
    baseClass,
    variantClass,
    tone !== 'default' && TONE_CLASS[tone],
    weight && WEIGHT_CLASS[weight],
    align !== 'left' && ALIGN_CLASS[align],
    truncate && 'typo--truncate',
    className,
  );
}

/**
 * @param {keyof JSX.IntrinsicElements} defaultTag
 * @param {string} displayName
 * @param {string} baseClass
 * @param {(variant?: string) => string | undefined} [variantToClass]
 */
function createHeading(defaultTag, displayName, baseClass, variantToClass = () => undefined) {
  /**
   * @param {object} props
   * @param {keyof JSX.IntrinsicElements} [props.as]
   * @param {string} [props.variant]
   * @param {TypoTone} [props.tone]
   * @param {TypoWeight} [props.weight]
   * @param {TypoAlign} [props.align]
   * @param {boolean} [props.truncate]
   * @param {string} [props.className]
   * @param {import('react').ReactNode} props.children
   */
  function Heading({
    as,
    variant,
    tone = 'default',
    weight,
    align = 'left',
    truncate = false,
    className,
    children,
    ...rest
  }) {
    const Tag = as || defaultTag;
    const variantClass = variant ? variantToClass(variant) : undefined;
    const classes = typoClasses({
      baseClass,
      variantClass,
      tone,
      weight,
      align,
      truncate,
      className,
    });
    return (
      <Tag className={classes} {...rest}>
        {children}
      </Tag>
    );
  }
  Heading.displayName = displayName;
  return Heading;
}

const headingVariant = (prefix) => (v) => (v ? `${prefix}--${v}` : undefined);

/** Page / section titles. Variants: `display` (larger). */
export const H1 = createHeading('h1', 'H1', 'typo-h1', headingVariant('typo-h1'));

/** Section headings. Variants: `display` (larger hero-style). */
export const H2 = createHeading('h2', 'H2', 'typo-h2', headingVariant('typo-h2'));

/** Subsection headings. Variants: `subtitle` (normal weight, muted). */
export const H3 = createHeading('h3', 'H3', 'typo-h3', headingVariant('typo-h3'));

/**
 * Minor headings and labels.
 * Variants: `overline` — uppercase eyebrow (e.g. side panel section label).
 */
export const H4 = createHeading('h4', 'H4', 'typo-h4', headingVariant('typo-h4'));

/**
 * @param {object} props
 * @param {'default' | 'emphasis' | 'compact'} [props.variant]
 * @param {TypoTone} [props.tone]
 * @param {TypoWeight} [props.weight]
 * @param {TypoAlign} [props.align]
 * @param {boolean} [props.truncate]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export function PLarge({
  variant = 'default',
  tone = 'default',
  weight,
  align = 'left',
  truncate = false,
  className,
  children,
  ...rest
}) {
  const variantClass =
    variant === 'default' ? undefined : `typo-p-large--${variant}`;
  return (
    <p
      className={typoClasses({
        baseClass: 'typo-p-large',
        variantClass,
        tone,
        weight,
        align,
        truncate,
        className,
      })}
      {...rest}
    >
      {children}
    </p>
  );
}

/**
 * @param {object} props
 * @param {'default' | 'emphasis' | 'compact'} [props.variant]
 */
export function PMedium({
  variant = 'default',
  tone = 'default',
  weight,
  align = 'left',
  truncate = false,
  className,
  children,
  ...rest
}) {
  const variantClass =
    variant === 'default' ? undefined : `typo-p-medium--${variant}`;
  return (
    <p
      className={typoClasses({
        baseClass: 'typo-p-medium',
        variantClass,
        tone,
        weight,
        align,
        truncate,
        className,
      })}
      {...rest}
    >
      {children}
    </p>
  );
}

/**
 * @param {object} props
 * @param {'default' | 'emphasis' | 'compact'} [props.variant]
 */
export function PSmall({
  variant = 'default',
  tone = 'default',
  weight,
  align = 'left',
  truncate = false,
  className,
  children,
  ...rest
}) {
  const variantClass =
    variant === 'default' ? undefined : `typo-p-small--${variant}`;
  return (
    <p
      className={typoClasses({
        baseClass: 'typo-p-small',
        variantClass,
        tone,
        weight,
        align,
        truncate,
        className,
      })}
      {...rest}
    >
      {children}
    </p>
  );
}

/**
 * Fine print / legal. Default tone is already muted; override with `tone="default"` for primary color.
 */
export function PLegal({
  variant = 'default',
  tone = 'muted',
  weight,
  align = 'left',
  truncate = false,
  className,
  children,
  ...rest
}) {
  const variantClass =
    variant === 'default' ? undefined : `typo-p-legal--${variant}`;
  return (
    <p
      className={typoClasses({
        baseClass: 'typo-p-legal',
        variantClass,
        tone,
        weight,
        align,
        truncate,
        className,
      })}
      {...rest}
    >
      {children}
    </p>
  );
}
