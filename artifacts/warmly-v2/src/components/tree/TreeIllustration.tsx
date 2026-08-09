import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Tree } from "../../types";
import { getSpeciesVisual } from "../../constants/treeSpecies";

interface TreeIllustrationProps {
  tree: Tree;
  /** Сторона квадрата иллюстрации (гайд: 80 / 120 / 160). */
  size?: number;
  /** Сохранено для совместимости вызовов; свечение уже в PNG. */
  showLights?: boolean;
}

/**
 * Дерево в фас — PNG из assets/trees/, без SVG-«коронок сверху».
 * Стиль: мягкий минимализм, пастель, прозрачный фон.
 */
export const TreeIllustration = memo(function TreeIllustration({
  tree,
  size = 120,
}: TreeIllustrationProps) {
  const visual = getSpeciesVisual(tree.species);
  const side = Math.round(size * visual.heightScale);

  return (
    <View style={[styles.treeContainer, { width: side, height: side }]}>
      <Image
        source={visual.image}
        style={{ width: side, height: side }}
        resizeMode="contain"
        accessibilityLabel={visual.labelRu}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  treeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
