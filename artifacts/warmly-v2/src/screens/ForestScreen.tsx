import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ForestCanvas, TreeInfoCard } from "../components/forest";
import { useEntries, useForest } from "../hooks";
import { useTheme } from "../theme";
import { Tree } from "../types";
import { pluralRu } from "../utils";

/**
 * Экран «Лес» — как на концептах: заголовок, крупный счётчик, пейзаж в фас.
 */
export function ForestScreen() {
  const theme = useTheme();
  const { trees, total, isLoading } = useForest();
  const { entries } = useEntries();
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const selectedEntry = selectedTree
    ? entries.find((entry) => entry.treeId === selectedTree.id)
    : undefined;

  const plantedLabel = pluralRu(total, "дерево посажено", "дерева посажено", "деревьев посажено");

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ForestCanvas trees={isLoading ? [] : trees} onSelectTree={setSelectedTree} />

      <SafeAreaView edges={["top", "left", "right"]} style={styles.chrome} pointerEvents="box-none">
        <View style={styles.headerBlock} pointerEvents="none">
          <Text
            style={{
              fontSize: theme.typography.sizes.largeTitle,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.textPrimary,
            }}
          >
            Мой лес
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontSize: theme.typography.sizes.caption,
              color: theme.colors.textSecondary,
            }}
          >
            твоё пространство заботы
          </Text>
          <Text
            style={{
              marginTop: theme.spacing("md"),
              fontSize: 44,
              lineHeight: 48,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.textPrimary,
            }}
          >
            {total}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.caption,
              color: theme.colors.textSecondary,
            }}
          >
            {plantedLabel}
          </Text>
        </View>
      </SafeAreaView>

      {!isLoading && trees.length === 0 && (
        <View style={styles.empty} pointerEvents="none">
          <Text
            style={{
              color: theme.colors.textSecondary,
              textAlign: "center",
              fontSize: theme.typography.sizes.body,
              lineHeight: theme.typography.sizes.body * 1.4,
              backgroundColor: theme.colors.overlay,
              paddingHorizontal: theme.spacing("md"),
              paddingVertical: theme.spacing("sm"),
              borderRadius: theme.radius.md,
              overflow: "hidden",
            }}
          >
            Сделайте первую запись —{`\n`}в лесу появится первое дерево.
          </Text>
        </View>
      )}

      <TreeInfoCard
        visible={selectedTree !== null}
        tree={selectedTree}
        entry={selectedEntry}
        onClose={() => setSelectedTree(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chrome: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerBlock: {
    alignSelf: "stretch",
  },
  empty: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});
