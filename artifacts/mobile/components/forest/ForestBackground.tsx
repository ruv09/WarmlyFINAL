import React from "react";
import { StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";

/**
 * Decorative ground strip that sits at the bottom of the forest scene.
 * Will be replaced with a proper SVG illustration in a later sprint.
 */
export function ForestBackground() {
  const colors = useColors();

  return (
    <View
      style={[styles.ground, { backgroundColor: colors.mint }]}
    />
  );
}

const styles = StyleSheet.create({
  ground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});
