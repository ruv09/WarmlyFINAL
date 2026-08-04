import { Tree } from "../types";

export interface CanvasViewport {
  /** Текущее смещение канвы (translateX/Y) в экранных единицах. */
  x: number;
  y: number;
  scale: number;
}

/**
 * Возвращает только те деревья, чей мировой прямоугольник пересекается
 * с видимой областью экрана (плюс запас margin). Это единственный
 * механизм производительности, нужный при view-based рендеринге
 * (react-native-svg): невидимый native-view всё равно стоит дороже,
 * чем его отсутствие, поэтому деревья за кадром не рендерятся вовсе,
 * а не просто визуально скрываются.
 */
export function getVisibleTrees(
  trees: Tree[],
  viewport: CanvasViewport,
  screenWidth: number,
  screenHeight: number,
  margin: number,
): Tree[] {
  const halfWidthWorld = screenWidth / 2 / viewport.scale + margin;
  const halfHeightWorld = screenHeight / 2 / viewport.scale + margin;

  const centerWorldX = -viewport.x / viewport.scale;
  const centerWorldY = -viewport.y / viewport.scale;

  return trees.filter((tree) => {
    const dx = Math.abs(tree.position.x - centerWorldX);
    const dy = Math.abs(tree.position.y - centerWorldY);
    return dx <= halfWidthWorld && dy <= halfHeightWorld;
  });
}
