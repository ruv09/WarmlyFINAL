import { Tree } from "../types";
import { FAR_PLANE, NEAR_PLANE, passBy, perspective } from "../services/forest/camera";

export type SceneTree = {
  id: string;
  species: Tree["species"];
  x: number;
  z: number;
  scale: number;
  variant: number;
  interactive: boolean;
  source?: Tree;
  createdAt: string;
};

export interface CameraViewport {
  camX: number;
  camY: number;
  cameraZ: number;
}

export function getVisibleSceneTrees(
  trees: SceneTree[],
  viewport: CameraViewport,
  screenWidth: number,
): SceneTree[] {
  const visible = trees.filter((tree) => {
    const relZ = tree.z - viewport.cameraZ;
    if (relZ < NEAR_PLANE * 0.22 || relZ > FAR_PLANE + 80) return false;
    const persp = perspective(relZ);
    const pass = passBy(relZ);
    if (pass.opacity < 0.04) return false;
    const screenX = screenWidth / 2 + (tree.x - viewport.camX) * persp;
    const margin = 240 + persp * 90;
    return screenX > -margin && screenX < screenWidth + margin;
  });

  visible.sort((a, b) => b.z - a.z);
  return visible;
}
