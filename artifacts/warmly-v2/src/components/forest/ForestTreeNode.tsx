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
import { nearPass, projectTreeScreen, TREE_BASE_SIZE } from "../../services/forest/camera";

export const TREE_HEIGHT = TREE_BASE_SIZE;
export const TREE_WIDTH = TREE_BASE_SIZE;
export const TREE_SIZE = TREE_HEIGHT;

interface ForestTreeNodeProps {
  tree: Tree;
  screenWidth: number;
  groundY: number;
  camX: SharedValue<number>;
  camY: SharedValue<number>;
  zoom: SharedValue<number>;
  sway: SharedValue<number>;
  phase: number;
  isNew: boolean;
  reduceMotion: boolean;
  onPress: (tree: Tree) => void;
}

export const ForestTreeNode = memo(function ForestTreeNode({
  tree,
  screenWidth,
  groundY,
  camX,
  camY,
  zoom,
  sway,
  phase,
  isNew,
  reduceMotion,
  onPress,
}: ForestTreeNodeProps) {
  const appear = useSharedValue(isNew ? 0 : 1);
  const heightScale = getSpeciesVisual(tree.species).heightScale;
  const depth = tree.depth;
  const worldX = tree.position.x;
  const worldY = tree.position.y;
  const treeScale = tree.scale;

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
  }, [appear, isNew, tree.id]);

  const animatedStyle = useAnimatedStyle(() => {
    const pass = nearPass(depth, zoom.value);
    const depthScale = 0.42 + depth * 0.7;
    const size = TREE_BASE_SIZE * heightScale * depthScale * treeScale * zoom.value * pass.boost;
    const { left, top } = projectTreeScreen(
      worldX,
      worldY,
      depth,
      camX.value,
      camY.value,
      zoom.value,
      screenWidth,
      groundY,
      size,
    );
    const swayAmp = reduceMotion ? 0 : 0.35 + depth * 0.75;
    const angle = Math.sin(sway.value + phase) * swayAmp;
    const appearScale = 0.86 + appear.value * 0.14;
    return {
      width: size,
      height: size,
      left,
      top,
      opacity: appear.value * pass.opacity * (0.55 + depth * 0.45),
      zIndex: Math.round(20 + depth * 80),
      transform: [
        { translateY: size / 2 },
        { rotate: `${angle}deg` },
        { translateY: -size / 2 },
        { scale: appearScale },
      ],
    };
  });

  return (
    <Animated.View style={[{ position: "absolute" }, animatedStyle]}>
      <Pressable onPress={() => onPress(tree)} hitSlop={10} style={{ flex: 1 }}>
        <TreeIllustration tree={tree} fillParent depthFade={1} />
      </Pressable>
    </Animated.View>
  );
});

export function swayPhaseForTree(treeId: string): number {
  let hash = 0;
  for (let i = 0; i < treeId.length; i++) hash = (hash * 33 + treeId.charCodeAt(i)) >>> 0;
  return (hash % 628) / 100;
}
