import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ForestHeader } from "@/components/forest/ForestHeader";
import { ForestScene } from "@/components/forest/ForestScene";
import { useForest } from "@/context/ForestContext";
import { useColors } from "@/hooks/useColors";

/**
 * ForestScreen — Мой лес
 *
 * Sprint 2: receives live tree list from ForestContext.
 * No logic lives here — screen is composed entirely of components.
 */
export default function ForestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trees } = useForest();

  const topPad = Platform.OS === "web" ? 60 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 20, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ForestHeader totalTrees={trees.length} />

        {/* Debug counter — will be removed in a later sprint */}
        <Text style={[styles.debug, { color: colors.mutedForeground }]}>
          Деревьев: {trees.length}
        </Text>

        <ForestScene trees={trees} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    gap: 20,
  },
  debug: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: -12,
  },
});
