import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { MeadowEdges } from "../../constants/groveScenes";
import { fitStaticBackground } from "../../services/forest/backgroundFit";

type Props = {
  source: ImageSourcePropType;
  edges: MeadowEdges;
  width: number;
  height: number;
  aspect: number;
};

/**
 * Готовая сцена с референса целиком, без зума и без накладного дерева.
 */
export function ForestSceneBackdrop({ source, edges, width, height, aspect }: Props) {
  const imageWidth = 1000;
  const imageHeight = imageWidth / aspect;
  const frame = fitStaticBackground(imageWidth, imageHeight, width, height);

  return (
    <View style={[styles.fill, { backgroundColor: edges.sky }]} pointerEvents="none">
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
