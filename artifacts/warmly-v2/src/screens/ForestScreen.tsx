import React, { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ForestCanvas, ForestHeroCard, TreeInfoCard } from "../components/forest";
import { useEntries, useForest } from "../hooks";
import { useTheme } from "../theme";
import { Tree } from "../types";
import { pluralRu } from "../utils";

/**
 * Единственный экран, который сознательно не использует
 * components/layout/Screen: лес должен ощущаться как одно большое
 * пространство на весь экран.
 */
export function ForestScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const { trees, total, isLoading } = useForest();
  const { entries } = useEntries();
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const selectedEntry = selectedTree
    ? entries.find((entry) => entry.treeId === selectedTree.id)
    : undefined;

  const countLabel = `${pluralRu(total, "дерево посажено", "дерева посажено", "деревьев посажено")}`;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View style={{ paddingHorizontal: theme.spacing("md"), paddingTop: theme.spacing("sm") }}>
        <ForestHeroCard
          title="Мой лес"
          subtitle="твоё пространство заботы"
          count={total}
          countLabel={countLabel}
          width={screenWidth - theme.spacing("md") * 2}
        />
      </View>

      {!isLoading && trees.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing("lg"),
          }}
        >
          <Text style={{ color: theme.colors.textSecondary, textAlign: "center" }}>
            Лес пока пуст. Сделайте первую запись, чтобы посадить дерево.
          </Text>
        </View>
      ) : (
        <ForestCanvas trees={trees} onSelectTree={setSelectedTree} />
      )}

      <TreeInfoCard
        visible={selectedTree !== null}
        tree={selectedTree}
        entry={selectedEntry}
        onClose={() => setSelectedTree(null)}
      />
    </SafeAreaView>
  );
}
