import React from "react";
import { Animated, ViewProps } from "react-native";
import { useFadeTransition } from "../../animation";
import { DurationToken } from "../../theme/tokens/animation";

interface FadeViewProps extends ViewProps {
  visible: boolean;
  duration?: DurationToken;
  children: React.ReactNode;
}

/**
 * Пример: <FadeView visible={hasSavedToday}>...</FadeView>
 * Компонент, который использует FadeView, не импортирует Animated
 * и не выбирает длительность/кривую вручную.
 */
export function FadeView({ visible, duration, style, children, ...rest }: FadeViewProps) {
  const opacity = useFadeTransition(visible, { duration });
  return (
    <Animated.View style={[style, { opacity }]} {...rest}>
      {children}
    </Animated.View>
  );
}
