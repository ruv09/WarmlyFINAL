import { Entry, Tree } from "../../types";
import { parseDateKey } from "../../utils/date";

export type CatalogItem = {
  tree: Tree;
  entry: Entry;
};

export type MonthSection = {
  key: string;
  title: string;
  count: number;
  items: CatalogItem[];
};

function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function monthKeyFromDate(dateKey: string): string {
  return dateKey.slice(0, 7);
}

export function formatMonthHeading(monthKey: string): string {
  const date = parseDateKey(`${monthKey}-01`);
  return date
    .toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
    .replace(/^./, (ch) => ch.toUpperCase());
}

/**
 * Каталог леса из существующих записей и деревьев.
 * Месяцы — вычисляемые, не отдельная сущность.
 */
export function groupForestByMonth(entries: Entry[], trees: Tree[]): MonthSection[] {
  const byId = new Map(trees.map((tree) => [tree.id, tree]));
  const buckets = new Map<string, CatalogItem[]>();

  for (const entry of entries) {
    const tree = byId.get(entry.treeId);
    if (!tree) continue;
    const key = monthKeyFromDate(entry.date);
    const list = buckets.get(key) ?? [];
    list.push({ tree, entry });
    buckets.set(key, list);
  }

  const sections = [...buckets.entries()].map(([key, items]) => {
    const sorted = [...items].sort((a, b) => (a.entry.createdAt < b.entry.createdAt ? 1 : -1));
    return {
      key,
      title: formatMonthHeading(key),
      count: sorted.length,
      items: sorted,
    };
  });

  sections.sort((a, b) => (a.key < b.key ? 1 : a.key > b.key ? -1 : 0));
  return sections;
}

export type GroveSpot = {
  item: CatalogItem;
  left: number;
  top: number;
  size: number;
};

function groveSlot(index: number, cols: number): { col: number; row: number; colsInRow: number } {
  let remaining = index;
  let row = 0;
  while (true) {
    const colsInRow = cols === 2 || row % 2 === 0 ? cols : cols - 1;
    if (remaining < colsInRow) return { col: remaining, row, colsInRow };
    remaining -= colsInRow;
    row += 1;
  }
}

/**
 * Детерминированная поляна: одно и то же дерево всегда в том же месте.
 * Ряды 3–2–3 (или 2–2 на узких экранах), лёгкий jitter внутри ячейки — без наложений.
 */
export function layoutMonthGrove(items: CatalogItem[], width: number): { spots: GroveSpot[]; height: number } {
  const cols = width < 360 ? 2 : width < 720 ? 3 : 4;
  const pad = 10;
  const cellW = (width - pad * 2) / cols;
  const rowH = Math.round(cellW * 1.18);
  const spots: GroveSpot[] = items.map((item, index) => {
    const hx = hash01(`${item.tree.id}:x`);
    const hy = hash01(`${item.tree.id}:y`);
    const hs = hash01(`${item.tree.id}:s`);
    const { col, row, colsInRow } = groveSlot(index, cols);
    const size = Math.max(72, Math.round(cellW * (0.58 + hs * 0.2) * item.tree.scale));
    const rowWidth = colsInRow * cellW;
    const rowLeft = (width - rowWidth) / 2;
    const maxJitter = Math.max(0, (cellW - size) / 2 - 6);
    const jitterX = (hx - 0.5) * 2 * maxJitter;
    let left = rowLeft + col * cellW + (cellW - size) / 2 + jitterX;
    left = Math.max(pad, Math.min(width - size - pad, left));
    const top = pad + row * rowH + (hy - 0.5) * 14;
    return { item, left, top, size };
  });

  const lastBottom = spots.reduce((max, spot) => Math.max(max, spot.top + spot.size), pad);
  return { spots, height: lastBottom + 18 };
}
