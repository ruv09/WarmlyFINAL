import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { ForestTree } from "@/types/forest";
import { EmptyForest } from "./EmptyForest";
import { ForestBackground } from "./ForestBackground";
import { Tree } from "./Tree";

interface Props {
  trees: ForestTree[];
}

const SCENE_HEIGHT = 360;
const TREE_ANCHOR_W = 96;
/** Lowest trees stand on the foreground meadow, not on a top-down map. */
const FOREGROUND_BOTTOM = 24;
/** Furthest trees move toward the horizon and get a little smaller. */
const DEPTH_RISE = 142;
const MIN_DEPTH_SCALE = 0.72;

/**
 * ForestScene
 *
 * Empty state: shows EmptyForest placeholder.
 * With trees: each tree is positioned in a straight-on landscape. x controls
 * horizontal placement; y controls depth toward the horizon (higher + smaller),
 * not a top-down map coordinate.
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

  const orderedTrees = [...trees].sort((a, b) => b.y - a.y);

  return (
    <View
      style={styles.scene}
      onLayout={(e) => setSceneWidth(e.nativeEvent.layout.width)}
    >
      <ForestBackground />
      {sceneWidth > 0 &&
        orderedTrees.map((tree) => {
          const depth = Math.max(0, Math.min(1, tree.y));
          const left = (sceneWidth - TREE_ANCHOR_W) * tree.x;
          const bottom = FOREGROUND_BOTTOM + DEPTH_RISE * depth;
          const scale = 1 - (1 - MIN_DEPTH_SCALE) * depth;
          const opacity = 1 - 0.18 * depth;
          const zIndex = Math.round((1 - depth) * 100);

          return (
            <View
              key={tree.id}
              style={[
                styles.treeAnchor,
                {
                  left,
                  bottom,
                  opacity,
                  transform: [{ scale }],
                  zIndex,
                },
              ]}
            >
              <Tree tree={tree} />
            </View>
          );
        })}
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
    borderRadius: 32,
    overflow: "hidden",
  },
  treeAnchor: {
    position: "absolute",
  },
});
