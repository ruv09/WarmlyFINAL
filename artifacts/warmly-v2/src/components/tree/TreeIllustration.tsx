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
  /** Ствол без собственной лужайки — сажаем в нарисованную землю сцены. */
  planted?: boolean;
}

/**
 * Живописный спрайт из assets/trees/*.
 * Каталог — painted/ с островком; сцена поляны — rooted/.
 */
export const TreeIllustration = memo(function TreeIllustration({
  tree,
  size = 160,
  depthFade = 1,
  fillParent = false,
  planted = false,
}: TreeIllustrationProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const visual = getSpeciesVisual(tree.species);
  const side = fillParent ? ("100%" as const) : Math.round(size * visual.heightScale);

  return (
    <View
      style={[
        styles.treeContainer,
        { width: side, height: side, opacity: Math.max(0.55, Math.min(1, depthFade)) },
        fillParent ? styles.fill : null,
      ]}
    >
      <Image
        source={getTreeImage(tree.species, isDark, planted)}
        style={fillParent ? styles.fillImage : { width: side, height: side }}
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
  fillImage: {
    width: "100%",
    height: "100%",
  },
});
