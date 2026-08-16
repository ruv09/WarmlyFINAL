import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Tree } from "../../types";
import { getTreeImage, getSpeciesVisual } from "../../constants/treeSpecies";
import { useTheme } from "../../theme";

interface TreeIllustrationProps {
  tree: Tree;
  size?: number;
  depthFade?: number;
  fillParent?: boolean;
}

/**
 * Мягкая pastel-иллюстрация из assets/trees/*.png
 */
export const TreeIllustration = memo(function TreeIllustration({
  tree,
  size = 160,
  depthFade = 1,
  fillParent = false,
}: TreeIllustrationProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const visual = getSpeciesVisual(tree.species);
  const side = fillParent ? "100%" : Math.round(size);

  return (
    <View
      style={[
        styles.treeContainer,
        fillParent ? styles.fill : { width: side, height: side },
        { opacity: Math.max(0.5, Math.min(1, depthFade)) },
      ]}
    >
      <Image
        source={getTreeImage(tree.species, isDark, tree.variant)}
        style={fillParent ? styles.fill : { width: side, height: side }}
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
  fill: {
    width: "100%",
    height: "100%",
  },
});
