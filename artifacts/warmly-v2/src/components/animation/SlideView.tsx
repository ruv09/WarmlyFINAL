import React from "react";
import { Animated, ViewProps } from "react-native";
import { SlideDirection, useSlideTransition } from "../../animation";
import { DurationToken } from "../../theme/tokens/animation";

interface SlideViewProps extends ViewProps {
  visible: boolean;
  direction?: SlideDirection;
  distance?: number;
  duration?: DurationToken;
  children: React.ReactNode;
}

export function SlideView({
  visible,
  direction,
  distance,
  duration,
  style,
  children,
  ...rest
}: SlideViewProps) {
  const animatedStyle = useSlideTransition({ visible, direction, distance, duration });
  return (
    <Animated.View style={[style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}
