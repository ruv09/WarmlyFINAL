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
import { getSpeciesVisual } from "../../constants/treeSpecies";
import { TreeIllustration } from "../tree";
import { SPRING_CONFIGS } from "../../theme/tokens/animation";

/** Средний размер дерева на карте (гайд: medium 120). */
export const TREE_HEIGHT = 120;
export const TREE_WIDTH = 120;
/** @deprecated используйте TREE_HEIGHT */
export const TREE_SIZE = TREE_HEIGHT;

interface ForestTreeNodeProps {
  tree: Tree;
  left: number;
  top: number;
  sway: SharedValue<number>;
  phase: number;
  isNew: boolean;
  onPress: (tree: Tree) => void;
}

export const ForestTreeNode = memo(function ForestTreeNode({
  tree,
  left,
  top,
  sway,
  phase,
  isNew,
  onPress,
}: ForestTreeNodeProps) {
  const appear = useSharedValue(isNew ? 0 : 1);
  const heightScale = getSpeciesVisual(tree.species).heightScale;
  const side = Math.round(TREE_HEIGHT * heightScale);

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
    const angle = Math.sin(sway.value + phase) * 1.2;
    const scale = 0.72 + appear.value * 0.28;
    return {
      opacity: appear.value,
      transform: [
        { translateY: side / 2 },
        { rotate: `${angle}deg` },
        { translateY: -side / 2 },
        { scale },
      ],
    };
  });

  return (
    <Pressable
      onPress={() => onPress(tree)}
      hitSlop={10}
      style={{
        position: "absolute",
        left,
        top,
        width: side,
        height: side,
      }}
    >
      <Animated.View style={animatedStyle}>
        <TreeIllustration tree={tree} size={TREE_HEIGHT} />
      </Animated.View>
    </Pressable>
  );
});

export function swayPhaseForTree(treeId: string): number {
  let hash = 0;
  for (let i = 0; i < treeId.length; i++) {
    hash = (hash * 33 + treeId.charCodeAt(i)) >>> 0;
  }
  return (hash % 628) / 100;
}
