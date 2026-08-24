import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Тихий ветер: качание от корня, без джойстика и камеры.
 * Амплитуда специально маленькая — дерево живое, не «машет».
 */
export function useWindSway(seed = 1) {
  const reducedMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(0.5)).current;
  const durationOut = 3200 + (seed % 5) * 220;
  const durationBack = 3900 + (seed % 7) * 180;

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: durationOut,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: durationBack,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [durationBack, durationOut, progress, reducedMotion]);

  const degrees = 1.05 + (seed % 3) * 0.12;
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [`-${degrees}deg`, `${degrees + 0.15}deg`],
  });

  return useMemo(
    () => ({
      transformOrigin: "bottom" as const,
      transform: [{ rotate }],
    }),
    [rotate],
  );
}
