import React, { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../theme";

interface ForestAmbientProps {
  width: number;
  height: number;
  groundY: number;
  camX: SharedValue<number>;
  reduceMotion: boolean;
}

/**
 * Тихие события: птица, лист, пылинки. Редко и почти незаметно.
 */
export const ForestAmbient = memo(function ForestAmbient({
  width,
  height,
  groundY,
  reduceMotion,
}: ForestAmbientProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const birdX = useSharedValue(-40);
  const birdY = useSharedValue(groundY * 0.42);
  const leafY = useSharedValue(-20);
  const leafX = useSharedValue(width * 0.62);
  const mote = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    birdX.value = -50;
    birdX.value = withRepeat(
      withSequence(
        withDelay(16000, withTiming(width + 60, { duration: 9000, easing: Easing.inOut(Easing.quad) })),
        withDelay(22000, withTiming(-50, { duration: 0 })),
      ),
      -1,
      false,
    );
    birdY.value = withRepeat(
      withTiming(groundY * 0.42 + 12, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    leafY.value = -30;
    leafY.value = withRepeat(
      withSequence(
        withDelay(11000, withTiming(height + 20, { duration: 14000, easing: Easing.linear })),
        withTiming(-30, { duration: 0 }),
      ),
      -1,
      false,
    );
    leafX.value = withRepeat(
      withTiming(width * 0.62 + 28, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    mote.value = withRepeat(withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [birdX, birdY, groundY, height, leafX, leafY, mote, reduceMotion, width]);

  const birdStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: birdX.value,
    top: birdY.value,
    width: 10,
    height: 4,
    borderRadius: 2,
    backgroundColor: isDark ? "rgba(232, 214, 180, 0.35)" : "rgba(90, 80, 60, 0.28)",
    opacity: reduceMotion ? 0 : 0.7,
  }));

  const leafStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: leafX.value,
    top: leafY.value,
    width: 7,
    height: 10,
    borderRadius: 4,
    backgroundColor: isDark ? "rgba(180, 140, 70, 0.35)" : "rgba(120, 140, 70, 0.4)",
    transform: [{ rotate: `${leafY.value * 0.4}deg` }],
    opacity: reduceMotion ? 0 : 0.65,
  }));

  const moteStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0 : 0.08 + mote.value * 0.1,
  }));

  if (reduceMotion) return null;

  return (
    <View pointerEvents="none" style={{ ...StyleSheetFill }}>
      <Animated.View style={birdStyle} />
      <Animated.View style={leafStyle} />
      <Animated.View
        style={[
          moteStyle,
          {
            position: "absolute",
            left: width * 0.3,
            top: height * 0.28,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: isDark ? "#E8B975" : "#FFF8E0",
          },
        ]}
      />
    </View>
  );
});

const StyleSheetFill = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
