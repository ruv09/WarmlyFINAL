/**
 * Виды деревьев Warmly 2.0 — мягкие pastel PNG в фас.
 * Без стадий роста: одна запись = одно полноценное дерево.
 */
export type TreeSpecies =
  | "oak"
  | "birch"
  | "pine"
  | "spruce"
  | "maple"
  | "linden"
  | "sakura"
  | "apple"
  | "bush"
  | "willow"
  | "rowan";

export interface TreePosition {
  /** Мировые координаты вдоль горизонтали сцены */
  x: number;
  /**
   * Глубина сцены: меньший y — дальше, больший y — ближе к зрителю.
   * Не путать с картой сверху.
   */
  y: number;
}

/** Поднимать при смене правил размещения, чтобы старый лес не оставался кучей. */
export const FOREST_LAYOUT_VERSION = 5;

export interface Tree {
  id: string;
  species: TreeSpecies;
  position: TreePosition;
  /** Локальный масштаб экземпляра (вариация размера) */
  scale: number;
  /** 0 — дальний план, 1 — передний */
  depth: number;
  /** Дискретный слой 2.5D: 0 дальний … 5 очень близкий */
  layer?: number;
  /** Глубина в мире: камера идёт вперёд по Z (pinch), не по карте. */
  worldZ?: number;
  /** Индекс варианта ассета */
  variant: number;
  /** Версия раскладки леса */
  layoutVersion?: number;
  createdAt: string;
}

/** Нормализация старых деревьев без scale/depth/variant. */
export function normalizeTree(
  raw: Partial<Tree> & Pick<Tree, "id" | "species" | "position" | "createdAt">,
): Tree {
  const y = raw.position?.y ?? 0;
  const depth =
    typeof raw.depth === "number" && Number.isFinite(raw.depth)
      ? Math.max(0, Math.min(1, raw.depth))
      : Math.max(0, Math.min(1, (y + 220) / 440));
  const scale =
    typeof raw.scale === "number" && Number.isFinite(raw.scale)
      ? Math.max(0.7, Math.min(1.25, raw.scale))
      : 0.9 + hash01(raw.id + ":s") * 0.22;
  const variant =
    typeof raw.variant === "number" && Number.isFinite(raw.variant)
      ? (Math.abs(Math.floor(raw.variant)) % 2) + 1
      : hash01(raw.id + ":v") < 0.5
        ? 1
        : 2;

  return {
    id: raw.id,
    species: raw.species,
    position: raw.position,
    scale,
    depth,
    layer:
      typeof raw.layer === "number" && Number.isFinite(raw.layer)
        ? Math.max(0, Math.min(5, Math.round(raw.layer)))
        : Math.round(depth * 5),
    worldZ:
      typeof raw.worldZ === "number" && Number.isFinite(raw.worldZ)
        ? Math.max(0, raw.worldZ)
        : Math.max(80, depth * 900),
    variant,
    layoutVersion: raw.layoutVersion ?? FOREST_LAYOUT_VERSION,
    createdAt: raw.createdAt,
  };
}

function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}
