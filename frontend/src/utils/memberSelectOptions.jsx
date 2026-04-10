/**
 * Shared member dropdown options (color swatches) — same visuals as Study page.
 */

export const DEFAULT_MEMBER_COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

export function memberColor(mem, index) {
  return mem.color || DEFAULT_MEMBER_COLORS[index % DEFAULT_MEMBER_COLORS.length];
}

function memberOptionContent(mem, index) {
  return (
    <span className="study-member-option">
      <span
        className="study-member-swatch"
        style={{ '--swatch-color': memberColor(mem, index) }}
        aria-hidden
      />
      {mem.first_name}
    </span>
  );
}

/**
 * Filter dropdown: synthetic "everyone" row + one row per member (Study / Operations list).
 * @param {Array} memberList
 * @param {{ allValue?: string, allLabel?: string }} [opts] — Study uses allValue `'all'`; Operations uses `''`.
 */
export function memberFilterSelectOptions(memberList, { allValue = 'all', allLabel = 'Everyone' } = {}) {
  const everyone = {
    value: allValue,
    label: allLabel,
    content: (
      <span className="study-member-option">
        <span
          className="study-member-swatch study-member-swatch--neutral"
          aria-hidden
        />
        {allLabel}
      </span>
    ),
  };
  const rows = memberList.map((mem, i) => ({
    value: mem.id,
    label: mem.first_name,
    content: memberOptionContent(mem, i),
  }));
  return [everyone, ...rows];
}

/**
 * Add / edit operation forms — one row per member, no "everyone" row.
 * `label` includes full name for search; `content` matches Study (swatch + first name).
 */
export function memberFormSelectOptions(memberList) {
  return memberList.map((mem, i) => {
    const label = [mem.first_name, mem.last_name].filter(Boolean).join(' ').trim() || mem.first_name;
    return {
      value: mem.id,
      label,
      content: memberOptionContent(mem, i),
    };
  });
}
