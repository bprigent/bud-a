import EmojiPixel from '../components/EmojiPixel';

/**
 * Plain string for search, native option labels, titles, and aria labels.
 */
export function categorySelectLabel(category) {
  if (!category) return '';
  return `${category.emoji || ''} ${category.name}`.trim();
}

/**
 * Rich label: pixelated emoji + category name (for Select rows/trigger, tables, etc.).
 *
 * @param {{ name?: string, emoji?: string }} category
 * @param {'1' | '2' | '4' | '8' | '16'} [emojiSize] - rem preset (`1` dense tables and selects)
 */
export function categorySelectContent(category, emojiSize = '1') {
  if (!category) return '';
  const name = category.name || '';
  const em = (category.emoji || '').trim();
  if (!em) return name || '';
  return (
    <span className="category-inline-label">
      <EmojiPixel size={emojiSize} aria-hidden={true}>
        {em}
      </EmojiPixel>
      {name ? <span className="category-inline-label__text">{name}</span> : null}
    </span>
  );
}
