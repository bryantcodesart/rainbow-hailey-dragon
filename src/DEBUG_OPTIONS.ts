function getParam(val: string) {
  if (typeof window !== "undefined")
    return new URLSearchParams(window.location.search).get(val);
  return null;
}

function getBooleanParam(paramName: string, defaultValue: boolean): boolean {
  const paramValue = getParam(paramName);
  return paramValue !== null ? paramValue === "true" : defaultValue;
}

function getNumberParam(
  paramName: string,
  defaultValue: number | null
): number | null {
  const paramValue = getParam(paramName);
  return paramValue !== null ? parseFloat(paramValue) : defaultValue;
}

// function getStringParam(
//   paramName: string,
//   defaultValue: string | null
// ): string | null {
//   const paramValue = getParam(paramName);
//   return paramValue !== null ? paramValue : defaultValue;
// }

export const DEBUG_OPTIONS = {
  FORCE_DPR: getNumberParam("debug-force-dpr", null),
  STATS: getBooleanParam("debug-stats", false),
} as const;
