import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { DURATIONS, DurationToken } from "../theme/tokens/animation";
import { toNativeEasing } from "./easing";
import { useReducedMotion } from "./useReducedMotion";

export type SlideDirection = "up" | "down" | "left" | "right";

interface UseSlideTransitionOptions {
  visible: boolean;
  direction?: SlideDirection;
  /** Дистанция в dp. Небольшая по умолчанию — сдвиг должен ощущаться
   *  как лёгкое смещение, а не полёт элемента через весь экран. */
  distance?: number;
  duration?: DurationToken;
}

function directionOffset(direction: SlideDirection, distance: number) {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
  }
}

/**
 * Лёгкое смещение вместе с fade — например, появление карточки записи
 * или всплывающей подсказки. Всегда сопровождается изменением opacity,
 * чистый slide без fade на коротких дистанциях почти не читается
 * как анимация, а лишь как "дёрганье".
 */
export function useSlideTransition({
  visible,
  direction = "up",
  distance = 12,
  duration = "base",
}: UseSlideTransitionOptions) {
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(visible ? 1 : 0);
      return;
    }
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: DURATIONS[duration],
      easing: toNativeEasing(visible ? "decelerate" : "accelerate"),
      useNativeDriver: true,
    }).start();
  }, [visible, duration, reducedMotion, progress]);

  const offset = directionOffset(direction, distance);
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [offset.x, 0] });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [offset.y, 0] });

  return { opacity: progress, transform: [{ translateX }, { translateY }] };
}
