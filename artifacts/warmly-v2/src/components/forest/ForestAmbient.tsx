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
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../theme";

interface ForestAmbientProps {
  width: number;
  height: number;
  groundY: number;
  camX: SharedValue<number>;
  camZ: SharedValue<number>;
  reduceMotion: boolean;
}

/**
 * Тихие события: птица, лист, пылинки. Редко и почти незаметно.
 */
export const ForestAmbient = memo(function ForestAmbient({
  width,
  height,
  groundY,
  camX,
  camZ,
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
    left: birdX.value - camX.value * 0.22,
    top: birdY.value + Math.min(18, camZ.value * 0.01),
    width: 18,
    height: 10,
    opacity: reduceMotion ? 0 : 0.55,
  }));

  const leafStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: leafX.value - camX.value * 0.4,
    top: leafY.value,
    width: 8,
    height: 11,
    borderRadius: 5,
    backgroundColor: isDark ? "rgba(180, 140, 70, 0.4)" : "rgba(140, 160, 90, 0.45)",
    transform: [{ rotate: `${leafY.value * 0.4}deg` }],
    opacity: reduceMotion ? 0 : 0.7,
  }));

  const moteStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0 : 0.08 + mote.value * 0.1,
  }));

  if (reduceMotion) return null;

  return (
    <View pointerEvents="none" style={{ ...StyleSheetFill }}>
      <Animated.View style={birdStyle}>
        <Svg width={18} height={10}>
          <Path
            d="M1 7 Q 6 1.5 9 5.5 Q 12 1.5 17 7 Q 12 8 9 6.5 Q 6 8 1 7 Z"
            fill={isDark ? "#E8D6B0" : "#7A6A58"}
            opacity={0.55}
          />
        </Svg>
      </Animated.View>
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
