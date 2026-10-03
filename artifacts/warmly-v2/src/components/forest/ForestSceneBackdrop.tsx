import React from "react";
import { Image, ImageSourcePropType, Platform, StyleSheet, View } from "react-native";
import { MeadowEdges } from "../../constants/groveScenes";
import { fitStaticBackground } from "../../services/forest/backgroundFit";

type Props = {
  source: ImageSourcePropType;
  edges: MeadowEdges;
  width: number;
  height: number;
  aspect: number;
};

const BLUR_ZOOM = 1.24;
const BLUR_RADIUS = Platform.OS === "android" ? 38 : 30;

/**
 * Сзади тот же кадр, размытый и на весь прямоугольник — закрывает поля.
 * Спереди тот же кадр целиком и резко. Дощечки на картинке нет.
 */
export function ForestSceneBackdrop({ source, edges, width, height, aspect }: Props) {
  const imageWidth = 1000;
  const imageHeight = imageWidth / aspect;
  const frame = fitStaticBackground(imageWidth, imageHeight, width, height);
  const blurW = width * BLUR_ZOOM;
  const blurH = height * BLUR_ZOOM;

  return (
    <View style={[styles.fill, { backgroundColor: edges.sky }]} pointerEvents="none">
      <Image
        source={source}
        blurRadius={BLUR_RADIUS}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        style={{
          position: "absolute",
          left: (width - blurW) / 2,
          top: (height - blurH) / 2,
          width: blurW,
          height: blurH,
        }}
      />
      <Image
        source={source}
        resizeMode="stretch"
        accessibilityIgnoresInvertColors
        style={{
          position: "absolute",
          left: frame.left,
          top: frame.top,
          width: frame.width,
          height: frame.height,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
});
