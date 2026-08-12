import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Tree } from "../../types";
import { getTreeImage, getSpeciesVisual } from "../../constants/treeSpecies";
import { useTheme } from "../../theme";

interface TreeIllustrationProps {
  tree: Tree;
  size?: number;
  depthFade?: number;
}

/**
 * Мягкая pastel-иллюстрация из assets/trees/*.png
 * (не геометрия View/SVG).
 */
export const TreeIllustration = memo(function TreeIllustration({
  tree,
  size = 160,
  depthFade = 1,
}: TreeIllustrationProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const visual = getSpeciesVisual(tree.species);
  const side = Math.round(size * visual.heightScale);

  return (
    <View
      style={[
        styles.treeContainer,
        { width: side, height: side, opacity: Math.max(0.55, Math.min(1, depthFade)) },
      ]}
    >
      <Image
        source={getTreeImage(tree.species, isDark, tree.variant)}
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
    justifyContent: "flex-end",
  },
});
