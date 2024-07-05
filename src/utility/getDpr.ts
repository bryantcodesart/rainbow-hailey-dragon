import { DEBUG_OPTIONS } from "../DEBUG_OPTIONS";

export const MAX_DPR = 2;
export function getDpr() {
  if (DEBUG_OPTIONS.FORCE_DPR !== null) return DEBUG_OPTIONS.FORCE_DPR;

  return Math.min(MAX_DPR, window.devicePixelRatio);
}
