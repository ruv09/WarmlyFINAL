import React from "react";
import { Animated, Pressable, PressableProps } from "react-native";
import { useSoftPress } from "../../animation";

interface PressableScaleProps extends PressableProps {
  pressedScale?: number;
  children: React.ReactNode;
}

/**
 * Замена обычному Pressable там, где нужна тактильная обратная связь
 * на нажатие (кнопки, карточки). Использует единственный в приложении
 * профиль пружины (SPRING_CONFIGS.soft) — см. /ANIMATION.md.
 */
export function PressableScale({
  pressedScale,
  style,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const { scale, onPressIn: animateIn, onPressOut: animateOut } = useSoftPress({ pressedScale });

  return (
    <Pressable
      style={style}
      onPressIn={(event) => {
        animateIn();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateOut();
        onPressOut?.(event);
      }}
      {...rest}
    >
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </Pressable>
  );
}
