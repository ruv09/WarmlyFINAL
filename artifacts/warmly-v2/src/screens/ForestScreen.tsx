import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ForestCanvas, TreeInfoCard } from "../components/forest";
import { useEntries, useForest } from "../hooks";
import { useTheme } from "../theme";
import { Tree } from "../types";
import { pluralRu } from "../utils";

/**
 * Лес на весь экран — главный визуальный и эмоциональный экран Warmly.
 * Хром минимален: заголовок и счётчик поверх карты, без карточек-героев.
 */
export function ForestScreen() {
  const theme = useTheme();
  const { trees, total, isLoading } = useForest();
  const { entries } = useEntries();
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const selectedEntry = selectedTree
    ? entries.find((entry) => entry.treeId === selectedTree.id)
    : undefined;

  const countLabel = pluralRu(total, "дерево", "дерева", "деревьев");

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ForestCanvas trees={isLoading ? [] : trees} onSelectTree={setSelectedTree} />

      <SafeAreaView edges={["top", "left", "right"]} style={styles.chrome} pointerEvents="box-none">
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.overlay,
              borderRadius: theme.radius.lg,
              borderColor: theme.colors.border,
            },
          ]}
          pointerEvents="none"
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.title,
              fontWeight: theme.typography.weights.semibold,
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
            {total > 0 ? `${total} ${countLabel}` : "твоё пространство заботы"}
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
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  header: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  empty: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});
