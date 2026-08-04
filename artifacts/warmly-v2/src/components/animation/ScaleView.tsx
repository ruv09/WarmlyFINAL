import React from "react";
import { Animated, ViewProps } from "react-native";
import { useScaleTransition } from "../../animation";
import { DurationToken } from "../../theme/tokens/animation";

interface ScaleViewProps extends ViewProps {
  visible: boolean;
  duration?: DurationToken;
  from?: number;
  children: React.ReactNode;
}

export function ScaleView({ visible, duration, from, style, children, ...rest }: ScaleViewProps) {
  const animatedStyle = useScaleTransition(visible, { duration, from });
  return (
    <Animated.View style={[style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}
