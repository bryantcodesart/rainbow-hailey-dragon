import { MotionValue } from "framer-motion";

export function getNumberOrMotionValue(
  value: MotionValue<number> | number
): number {
  return typeof value === "number" ? value : value.get();
}
