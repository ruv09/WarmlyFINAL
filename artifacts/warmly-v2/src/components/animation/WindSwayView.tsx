import React from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { useWindSway } from "../../animation/useWindSway";

type Props = {
  seed?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/** Качает детей от нижней точки — ствол остаётся в земле. */
export function WindSwayView({ seed = 1, style, children }: Props) {
  const sway = useWindSway(seed);
  return <Animated.View style={[style, sway]}>{children}</Animated.View>;
}
