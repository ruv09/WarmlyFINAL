import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SceneMode, Tree } from "../../types";
import { getTreeImage, getSpeciesVisual } from "../../constants/treeSpecies";
import { resolveSceneMode } from "../../constants/sceneMode";

interface TreeIllustrationProps {
  tree: Tree;
  size?: number;
  depthFade?: number;
  fillParent?: boolean;
  /** Ствол без собственной лужайки — сажаем в нарисованную землю сцены. */
  planted?: boolean;
  sceneMode?: SceneMode;
}

/**
 * Акварельный спрайт из TREE_DEFINITIONS.
 * День/ночь задаётся SceneMode, а не темой приложения.
 */
export const TreeIllustration = memo(function TreeIllustration({
  tree,
  size = 160,
  depthFade = 1,
  fillParent = false,
  planted = false,
  sceneMode,
}: TreeIllustrationProps) {
  const mode = resolveSceneMode(sceneMode);
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
        source={getTreeImage(tree.species, mode, planted)}
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
