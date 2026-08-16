import { Tree } from "../types";
import { CULLING_MARGIN, nearPass, projectTreeScreen, TREE_BASE_SIZE } from "../services/forest/camera";
import { getSpeciesVisual } from "../constants/treeSpecies";

export interface CameraViewport {
  camX: number;
  camY: number;
  zoom: number;
}

const CELL_SIZE = 140;

export type TreeSpatialIndex = Map<string, Tree[]>;

function cellKey(cx: number, cy: number): string {
  return `${cx}:${cy}`;
}

export function buildTreeSpatialIndex(trees: Tree[]): TreeSpatialIndex {
  const index: TreeSpatialIndex = new Map();
  for (const tree of trees) {
    const cx = Math.floor(tree.position.x / CELL_SIZE);
    const cy = Math.floor(tree.position.y / CELL_SIZE);
    const key = cellKey(cx, cy);
    const bucket = index.get(key);
    if (bucket) bucket.push(tree);
    else index.set(key, [tree]);
  }
  return index;
}

/**
 * Видимые деревья в экранных координатах текущей камеры.
 * Дальние (меньший y) рисуются первыми.
 */
export function getVisibleTrees(
  trees: Tree[],
  viewport: CameraViewport,
  screenWidth: number,
  screenHeight: number,
  groundY: number,
  spatialIndex?: TreeSpatialIndex,
): Tree[] {
  const margin = CULLING_MARGIN;
  const worldSpan = (screenWidth / 2 + margin) / Math.max(0.2, viewport.zoom * 0.4);
  const minX = viewport.camX - worldSpan;
  const maxX = viewport.camX + worldSpan;
  const minY = viewport.camY - 420;
  const maxY = viewport.camY + 420;

  const candidates =
    spatialIndex && trees.length > 80
      ? querySpatialIndex(spatialIndex, minX, maxX, minY, maxY)
      : trees;

  const visible = candidates.filter((tree) => {
    const pass = nearPass(tree.depth, viewport.zoom);
    if (pass.opacity < 0.04) return false;
    const heightScale = getSpeciesVisual(tree.species).heightScale;
    const size = TREE_BASE_SIZE * heightScale * (0.42 + tree.depth * 0.7) * tree.scale * viewport.zoom * pass.boost;
    const { left, top } = projectTreeScreen(
      tree.position.x,
      tree.position.y,
      tree.depth,
      viewport.camX,
      viewport.camY,
      viewport.zoom,
      screenWidth,
      groundY,
      size,
    );
    return left + size > -margin && left < screenWidth + margin && top + size > -margin && top < screenHeight + margin;
  });

  visible.sort((a, b) => a.position.y - b.position.y || a.depth - b.depth);
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
        for (const tree of bucket) result.push(tree);
      }
    }
  }
  return result;
}
