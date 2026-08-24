import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TreeIllustration } from "../tree/TreeIllustration";
import { useTheme } from "../../theme";
import {
  CatalogItem,
  MonthSection,
  groupForestByMonth,
  layoutMonthGrove,
} from "../../services/forest/catalog";
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
      <View
        pointerEvents="none"
        style={[
          styles.skyWash,
          { backgroundColor: isDark ? "#1C1A32" : theme.colors.groveSky },
        ]}
      />
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

function MonthGrove({
  section,
  onSelectItem,
}: {
  section: MonthSection;
  onSelectItem: (item: CatalogItem) => void;
}) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const layout = useMemo(
    () => (width > 0 ? layoutMonthGrove(section.items, width) : { spots: [], height: 0 }),
    [section.items, width],
  );

  function onLayout(event: LayoutChangeEvent) {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== width) setWidth(next);
  }

  return (
    <View style={styles.monthBlock} onLayout={onLayout}>
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
      <View style={{ height: layout.height, width: "100%", overflow: "visible" }}>
        {layout.spots.map((spot) => {
          const hit = Math.max(56, spot.size + 16);
          const extra = (hit - spot.size) / 2;
          return (
            <Pressable
              key={spot.item.entry.id}
              accessibilityRole="button"
              accessibilityLabel={`Дерево записи ${spot.item.entry.date}`}
              onPress={() => onSelectItem(spot.item)}
              hitSlop={8}
              style={{
                position: "absolute",
                left: spot.left - extra,
                top: spot.top - extra,
                width: hit,
                height: hit,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ width: spot.size, height: spot.size }}>
                <TreeIllustration tree={spot.item.tree} fillParent />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, overflow: "hidden" },
  skyWash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    opacity: 0.42,
  },
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
    paddingBottom: 22,
  },
  monthHead: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
    gap: 12,
  },
  emptyCopy: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});
