const TARGET_CELL_PX = 8;

const GREYS = [
  'rgb(210,210,210)',
  'rgb(190,190,190)',
  'rgb(170,170,170)',
  'rgb(150,150,150)',
  'rgb(130,130,130)',
];

/**
 * Average RGBA for a rectangle in ImageData, skipping nearly transparent pixels.
 */
function averageRgbaForCell(data, width, x0, y0, cw, ch) {
  const x1 = x0 + cw;
  const y1 = y0 + ch;
  let r = 0, g = 0, b = 0, count = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 8) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  if (count === 0) return null;
  return `rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`;
}

/**
 * Compute the density of non-transparent pixels in a cell (0–1).
 */
function cellDensity(data, width, x0, y0, cw, ch) {
  const total = cw * ch;
  if (total === 0) return 0;
  let filled = 0;
  for (let y = y0; y < y0 + ch; y++) {
    for (let x = x0; x < x0 + cw; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) filled++;
    }
  }
  return filled / total;
}

/**
 * Replace canvas bitmap with a cell grid of pixelated colors.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - device pixels
 * @param {number} height - device pixels
 * @param {number} [cellSize] - fixed cell size in device pixels; if omitted, derived from height targeting ~8px cells
 * @param {object} [opts]
 * @param {boolean} [opts.grey] - use 5 grey shades based on density instead of averaged color
 */
export function pixelateCanvasRegion(ctx, width, height, cellSize, opts) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const grey = opts?.grey ?? false;

  let cs;
  if (cellSize != null) {
    cs = Math.max(1, Math.floor(cellSize));
  } else {
    const rows = Math.max(1, Math.round(height / TARGET_CELL_PX));
    cs = Math.ceil(height / rows);
  }

  ctx.clearRect(0, 0, width, height);
  for (let y = 0; y < height; y += cs) {
    for (let x = 0; x < width; x += cs) {
      const w = Math.min(cs, width - x);
      const h = Math.min(cs, height - y);

      if (grey) {
        const d = cellDensity(data, width, x, y, w, h);
        if (d === 0) continue;
        ctx.fillStyle = GREYS[Math.min(Math.floor(d * GREYS.length), GREYS.length - 1)];
      } else {
        const color = averageRgbaForCell(data, width, x, y, w, h);
        if (!color) continue;
        ctx.fillStyle = color;
      }

      ctx.fillRect(x, y, w, h);
    }
  }
}
