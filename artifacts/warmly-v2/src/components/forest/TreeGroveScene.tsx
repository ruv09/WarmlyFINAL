import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FadeView, ScaleView } from "../animation";
import { WoodenPlaque } from "./WoodenPlaque";
import { ForestSceneBackdrop } from "./ForestSceneBackdrop";
import { CatalogItem } from "../../services/forest/catalog";
import { getGroveEdges, getGroveScene } from "../../constants/groveScenes";
import { getTreeDefinition } from "../../constants/treeDefinitions";
import { resolveSceneMode } from "../../constants/sceneMode";
import { SceneMode } from "../../types";
import { useTheme } from "../../theme";

type Props = {
  item: CatalogItem;
  onClose: () => void;
  sceneMode?: SceneMode | null;
};

/**
 * Большая сцена и наша дощечка с текстом записи.
 * Назад справа снизу — настоящая кнопка.
 */
export function TreeGroveScene({ item, onClose, sceneMode: sceneModeOverride }: Props) {
  const theme = useTheme();
  const mode = resolveSceneMode(sceneModeOverride ?? (theme.mode === "dark" ? "night" : "day"));
  const isNight = mode === "night";
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [shown, setShown] = useState(false);
  const width = box.width || window.width;
  const height = box.height || window.height;
  const tree = getTreeDefinition(item.tree.species);
  const sceneSource = getGroveScene(item.tree.species, mode);
  const edges = getGroveEdges(item.tree.species, mode);
  const plaqueWidth = Math.min(width * 0.82, 380);
  const plaqueMaxH = Math.round(height * 0.34);

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
      style={[styles.fill, { backgroundColor: edges.sky }]}
      accessibilityViewIsModal
      onLayout={onBoxLayout}
    >
      <ForestSceneBackdrop
        source={sceneSource}
        edges={edges}
        width={width}
        height={height}
        aspect={tree.sceneAspect}
      />

      <SafeAreaView edges={["top", "left", "right"]} style={styles.fill} pointerEvents="box-none">
        <FadeView visible={shown} duration="base" style={styles.fill} pointerEvents="box-none">
          <ScaleView
            visible={shown}
            from={0.98}
            duration="base"
            style={[styles.stage, { paddingBottom: Math.max(insets.bottom, 10) + 88 }]}
            pointerEvents="box-none"
          >
            <WoodenPlaque item={item} sceneMode={mode} maxHeight={plaqueMaxH} width={plaqueWidth} />
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
  stage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
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
