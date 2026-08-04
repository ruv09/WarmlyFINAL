/** Русская плюрализация для целых чисел. */
export function pluralRu(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

export function treesLabel(n: number): string {
  return `${n} ${pluralRu(n, "дерево", "дерева", "деревьев")}`;
}
