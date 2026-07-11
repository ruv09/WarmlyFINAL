import React from "react";
import { StyleSheet, View } from "react-native";

import type { ForestTree } from "@/types/forest";
import { EmptyForest } from "./EmptyForest";
import { ForestBackground } from "./ForestBackground";
import { Tree } from "./Tree";

interface Props {
  trees: ForestTree[];
}

/**
 * The main canvas of the forest.
 * Sprint 1: simple grid layout.
 * Later sprints: positioned SVG scene with depth layers.
 */
export function ForestScene({ trees }: Props) {
  if (trees.length === 0) {
    return (
      <View style={styles.emptyWrapper}>
        <EmptyForest />
      </View>
    );
  }

  return (
    <View style={styles.scene}>
      <View style={styles.treesGrid}>
        {trees.map((tree) => (
          <Tree key={tree.id} tree={tree} />
        ))}
      </View>
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
    minHeight: 300,
    position: "relative",
  },
  treesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    padding: 8,
    paddingBottom: 116,
  },
});
