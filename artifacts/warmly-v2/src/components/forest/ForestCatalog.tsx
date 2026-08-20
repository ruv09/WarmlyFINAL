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
import { ForestAtmosphere } from "./ForestAtmosphere";
import { TreeIllustration } from "../tree/TreeIllustration";
import { useTheme } from "../../theme";
import { CatalogItem, MonthSection, groupForestByMonth, layoutMonthGrove } from "../../services/forest/catalog";
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
  const sections = useMemo(() => groupForestByMonth(entries, trees), [entries, trees]);

  const renderMonth = useCallback<ListRenderItem<MonthSection>>(
    ({ item, index }) => (
      <MonthGrove
        section={item}
        showDivider={index < sections.length - 1}
        onSelectItem={onSelectItem}
      />
    ),
    [onSelectItem, sections.length],
  );

  if (sections.length === 0) {
    return (
      <View style={styles.flex}>
        <ForestAtmosphere />
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
    <View style={styles.flex}>
      <ForestAtmosphere />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.mode === "dark" ? "#1A123048" : "#F3EBDC55" },
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
        ListHeaderComponent={
          <View style={styles.screenTitle}>
            <Text
              style={{
                fontSize: theme.typography.sizes.largeTitle,
                lineHeight: 32,
                letterSpacing: 1.6,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.textPrimary,
                textAlign: "center",
              }}
              maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
            >
              МОЙ ЛЕС
            </Text>
          </View>
        }
      />
    </View>
  );
}

function MonthGrove({
  section,
  showDivider,
  onSelectItem,
}: {
  section: MonthSection;
  showDivider: boolean;
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
      <Text
        style={{
          fontSize: theme.typography.sizes.title,
          lineHeight: 26,
          letterSpacing: 1.4,
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
          marginTop: 6,
          marginBottom: 8,
          fontSize: theme.typography.sizes.body,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
        maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
      >
        {treesLabel(section.count)}
      </Text>
      <View style={{ height: layout.height, width: "100%", overflow: "hidden" }}>
        {layout.spots.map((spot) => (
          <Pressable
            key={spot.item.entry.id}
            accessibilityRole="button"
            accessibilityLabel={`Дерево записи ${spot.item.entry.date}`}
            onPress={() => onSelectItem(spot.item)}
            style={{
              position: "absolute",
              left: spot.left,
              top: spot.top,
              width: spot.size,
              height: spot.size,
            }}
          >
            <TreeIllustration tree={spot.item.tree} fillParent />
          </Pressable>
        ))}
      </View>
      {showDivider ? (
        <View
          style={{
            alignSelf: "center",
            width: "42%",
            height: StyleSheet.hairlineWidth,
            backgroundColor: theme.colors.border,
            marginTop: 18,
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, overflow: "hidden" },
  screenTitle: {
    paddingTop: 4,
    paddingBottom: 20,
  },
  monthBlock: {
    paddingTop: 10,
    paddingBottom: 8,
  },
  emptyCopy: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});
