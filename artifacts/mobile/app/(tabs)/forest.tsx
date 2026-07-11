import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ForestHeader } from "@/components/forest/ForestHeader";
import { ForestScene } from "@/components/forest/ForestScene";
import { useColors } from "@/hooks/useColors";
import { getForest } from "@/utils/forest";

/**
 * ForestScreen — Мой лес
 *
 * Sprint 1: architecture scaffold only.
 * The screen is composed entirely of components; no logic lives here.
 * Data is currently a stub; persistence will be wired in a later sprint.
 */
export default function ForestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const trees = getForest();

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
});
