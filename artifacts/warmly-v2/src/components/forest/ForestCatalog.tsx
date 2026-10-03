import React, { useCallback, useMemo } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui";
import { TreeCatalogCard } from "./TreeCatalogCard";
import { useTheme } from "../../theme";
import { CatalogItem, MonthSection, groupForestByMonth } from "../../services/forest/catalog";
import { Entry, Tree } from "../../types";
import { treesLabel } from "../../utils";

const TAB_BAR_CLEARANCE = 66;

type Props = {
  entries: Entry[];
  trees: Tree[];
  onSelectItem: (item: CatalogItem) => void;
  bottomInset: number;
  isLoading?: boolean;
};

function numberByOldest(sections: MonthSection[]): Map<string, number> {
  const items = sections
    .flatMap((section) => section.items)
    .sort((a, b) => (a.entry.createdAt < b.entry.createdAt ? -1 : 1));
  return new Map(items.map((item, index) => [item.entry.id, index + 1]));
}

export function ForestCatalog({ entries, trees, onSelectItem, bottomInset, isLoading }: Props) {
  const theme = useTheme();
  const sections = useMemo(() => groupForestByMonth(entries, trees), [entries, trees]);
  const numbers = useMemo(() => numberByOldest(sections), [sections]);

  const renderMonth = useCallback<ListRenderItem<MonthSection>>(
    ({ item }) => (
      <MonthCards section={item} numbers={numbers} onSelectItem={onSelectItem} />
    ),
    [numbers, onSelectItem],
  );

  if (sections.length === 0) {
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
              Каждая запись станет деревом в твоём лесу.
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={sections}
        keyExtractor={(section) => section.key}
        renderItem={renderMonth}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={3}
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
  const isDark = theme.mode === "dark";

  return (
    <View style={styles.headerRow}>
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
          style={{
            marginTop: 4,
            fontSize: theme.typography.sizes.body,
            color: theme.colors.textSecondary,
          }}
          maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
        >
          твоя коллекция моментов
        </Text>
      </View>
      <View
        style={[
          styles.leafBtn,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons name="leaf" size={18} color={isDark ? theme.colors.accentWarm : theme.colors.accent} />
      </View>
    </View>
  );
}

function MonthCards({
  section,
  numbers,
  onSelectItem,
}: {
  section: MonthSection;
  numbers: Map<string, number>;
  onSelectItem: (item: CatalogItem) => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.monthBlock}>
      <View style={styles.monthHead}>
        <Text
          style={{
            flex: 1,
            fontSize: theme.typography.sizes.title,
            lineHeight: 26,
            letterSpacing: 1.2,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.textPrimary,
          }}
          maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
        >
          {section.title}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.body,
            color: theme.colors.textSecondary,
          }}
          maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
        >
          {treesLabel(section.count)}
        </Text>
      </View>
      <View style={styles.grid}>
        {section.items.map((item) => (
          <TreeCatalogCard
            key={item.entry.id}
            item={item}
            index={numbers.get(item.entry.id) ?? 1}
            onPress={() => onSelectItem(item)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, overflow: "hidden" },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingBottom: 22,
  },
  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  leafBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  monthBlock: {
    paddingTop: 10,
    paddingBottom: 8,
  },
  monthHead: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
    gap: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyCopy: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});
