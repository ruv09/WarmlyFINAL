import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ForestAtmosphere } from "./ForestAtmosphere";
import { ScaleView } from "../animation";
import { TreeIllustration } from "../tree/TreeIllustration";
import { CatalogItem } from "../../services/forest/catalog";
import { parseDateKey } from "../../utils/date";
import { useTheme } from "../../theme";

const TAB_BAR_CLEARANCE = 66;

type Props = {
  item: CatalogItem;
  onClose: () => void;
};

function formatPlaqueDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Статичная сцена одного дерева: атмосфера леса + выбранное дерево + табличка записи.
 */
export function TreeGroveScene({ item, onClose }: Props) {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const [shown, setShown] = useState(false);
  const treeSize = Math.round(Math.min(280, height * 0.34));
  const plaqueMaxH = Math.round(height * 0.28);

  useEffect(() => {
    setShown(true);
  }, []);

  return (
    <View style={styles.fill} accessibilityViewIsModal>
      <ForestAtmosphere />
      <SafeAreaView edges={["top", "left", "right"]} style={styles.fill}>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Назад к каталогу"
          style={[
            styles.backBtn,
            {
              backgroundColor: theme.mode === "dark" ? "#2A2340CC" : "#FFF9F0CC",
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.textPrimary} />
        </Pressable>

        <ScaleView visible={shown} from={0.94} duration="base" style={styles.stage}>
          <View style={styles.treeWrap}>
            <TreeIllustration tree={item.tree} size={treeSize} />
          </View>

          <View
            style={[
              styles.plaque,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                maxHeight: plaqueMaxH,
                marginBottom: TAB_BAR_CLEARANCE + 12,
              },
            ]}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.caption,
                color: theme.colors.textSecondary,
                textAlign: "center",
                textTransform: "capitalize",
              }}
              maxFontSizeMultiplier={theme.typography.scaleLimits.ui}
            >
              {formatPlaqueDate(item.entry.date)}
              {item.entry.time ? ` · ${item.entry.time}` : ""}
            </Text>
            <ScrollView
              style={{ maxHeight: plaqueMaxH - 48 }}
              contentContainerStyle={{ paddingTop: 10 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {item.entry.note.length > 0 ? (
                <Text
                  style={{
                    fontSize: theme.typography.sizes.body,
                    color: theme.colors.textPrimary,
                    lineHeight: theme.typography.sizes.body * 1.45,
                    textAlign: "center",
                  }}
                  maxFontSizeMultiplier={theme.typography.scaleLimits.content}
                >
                  {item.entry.note}
                </Text>
              ) : null}
              {item.entry.smallWin ? (
                <Text
                  style={{
                    marginTop: 10,
                    color: theme.colors.accentWarm,
                    fontStyle: "italic",
                    textAlign: "center",
                    fontSize: theme.typography.sizes.caption,
                  }}
                  maxFontSizeMultiplier={theme.typography.scaleLimits.content}
                >
                  ✦ {item.entry.smallWin}
                </Text>
              ) : null}
            </ScrollView>
          </View>
        </ScaleView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backBtn: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 28,
  },
  treeWrap: {
    alignItems: "center",
    marginBottom: 8,
  },
  plaque: {
    alignSelf: "stretch",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
});
