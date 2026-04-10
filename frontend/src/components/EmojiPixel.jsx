import { useEffect, useRef } from 'react';
import { pixelateCanvasRegion } from '../utils/pixelate';

/**
 * Display size presets: CSS box + internal bitmap side (px) for crisp pixelation at that scale.
 * Keys are rem widths (`1` … `16`). Use `1` in dense tables/selects, `2` in lists and titles, `4`+ for hero spots.
 */
export const EMOJI_PIXEL_SIZES = /** @type {const} */ ({
  '1': { style: { width: '1rem', height: '1rem' }, logical: 64 },
  '2': { style: { width: '2rem', height: '2rem' }, logical: 128 },
  '4': { style: { width: '4rem', height: '4rem' }, logical: 256 },
  '8': { style: { width: '8rem', height: '8rem' }, logical: 512 },
  '16': { style: { width: '16rem', height: '16rem' }, logical: 1024 },
});

/** @typedef {keyof typeof EMOJI_PIXEL_SIZES} EmojiPixelSize */

/** Safe BEM suffix for `size` (avoids `.` in class tokens for CSS). */
function emojiPixelSizeClass(size) {
  return String(size).replace(/\./g, '-');
}

/**
 * Pixelation is an N×N grid over the internal bitmap. Only these N values are allowed; other
 * numbers are snapped to the nearest step. Edge cells can differ by 1 device pixel.
 */
export const EMOJI_PIXEL_ACROSS_OPTIONS = /** @type {const} */ ([8, 12, 16, 20, 24, 28, 32]);

export const EMOJI_PIXEL_GRID_MIN = EMOJI_PIXEL_ACROSS_OPTIONS[0];
export const EMOJI_PIXEL_GRID_MAX = EMOJI_PIXEL_ACROSS_OPTIONS[EMOJI_PIXEL_ACROSS_OPTIONS.length - 1];

/** @param {number} raw */
export function snapEmojiPixelPixelsAcross(raw) {
  if (!Number.isFinite(raw)) return EMOJI_PIXEL_GRID_MIN;
  const lo = EMOJI_PIXEL_GRID_MIN;
  const hi = EMOJI_PIXEL_GRID_MAX;
  const clamped = Math.min(hi, Math.max(lo, raw));
  const stepped = Math.round((clamped - lo) / 4) * 4 + lo;
  return Math.min(hi, Math.max(lo, stepped));
}

function defaultPixelsAcrossForLogical(logical) {
  return snapEmojiPixelPixelsAcross(Math.round(logical / 8));
}

/** Default `pixelsAcross` for a display `size` preset (when the prop is omitted). */
export function getEmojiPixelDefaultPixelsAcross(size) {
  const preset = EMOJI_PIXEL_SIZES[size] ?? EMOJI_PIXEL_SIZES['1'];
  return defaultPixelsAcrossForLogical(preset.logical);
}

/**
 * Renders text (e.g. one emoji) to a canvas, then pixelates by averaging color per cell.
 *
 * @param {object} props
 * @param {import('react').ReactNode} [props.children] - emoji string (preferred)
 * @param {string} [props.emoji] - alternative to children
 * @param {EmojiPixelSize} [props.size] - preset layout (default `1`)
 * @param {number} [props.pixelsAcross] - blocks per side (N×N); snapped to `EMOJI_PIXEL_ACROSS_OPTIONS`, then capped by bitmap width
 * @param {string} [props.className]
 * @param {string} [props.title]
 * @param {boolean} [props['aria-hidden']]
 */
export default function EmojiPixel({
  children,
  emoji,
  size = '1',
  pixelsAcross: pixelsAcrossProp,
  className = '',
  title,
  'aria-hidden': ariaHidden,
}) {
  const canvasRef = useRef(null);
  const preset = EMOJI_PIXEL_SIZES[size] ?? EMOJI_PIXEL_SIZES['1'];
  const logical = preset.logical;
  const pixelsAcross =
    pixelsAcrossProp != null && Number.isFinite(Number(pixelsAcrossProp))
      ? Number(pixelsAcrossProp)
      : defaultPixelsAcrossForLogical(logical);

  const text =
    emoji != null && emoji !== ''
      ? String(emoji)
      : children != null
        ? String(children)
        : '';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const w = Math.round(logical * dpr);
    const h = Math.round(logical * dpr);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = preset.style.width;
    canvas.style.height = preset.style.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const fontPx = Math.round(logical * 0.62 * dpr);
    ctx.font = `${fontPx}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2 + Math.round(2 * dpr));

    const nTarget = snapEmojiPixelPixelsAcross(pixelsAcross);
    const n = Math.min(nTarget, w);
    const cellPx = Math.max(1, Math.round(w / n));
    pixelateCanvasRegion(ctx, w, h, cellPx);
  }, [text, pixelsAcross, logical, size]);

  if (!text.trim()) return null;

  return (
    <span
      className={['emoji-pixel', `emoji-pixel--${emojiPixelSizeClass(size)}`, className].filter(Boolean).join(' ')}
      title={title}
      aria-hidden={ariaHidden}
    >
      <canvas ref={canvasRef} className="emoji-pixel__canvas" />
    </span>
  );
}
