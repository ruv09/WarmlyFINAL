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

/** Крупный размер как на концептах (не мелкие иконки карты). */
export const TREE_HEIGHT = 210;
export const TREE_WIDTH = 210;
export const TREE_SIZE = TREE_HEIGHT;

interface ForestTreeNodeProps {
  tree: Tree;
  left: number;
  top: number;
  size: number;
  sway: SharedValue<number>;
  phase: number;
  isNew: boolean;
  onPress: (tree: Tree) => void;
}

export const ForestTreeNode = memo(function ForestTreeNode({
  tree,
  left,
  top,
  size,
  sway,
  phase,
  isNew,
  onPress,
}: ForestTreeNodeProps) {
  const appear = useSharedValue(isNew ? 0 : 1);

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
    const angle = Math.sin(sway.value + phase) * 1.15;
    const scale = 0.75 + appear.value * 0.25;
    return {
      opacity: appear.value,
      transform: [
        { translateY: size / 2 },
        { rotate: `${angle}deg` },
        { translateY: -size / 2 },
        { scale },
      ],
    };
  });

  return (
    <Pressable
      onPress={() => onPress(tree)}
      hitSlop={12}
      style={{ position: "absolute", left, top, width: size, height: size }}
    >
      <Animated.View style={animatedStyle}>
        <TreeIllustration tree={tree} size={size} />
      </Animated.View>
    </Pressable>
  );
});

export function swayPhaseForTree(treeId: string): number {
  let hash = 0;
  for (let i = 0; i < treeId.length; i++) hash = (hash * 33 + treeId.charCodeAt(i)) >>> 0;
  return (hash % 628) / 100;
}
