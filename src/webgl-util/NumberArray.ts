export type NumberArray<
  L extends number,
  T extends unknown[] = []
> = T extends {
  length: L;
}
  ? T
  : NumberArray<L, [...T, number]>;
