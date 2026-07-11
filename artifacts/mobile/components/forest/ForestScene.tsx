import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { ForestTree } from "@/types/forest";
import { EmptyForest } from "./EmptyForest";
import { ForestBackground } from "./ForestBackground";
import { Tree } from "./Tree";

interface Props {
  trees: ForestTree[];
}

const SCENE_HEIGHT = 320;
/** Ground strip height — trees are placed above this. */
const GROUND_H = 100;
/** Vertical range above the ground strip where trees can appear. */
const TREE_ZONE_H = SCENE_HEIGHT - GROUND_H - 48;

/**
 * ForestScene — Sprint 2
 *
 * Empty state: shows EmptyForest placeholder.
 * With trees: each tree is positioned absolutely using its x/y (0..1) coords.
 *   x → horizontal position across the full scene width.
 *   y → depth offset — 0 near the ground, 1 further back (higher on screen).
 */
export function ForestScene({ trees }: Props) {
  const [sceneWidth, setSceneWidth] = useState(0);

  if (trees.length === 0) {
    return (
      <View style={styles.emptyWrapper}>
        <EmptyForest />
      </View>
    );
  }

  return (
    <View
      style={styles.scene}
      onLayout={(e) => setSceneWidth(e.nativeEvent.layout.width)}
    >
      {sceneWidth > 0 &&
        trees.map((tree) => {
          const left = (sceneWidth - 48) * tree.x;
          const bottom = GROUND_H + TREE_ZONE_H * tree.y;
          return (
            <View
              key={tree.id}
              style={[styles.treeAnchor, { left, bottom }]}
            >
              <Tree tree={tree} />
            </View>
          );
        })}
      <ForestBackground />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  scene: {
    height: SCENE_HEIGHT,
    position: "relative",
  },
  treeAnchor: {
    position: "absolute",
  },
});
