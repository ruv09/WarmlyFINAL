import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ScaleView, WindSwayView } from "../animation";
import { TreeIllustration } from "../tree/TreeIllustration";
import { WoodenPlaque } from "./WoodenPlaque";
import { GroveFairyLights } from "./GroveFairyLights";
import { CatalogItem } from "../../services/forest/catalog";
import { fitStaticBackground } from "../../services/forest/backgroundFit";
import { GROVE_SCENE_PIXELS, getGroveScene } from "../../constants/groveScenes";
import { useTheme } from "../../theme";

type Props = {
  item: CatalogItem;
  onClose: () => void;
};

/**
 * Статичная сцена: картина поляны + дерево, посаженное в её землю.
 * Без камеры, жестов и джойстика. Назад — справа снизу.
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
  const treeSize = Math.round(Math.min(width * 0.5, height * 0.38, 268));
  const plaqueMaxH = Math.round(height * 0.28);
  const plaqueWidth = Math.min(width - 48, 360);
  const stageBottom = Math.max(insets.bottom, 10) + 82;
  // Корни на нарисованной земле (~78% высоты PNG), не в небе.
  const treeTop = Math.round(sceneFrame.top + sceneFrame.height * 0.78 - treeSize);
  const treeLeft = Math.round(sceneFrame.left + (sceneFrame.width - treeSize) / 2);
  const swaySeed = item.tree.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  useEffect(() => {
    setShown(true);
  }, []);

  return (
    <View
      style={[styles.fill, { backgroundColor: theme.colors.groveSky }]}
      accessibilityViewIsModal
    >
      <Image
        source={sceneSource}
        style={[styles.sceneImage, sceneFrame]}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <View
        pointerEvents="none"
        style={[
          styles.sceneGrade,
          {
            backgroundColor: isDark ? "rgba(16, 14, 32, 0.1)" : "rgba(236, 226, 200, 0.08)",
          },
        ]}
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
              styles.rootTuck,
              {
                top: treeTop,
                left: treeLeft,
                width: treeSize,
                height: treeSize,
              },
            ]}
          >
            <View
              style={{
                width: treeSize * 0.2,
                height: 8,
                borderRadius: 4,
                marginBottom: 2,
                backgroundColor: isDark ? "rgba(24, 36, 24, 0.4)" : "rgba(108, 128, 72, 0.28)",
              }}
            />
          </View>
          <WindSwayView
            seed={swaySeed}
            style={[
              styles.treeSlot,
              {
                top: treeTop,
                left: treeLeft,
                width: treeSize,
                height: treeSize,
              },
            ]}
          >
            <TreeIllustration tree={item.tree} size={treeSize} planted />
            {isDark ? <GroveFairyLights size={treeSize} /> : null}
          </WindSwayView>

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
            backgroundColor: theme.colors.overlay,
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
  sceneGrade: {
    ...StyleSheet.absoluteFillObject,
  },
  stage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  treeSlot: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rootTuck: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  plaqueDock: {
    width: "100%",
    alignItems: "center",
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
