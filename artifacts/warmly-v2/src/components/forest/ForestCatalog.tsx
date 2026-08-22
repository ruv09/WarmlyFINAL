import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TreeIllustration } from "../tree/TreeIllustration";
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

export function ForestCatalog({ entries, trees, onSelectItem, bottomInset, isLoading }: Props) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const sections = useMemo(() => groupForestByMonth(entries, trees), [entries, trees]);

  const renderMonth = useCallback<ListRenderItem<MonthSection>>(
    ({ item }) => <MonthGrove section={item} onSelectItem={onSelectItem} />,
    [onSelectItem],
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
        ItemSeparatorComponent={() => (
          <View
            style={{
              alignSelf: "center",
              width: "36%",
              height: StyleSheet.hairlineWidth,
              backgroundColor: isDark ? "#3A3258" : "#E4D8C4",
              marginVertical: 8,
            }}
          />
        )}
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
            backgroundColor: isDark ? "#2A2340CC" : "#FFF9F0CC",
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons name="leaf" size={18} color={isDark ? theme.colors.accentWarm : theme.colors.accent} />
      </View>
    </View>
  );
}

function MonthGrove({
  section,
  onSelectItem,
}: {
  section: MonthSection;
  onSelectItem: (item: CatalogItem) => void;
}) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const cols = width < 360 ? 3 : width < 720 ? 3 : 4;
  const treeSize = width < 360 ? 78 : width < 720 ? 92 : 110;

  return (
    <View style={styles.monthBlock}>
      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          lineHeight: 26,
          fontWeight: theme.typography.weights.bold,
          color: theme.colors.textPrimary,
          textAlign: "center",
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {section.title}
      </Text>
      <Text
        style={{
          marginTop: 4,
          marginBottom: 14,
          fontSize: theme.typography.sizes.body,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {treesLabel(section.count)}
      </Text>
      <View style={styles.grid}>
        {section.items.map((item) => (
          <Pressable
            key={item.entry.id}
            accessibilityRole="button"
            accessibilityLabel={`Дерево записи ${item.entry.date}`}
            onPress={() => onSelectItem(item)}
            style={{
              width: `${100 / cols}%`,
              alignItems: "center",
              paddingVertical: 6,
            }}
          >
            <TreeIllustration tree={item.tree} size={treeSize} />
          </Pressable>
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emptyCopy: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});
