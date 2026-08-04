import { Tree } from "../types";

export interface CanvasViewport {
  /** Текущее смещение канвы (translateX/Y) в экранных единицах. */
  x: number;
  y: number;
  scale: number;
}

/** Размер ячейки пространственного индекса в мировых единицах. */
const CELL_SIZE = 96;

export type TreeSpatialIndex = Map<string, Tree[]>;

function cellKey(cx: number, cy: number): string {
  return `${cx}:${cy}`;
}

/**
 * Строит пространственный индекс деревьев для быстрой выборки
 * видимой области. Пересобирается только при изменении списка деревьев
 * (создание/удаление записи), а не на каждом кадре панорамирования.
 */
export function buildTreeSpatialIndex(trees: Tree[]): TreeSpatialIndex {
  const index: TreeSpatialIndex = new Map();

  for (const tree of trees) {
    const cx = Math.floor(tree.position.x / CELL_SIZE);
    const cy = Math.floor(tree.position.y / CELL_SIZE);
    const key = cellKey(cx, cy);
    const bucket = index.get(key);
    if (bucket) {
      bucket.push(tree);
    } else {
      index.set(key, [tree]);
    }
  }

  return index;
}

/**
 * Возвращает только те деревья, чей мировой прямоугольник пересекается
 * с видимой областью экрана (плюс запас margin). При большом лесе
 * (500–1000+) использует пространственный индекс вместо полного скана.
 */
export function getVisibleTrees(
  trees: Tree[],
  viewport: CanvasViewport,
  screenWidth: number,
  screenHeight: number,
  margin: number,
  spatialIndex?: TreeSpatialIndex,
): Tree[] {
  const halfWidthWorld = screenWidth / 2 / viewport.scale + margin;
  const halfHeightWorld = screenHeight / 2 / viewport.scale + margin;

  const centerWorldX = -viewport.x / viewport.scale;
  const centerWorldY = -viewport.y / viewport.scale;

  const minX = centerWorldX - halfWidthWorld;
  const maxX = centerWorldX + halfWidthWorld;
  const minY = centerWorldY - halfHeightWorld;
  const maxY = centerWorldY + halfHeightWorld;

  const candidates =
    spatialIndex && trees.length > 80
      ? querySpatialIndex(spatialIndex, minX, maxX, minY, maxY)
      : trees;

  const visible = candidates.filter((tree) => {
    const { x, y } = tree.position;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  });

  // Ближе к «камере» (ниже по Y) рисуем поверх — естественная глубина.
  visible.sort((a, b) => a.position.y - b.position.y);
  return visible;
}

function querySpatialIndex(
  index: TreeSpatialIndex,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): Tree[] {
  const minCX = Math.floor(minX / CELL_SIZE);
  const maxCX = Math.floor(maxX / CELL_SIZE);
  const minCY = Math.floor(minY / CELL_SIZE);
  const maxCY = Math.floor(maxY / CELL_SIZE);

  const result: Tree[] = [];
  for (let cy = minCY; cy <= maxCY; cy++) {
    for (let cx = minCX; cx <= maxCX; cx++) {
      const bucket = index.get(cellKey(cx, cy));
      if (bucket) {
        for (const tree of bucket) {
          result.push(tree);
        }
      }
    }
  }
  return result;
}
