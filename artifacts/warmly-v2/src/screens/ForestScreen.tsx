import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ForestCatalog, TreeGroveScene } from "../components/forest";
import { useEntries, useForest } from "../hooks";
import { useTheme } from "../theme";
import { CatalogItem } from "../services/forest/catalog";

/**
 * Лес — вертикальный каталог деревьев пользователя, сгруппированный по месяцам.
 * Тап открывает статичную сцену дерева; каталог остаётся смонтированным, чтобы сохранить скролл.
 */
export function ForestScreen() {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { trees, isLoading: treesLoading } = useForest();
  const { entries, isLoading: entriesLoading } = useEntries();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const selectedItem = useMemo(() => {
    if (!selectedEntryId) return null;
    const entry = entries.find((item) => item.id === selectedEntryId);
    if (!entry) return null;
    const tree = trees.find((item) => item.id === entry.treeId);
    if (!tree) return null;
    return { tree, entry } satisfies CatalogItem;
  }, [entries, selectedEntryId, trees]);

  useEffect(() => {
    if (selectedEntryId && !selectedItem) setSelectedEntryId(null);
  }, [selectedEntryId, selectedItem]);

  useEffect(() => {
    if (!selectedItem) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setSelectedEntryId(null);
      return true;
    });
    return () => sub.remove();
  }, [selectedItem]);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: selectedItem
        ? { display: "none" }
        : {
            backgroundColor: isDark ? "#21183AF5" : "#FFF9F0F5",
            borderTopWidth: 0,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            height: 66,
            paddingTop: 6,
            paddingBottom: 6,
            position: "absolute",
            shadowColor: "#000",
            shadowOpacity: isDark ? 0.3 : 0.07,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: -4 },
          },
    });
  }, [isDark, navigation, selectedItem]);

  const onSelectItem = useCallback((item: CatalogItem) => {
    setSelectedEntryId(item.entry.id);
  }, []);

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.fill}
        importantForAccessibility={selectedItem ? "no-hide-descendants" : "auto"}
      >
        <ForestCatalog
          entries={entries}
          trees={trees}
          onSelectItem={onSelectItem}
          bottomInset={insets.bottom}
          isLoading={treesLoading || entriesLoading}
        />
      </SafeAreaView>

      {selectedItem ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="auto">
          <TreeGroveScene item={selectedItem} onClose={() => setSelectedEntryId(null)} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
