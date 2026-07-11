import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { ForestTree } from "@/types/forest";
import { getTreeByMood } from "@/utils/forest";

interface Props {
  tree: ForestTree;
}

/**
 * Renders a single tree in the forest.
 * Sprint 1: emoji placeholder. Later sprints will replace with SVG.
 */
export function Tree({ tree }: Props) {
  const treeData = getTreeByMood(tree.mood);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{treeData.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  emoji: {
    fontSize: 42,
    lineHeight: 50,
  },
});
