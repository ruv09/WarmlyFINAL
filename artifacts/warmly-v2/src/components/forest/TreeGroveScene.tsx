import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ScaleView } from "../animation";
import { TreeIllustration } from "../tree/TreeIllustration";
import { WoodenPlaque } from "./WoodenPlaque";
import { CatalogItem } from "../../services/forest/catalog";
import { fitStaticBackground } from "../../services/forest/backgroundFit";
import { GROVE_SCENE_PIXELS, getGroveScene } from "../../constants/groveScenes";
import { useTheme } from "../../theme";

type Props = {
  item: CatalogItem;
  onClose: () => void;
};

/**
 * Статичная сцена: исходный PNG поляны + дерево + табличка.
 * Фон масштабируется сам по себе (contain), без cover и без камеры леса.
 */
export function TreeGroveScene({ item, onClose }: Props) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const [shown, setShown] = useState(false);
  const sceneSource = getGroveScene(item.tree.species, isDark);
  const sceneFrame = fitStaticBackground(
    GROVE_SCENE_PIXELS.width,
    GROVE_SCENE_PIXELS.height,
    width,
    height,
  );
  const treeSize = Math.round(Math.min(width * 0.44, height * 0.34, 248));
  const plaqueMaxH = Math.round(height * 0.28);
  const plaqueWidth = Math.min(width - 48, 360);
  const stageBottom = Math.max(insets.bottom, 10) + 82;
  // Корни на нарисованной земле (~78% высоты PNG), не в небе.
  const treeTop = Math.round(sceneFrame.top + sceneFrame.height * 0.78 - treeSize);
  const treeLeft = Math.round(sceneFrame.left + (sceneFrame.width - treeSize) / 2);

  useEffect(() => {
    setShown(true);
  }, []);

  return (
    <View
      style={[styles.fill, { backgroundColor: isDark ? "#161428" : "#C9D8E6" }]}
      accessibilityViewIsModal
    >
      <Image
        source={sceneSource}
        style={[styles.sceneImage, sceneFrame]}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      <SafeAreaView edges={["top", "left", "right"]} style={styles.fill} pointerEvents="box-none">
        <ScaleView
          visible={shown}
          from={0.96}
          duration="base"
          style={[styles.stage, { paddingBottom: stageBottom }]}
          pointerEvents="box-none"
        >
          <View
            pointerEvents="none"
            style={[
              styles.treeSlot,
              {
                position: "absolute",
                top: treeTop,
                left: treeLeft,
                width: treeSize,
                height: treeSize,
              },
            ]}
          >
            <View
              style={[
                styles.groundShadow,
                {
                  width: treeSize * 0.52,
                  backgroundColor: isDark ? "rgba(8, 10, 22, 0.35)" : "rgba(58, 42, 24, 0.16)",
                },
              ]}
            />
            <TreeIllustration tree={item.tree} size={treeSize} />
          </View>

          <View style={styles.plaqueDock}>
            <WoodenPlaque item={item} maxHeight={plaqueMaxH} width={plaqueWidth} />
          </View>
        </ScaleView>
      </SafeAreaView>

      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Назад к каталогу"
        hitSlop={12}
        style={[
          styles.backBtn,
          {
            right: 20,
            bottom: Math.max(insets.bottom, 10) + 18,
            backgroundColor: isDark ? "#2A2340F2" : "#FFF9F0F2",
            borderColor: isDark ? "#FFFFFF22" : "#C4A07A66",
          },
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  sceneImage: {
    position: "absolute",
  },
  stage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  treeSlot: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  plaqueDock: {
    width: "100%",
    alignItems: "center",
  },
  groundShadow: {
    position: "absolute",
    bottom: 10,
    height: 14,
    borderRadius: 8,
  },
  backBtn: {
    position: "absolute",
    zIndex: 30,
    elevation: 12,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
