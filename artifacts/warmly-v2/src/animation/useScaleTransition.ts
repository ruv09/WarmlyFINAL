import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { DURATIONS, DurationToken } from "../theme/tokens/animation";
import { toNativeEasing } from "./easing";
import { useReducedMotion } from "./useReducedMotion";

interface UseScaleTransitionOptions {
  duration?: DurationToken;
  /** Начальный масштаб перед появлением. Небольшое значение (около 1) —
   *  осознанно: заметная "накачка" элемента противоречит принципу
   *  "avoid flashy effects", здесь нужен едва уловимый эффект. */
  from?: number;
}

/**
 * Мягкое появление с лёгким увеличением от `from` до 1, вместе с fade —
 * чистый scale без сопутствующего fade на глаз читается как рывок,
 * а не как плавное появление, поэтому оба параметра анимируются вместе
 * от одного progress-значения.
 */
export function useScaleTransition(visible: boolean, options: UseScaleTransitionOptions = {}) {
  const { duration = "base", from = 0.96 } = options;
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

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [from, 1] });
  return { opacity: progress, transform: [{ scale }] };
}
