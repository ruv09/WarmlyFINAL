import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { GROVE_SCENE_PIXELS, MeadowEdges } from "../../constants/groveScenes";
import { fitStaticBackground } from "../../services/forest/backgroundFit";

type Props = {
  source: ImageSourcePropType;
  edges: MeadowEdges;
  width: number;
  height: number;
};

/**
 * Поляна целиком, без cover-зума.
 * Свободные края экрана продолжают небо и землю той же картины.
 */
export function ForestSceneBackdrop({ source, edges, width, height }: Props) {
  const frame = fitStaticBackground(
    GROVE_SCENE_PIXELS.width,
    GROVE_SCENE_PIXELS.height,
    width,
    height,
  );

  return (
    <View style={styles.fill} pointerEvents="none">
      <View style={[styles.fill, { backgroundColor: edges.sky }]} />
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: Math.max(0, height - frame.top - frame.height * 0.45),
          backgroundColor: edges.ground,
        }}
      />
      <Image
        source={source}
        style={{
          position: "absolute",
          left: frame.left,
          top: frame.top,
          width: frame.width,
          height: frame.height,
        }}
        resizeMode="stretch"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
  },
});
