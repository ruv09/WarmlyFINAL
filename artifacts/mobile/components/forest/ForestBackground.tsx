import React from "react";
import { StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";

/**
 * A plain catalogue backdrop that keeps the forest menu visually uniform.
 */
export function ForestBackground() {
  const colors = useColors();

  return <View style={[styles.root, { backgroundColor: colors.background }]} />;
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    overflow: "hidden",
  },
});
