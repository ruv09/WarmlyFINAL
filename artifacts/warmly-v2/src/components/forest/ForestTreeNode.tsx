import React, { memo, useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { Tree } from "../../types";
import { TreeIllustration } from "../tree";
import { SPRING_CONFIGS } from "../../theme/tokens/animation";
import { getSpeciesVisual } from "../../constants/treeSpecies";
import { passBy, perspective, projectFromCamera, TREE_BASE_SIZE } from "../../services/forest/camera";
import { SceneTree } from "../../utils/viewportCulling";

export const TREE_HEIGHT = TREE_BASE_SIZE;
export const TREE_WIDTH = TREE_BASE_SIZE;
export const TREE_SIZE = TREE_HEIGHT;

interface ForestTreeNodeProps {
  scene: SceneTree;
  screenWidth: number;
  groundY: number;
  camX: SharedValue<number>;
  camY: SharedValue<number>;
  camZ: SharedValue<number>;
  sway: SharedValue<number>;
  phase: number;
  isNew: boolean;
  reduceMotion: boolean;
  onPress: (tree: Tree) => void;
}

export const ForestTreeNode = memo(function ForestTreeNode({
  scene,
  screenWidth,
  groundY,
  camX,
  camY,
  camZ,
  sway,
  phase,
  isNew,
  reduceMotion,
  onPress,
}: ForestTreeNodeProps) {
  const appear = useSharedValue(isNew ? 0 : 1);
  const heightScale = getSpeciesVisual(scene.species).heightScale;
  const worldX = scene.x;
  const worldZ = scene.z;
  const treeScale = scene.scale;

  useEffect(() => {
    if (!isNew) {
      appear.value = 1;
      return;
    }
    appear.value = 0;
    appear.value = withDelay(
      40,
      withSpring(1, {
        damping: SPRING_CONFIGS.soft.damping,
        stiffness: SPRING_CONFIGS.soft.stiffness,
        mass: SPRING_CONFIGS.soft.mass,
      }),
    );
  }, [appear, isNew, scene.id]);

  const animatedStyle = useAnimatedStyle(() => {
    const relZ = worldZ - camZ.value;
    const persp = perspective(relZ);
    const pass = passBy(relZ);
    const size = TREE_BASE_SIZE * heightScale * treeScale * persp * pass.boost;
    const { left, top } = projectFromCamera(
      worldX,
      worldZ,
      camX.value,
      camY.value,
      camZ.value,
      screenWidth,
      groundY,
      size,
    );
    const nearness = Math.max(0, Math.min(1, 1 - relZ / 900));
    const swayAmp = reduceMotion ? 0 : 0.25 + nearness * 0.85;
    const angle = Math.sin(sway.value + phase) * swayAmp;
    return {
      width: size,
      height: size,
      left,
      top,
      opacity: appear.value * pass.opacity * (0.42 + nearness * 0.58),
      zIndex: Math.round(10000 - relZ),
      transform: [
        { translateY: size / 2 },
        { rotate: `${angle}deg` },
        { translateY: -size / 2 },
        { scale: 0.88 + appear.value * 0.12 },
      ],
    };
  });

  const fakeTree: Tree | null = scene.source ?? null;

  return (
    <Animated.View style={[{ position: "absolute" }, animatedStyle]} pointerEvents={scene.interactive ? "auto" : "none"}>
      <Pressable
        onPress={() => {
          if (fakeTree) onPress(fakeTree);
        }}
        hitSlop={10}
        style={{ flex: 1 }}
      >
        <TreeIllustration
          tree={
            fakeTree ?? {
              id: scene.id,
              species: scene.species,
              position: { x: scene.x, y: 0 },
              scale: scene.scale,
              depth: 0.5,
              variant: scene.variant,
              createdAt: scene.createdAt,
            }
          }
          fillParent
          depthFade={1}
        />
      </Pressable>
    </Animated.View>
  );
});

export function swayPhaseForTree(treeId: string): number {
  let hash = 0;
  for (let i = 0; i < treeId.length; i++) hash = (hash * 33 + treeId.charCodeAt(i)) >>> 0;
  return (hash % 628) / 100;
}
