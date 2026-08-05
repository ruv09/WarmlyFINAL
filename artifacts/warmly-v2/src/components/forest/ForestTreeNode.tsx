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

/** Высота дерева в фас; ширина из вертикального viewBox 100×130. */
export const TREE_HEIGHT = 108;
export const TREE_WIDTH = Math.round((TREE_HEIGHT * 100) / 130);

/** @deprecated используйте TREE_HEIGHT — оставлено для совместимости импортов. */
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
  const heightScale = getSpeciesVisual(tree.species).heightScale;
  const height = Math.round(TREE_HEIGHT * heightScale);
  const width = Math.round((height * 100) / 130);

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
    // Качаем от основания, а не от центра — так выглядит естественнее в фас.
    const angle = Math.sin(sway.value + phase) * 1.4;
    const scale = 0.72 + appear.value * 0.28;
    return {
      opacity: appear.value,
      transform: [
        { translateY: height / 2 },
        { rotate: `${angle}deg` },
        { translateY: -height / 2 },
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
        width,
        height,
      }}
    >
      <Animated.View style={animatedStyle}>
        <TreeIllustration tree={tree} size={height} />
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
