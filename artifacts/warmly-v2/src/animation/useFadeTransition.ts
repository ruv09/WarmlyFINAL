import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { DURATIONS, DurationToken } from "../theme/tokens/animation";
import { toNativeEasing } from "./easing";
import { useReducedMotion } from "./useReducedMotion";

interface UseFadeTransitionOptions {
  duration?: DurationToken;
}

/**
 * Плавное появление/исчезновение. Единственный способ анимировать
 * прозрачность в приложении — компонент не создаёт свой Animated.Value.
 */
export function useFadeTransition(visible: boolean, options: UseFadeTransitionOptions = {}) {
  const { duration = "fast" } = options;
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(visible ? 1 : 0);
      return;
    }
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: DURATIONS[duration],
      easing: toNativeEasing("standard"),
      useNativeDriver: true,
    }).start();
  }, [visible, duration, reducedMotion, opacity]);

  return opacity;
}
