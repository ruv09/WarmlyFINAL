import React, { useEffect, useState } from "react";
import { Image, LayoutChangeEvent, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FadeView, ScaleView } from "../animation";
import { TreeIllustration } from "../tree/TreeIllustration";
import { WoodenPlaque } from "./WoodenPlaque";
import { CatalogItem } from "../../services/forest/catalog";
import { fitStaticBackground } from "../../services/forest/backgroundFit";
import { GROVE_SCENE_PIXELS, getGroveScene } from "../../constants/groveScenes";
import { resolveSceneMode } from "../../constants/sceneMode";
import { SceneMode } from "../../types";
import { useTheme } from "../../theme";

type Props = {
  item: CatalogItem;
  onClose: () => void;
  sceneMode?: SceneMode | null;
};

/**
 * Полноэкранная сцена записи: небо, целое дерево, дощечка, назад справа снизу.
 * Без камеры, жестов и джойстика.
 */
export function TreeGroveScene({ item, onClose, sceneMode: sceneModeOverride }: Props) {
  const theme = useTheme();
  const mode = resolveSceneMode(sceneModeOverride);
  const isNight = mode === "night";
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [shown, setShown] = useState(false);
  const width = box.width || window.width;
  const height = box.height || window.height;
  const sceneSource = getGroveScene(item.tree.species, mode);
  const sceneFrame = fitStaticBackground(
    GROVE_SCENE_PIXELS.width,
    GROVE_SCENE_PIXELS.height,
    width,
    height,
  );
  const treeSize = Math.round(Math.min(width * 0.48, height * 0.34, 280));
  const plaqueMaxH = Math.round(height * 0.26);
  const plaqueWidth = Math.min(width * 0.86, 400);
  const stageBottom = Math.max(insets.bottom, 10) + 86;
  const treeTop = Math.round(sceneFrame.top + sceneFrame.height * 0.7 - treeSize);
  const treeLeft = Math.round(sceneFrame.left + (sceneFrame.width - treeSize) / 2);

  useEffect(() => {
    setShown(true);
  }, []);

  function onBoxLayout(event: LayoutChangeEvent) {
    const next = event.nativeEvent.layout;
    if (next.width === box.width && next.height === box.height) return;
    setBox({ width: next.width, height: next.height });
  }

  return (
    <View
      style={[styles.fill, { backgroundColor: theme.colors.background }]}
      accessibilityViewIsModal
      onLayout={onBoxLayout}
    >
      <Image
        source={sceneSource}
        style={styles.sceneFill}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <View
        pointerEvents="none"
        style={[
          styles.sceneGrade,
          {
            backgroundColor: isNight ? "rgba(16, 14, 32, 0.08)" : "rgba(236, 226, 200, 0.06)",
          },
        ]}
      />

      <SafeAreaView edges={["top", "left", "right"]} style={styles.fill} pointerEvents="box-none">
        <FadeView visible={shown} duration="base" style={styles.fill} pointerEvents="box-none">
          <ScaleView
            visible={shown}
            from={0.97}
            duration="base"
            style={[styles.stage, { paddingBottom: stageBottom }]}
            pointerEvents="box-none"
          >
            <View
              pointerEvents="none"
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
              <TreeIllustration tree={item.tree} size={treeSize} planted sceneMode={mode} />
            </View>

            <View style={styles.plaqueDock}>
              <WoodenPlaque item={item} sceneMode={mode} maxHeight={plaqueMaxH} width={plaqueWidth} />
            </View>
          </ScaleView>
        </FadeView>
      </SafeAreaView>

      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Назад"
        hitSlop={12}
        style={[
          styles.backBtn,
          {
            right: 20,
            bottom: Math.max(insets.bottom, 10) + 18,
            backgroundColor: isNight ? "rgba(22, 20, 40, 0.55)" : "rgba(246, 241, 228, 0.62)",
            borderColor: isNight ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.7)",
          },
        ]}
      >
        <Ionicons name="arrow-back" size={22} color={isNight ? "#F0E8DC" : "#3C3A32"} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  sceneFill: {
    ...StyleSheet.absoluteFill,
  },
  sceneGrade: {
    ...StyleSheet.absoluteFill,
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
    borderWidth: 1.5,
  },
});
