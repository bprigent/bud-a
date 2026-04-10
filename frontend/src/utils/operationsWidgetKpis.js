/** Default footer KPI toggles for dashboard widgets under the Operations tab (revenue list + operations table). */
export const DEFAULT_OPS_FOOTER_KPIS = {
  total: true,
  average: true,
};

export function mergeOpsFooterKpis(widget) {
  return {
    ...DEFAULT_OPS_FOOTER_KPIS,
    ...(widget?.opsFooterKpis || {}),
  };
}
