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

export const TREE_SIZE = 76;

interface ForestTreeNodeProps {
  tree: Tree;
  left: number;
  top: number;
  sway: SharedValue<number>;
  phase: number;
  isNew: boolean;
  onPress: (tree: Tree) => void;
}

/**
 * Одно дерево на карте: мягкое покачивание от общей фазы сцены
 * и плавное появление для только что посаженного дерева.
 */
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
    const angle = Math.sin(sway.value + phase) * 1.6;
    const scale = 0.72 + appear.value * 0.28;
    return {
      opacity: appear.value,
      transform: [{ rotate: `${angle}deg` }, { scale }],
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
        width: TREE_SIZE,
        height: TREE_SIZE,
      }}
    >
      <Animated.View style={animatedStyle}>
        <TreeIllustration tree={tree} size={TREE_SIZE} />
      </Animated.View>
    </Pressable>
  );
});

/** Стабильная фаза покачивания из id — деревья качаются не синхронно. */
export function swayPhaseForTree(treeId: string): number {
  let hash = 0;
  for (let i = 0; i < treeId.length; i++) {
    hash = (hash * 33 + treeId.charCodeAt(i)) >>> 0;
  }
  return (hash % 628) / 100;
}
