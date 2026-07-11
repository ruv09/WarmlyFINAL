import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

/**
 * Shown when the forest has no trees yet.
 */
export function EmptyForest() {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌱</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Здесь однажды вырастет{"\n"}твой лес.
      </Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        Каждая запись о настроении{"\n"}превращается в новое дерево.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 48,
  },
  emoji: {
    fontSize: 56,
    lineHeight: 68,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
});
