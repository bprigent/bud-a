import { useRef, useEffect, useCallback } from 'react';
import { usePrivacy } from '../contexts/PrivacyContext';
import { pixelateCanvasRegion } from '../utils/pixelate';

function paintPixelated(canvas, span) {
  if (!canvas || !span) return;

  const rect = span.getBoundingClientRect();
  const w = Math.ceil(rect.width);
  const h = Math.ceil(rect.height);
  if (w === 0 || h === 0) return;

  const dpr = window.devicePixelRatio || 1;
  const cw = Math.ceil(w * dpr);
  const ch = Math.ceil(h * dpr);

  canvas.width = cw;
  canvas.height = ch;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const cs = getComputedStyle(span);
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  ctx.fillStyle = cs.color;
  ctx.textBaseline = 'top';

  const text = span.innerText || span.textContent || '';
  const lines = text.split('\n');
  const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 0, i * lineHeight);
  }

  pixelateCanvasRegion(ctx, cw, ch, undefined, { grey: true });
}

/**
 * Wraps content that should be hidden when privacy mode is active.
 * Renders the real content invisibly (for sizing) with a pixelated
 * canvas overlay so layout dimensions are preserved.
 */
export default function Redacted({ children }) {
  const privacyMode = usePrivacy();
  const spanRef = useRef(null);
  const canvasRef = useRef(null);

  const paint = useCallback(() => {
    paintPixelated(canvasRef.current, spanRef.current);
  }, []);

  useEffect(() => {
    if (!privacyMode) return;
    paint();

    const span = spanRef.current;
    if (!span || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(paint);
    ro.observe(span);
    return () => ro.disconnect();
  }, [privacyMode, children, paint]);

  if (!privacyMode) return children;

  return (
    <span className="redacted-wrap">
      <span className="redacted-content" ref={spanRef} aria-hidden="true">
        {children}
      </span>
      <canvas ref={canvasRef} className="redacted-canvas" aria-hidden="true" />
    </span>
  );
}
