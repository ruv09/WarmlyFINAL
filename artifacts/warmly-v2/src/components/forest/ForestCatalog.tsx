import React, { useCallback, useMemo } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { Text } from "../ui";
import { TreeCatalogCard } from "./TreeCatalogCard";
import { useTheme } from "../../theme";
import { resolveSceneMode, sceneModeFromTheme } from "../../constants/sceneMode";
import { CatalogItem, MonthSection, groupForestByMonth } from "../../services/forest/catalog";
import { Entry, SceneMode, Tree } from "../../types";
import { entriesLabel } from "../../utils";

const TAB_BAR_CLEARANCE = 66;

type CatalogRow =
  | { type: "month"; key: string; title: string; count: number }
  | { type: "card"; key: string; item: CatalogItem };

type Props = {
  entries: Entry[];
  trees: Tree[];
  onSelectItem: (item: CatalogItem) => void;
  bottomInset: number;
  isLoading?: boolean;
  sceneMode?: SceneMode | null;
};

function flattenSections(sections: MonthSection[]): CatalogRow[] {
  const rows: CatalogRow[] = [];
  for (const section of sections) {
    rows.push({
      type: "month",
      key: `month-${section.key}`,
      title: section.title,
      count: section.count,
    });
    for (const item of section.items) {
      rows.push({ type: "card", key: item.entry.id, item });
    }
  }
  return rows;
}

export function ForestCatalog({
  entries,
  trees,
  onSelectItem,
  bottomInset,
  isLoading,
  sceneMode: sceneModeOverride,
}: Props) {
  const theme = useTheme();
  const sceneMode = resolveSceneMode(sceneModeOverride ?? sceneModeFromTheme(theme.mode));
  const sections = useMemo(() => groupForestByMonth(entries, trees), [entries, trees]);
  const rows = useMemo(() => flattenSections(sections), [sections]);

  const renderRow = useCallback<ListRenderItem<CatalogRow>>(
    ({ item }) => {
      if (item.type === "month") {
        return <MonthDivider title={item.title} count={item.count} />;
      }
      return <TreeCatalogCard item={item.item} sceneMode={sceneMode} onPress={() => onSelectItem(item.item)} />;
    },
    [onSelectItem, sceneMode],
  );

  if (rows.length === 0) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
        <CatalogHeader />
        {!isLoading ? (
          <View style={styles.emptyCopy}>
            <Text
              style={{
                fontSize: theme.typography.sizes.largeTitle,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.textPrimary,
                textAlign: "center",
              }}
              maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
            >
              Пока в лесу тихо
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: theme.typography.sizes.body,
                color: theme.colors.textSecondary,
                textAlign: "center",
                lineHeight: 22,
              }}
              maxFontSizeMultiplier={theme.typography.scaleLimits.content}
            >
              Каждая мысль оставляет после себя дерево.
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={4}
        windowSize={5}
        maxToRenderPerBatch={3}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing("lg"),
          paddingBottom: TAB_BAR_CLEARANCE + bottomInset + 28,
        }}
        ListHeaderComponent={<CatalogHeader />}
      />
    </View>
  );
}

function CatalogHeader() {
  const theme = useTheme();

  return (
    <View style={styles.headerCopy}>
      <Text
        style={{
          fontSize: theme.typography.sizes.largeTitle,
          lineHeight: 32,
          fontWeight: theme.typography.weights.bold,
          color: theme.colors.textPrimary,
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        Мой лес
      </Text>
      <Text
        face="serif"
        style={{
          marginTop: 6,
          fontSize: theme.typography.sizes.body,
          color: theme.colors.textSecondary,
          lineHeight: 22,
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        каждая мысль оставляет дерево
      </Text>
    </View>
  );
}

function MonthDivider({ title, count }: { title: string; count: number }) {
  const theme = useTheme();

  return (
    <View style={styles.monthBlock}>
      <View style={[styles.monthRule, { backgroundColor: theme.colors.accentWarm }]} />
      <Text
        face="serif"
        style={{
          marginTop: 14,
          fontSize: theme.typography.sizes.title,
          lineHeight: 28,
          letterSpacing: 1.6,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.textPrimary,
          textAlign: "center",
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {title}
      </Text>
      <Text
        style={{
          marginTop: 4,
          marginBottom: 16,
          fontSize: theme.typography.sizes.caption,
          letterSpacing: 0.4,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {entriesLabel(count)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, overflow: "hidden" },
  headerCopy: {
    paddingTop: 6,
    paddingBottom: 18,
  },
  monthBlock: {
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "center",
  },
  monthRule: {
    width: 72,
    height: 2,
    borderRadius: 1,
    opacity: 0.7,
  },
  emptyCopy: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});
