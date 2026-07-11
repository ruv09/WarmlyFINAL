import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  totalTrees: number;
}

function pluralTrees(n: number): string {
  if (n === 1) return "дерево";
  if (n >= 2 && n <= 4) return "дерева";
  return "деревьев";
}

export function ForestHeader({ totalTrees }: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Мой лес
      </Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        {totalTrees > 0
          ? `${totalTrees} ${pluralTrees(totalTrees)} выросло в твоём лесу`
          : "Твой лес ждёт первого дерева"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
});
