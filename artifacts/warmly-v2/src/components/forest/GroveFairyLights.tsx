import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useReducedMotion } from "../../animation";

const LIGHTS = [
  { x: 0.28, y: 0.2, size: 7, delay: 0, period: 2400 },
  { x: 0.52, y: 0.14, size: 6, delay: 380, period: 2800 },
  { x: 0.7, y: 0.24, size: 8, delay: 720, period: 2100 },
  { x: 0.4, y: 0.34, size: 5, delay: 160, period: 3100 },
  { x: 0.62, y: 0.38, size: 6, delay: 980, period: 2600 },
  { x: 0.22, y: 0.42, size: 5, delay: 540, period: 2300 },
  { x: 0.76, y: 0.42, size: 7, delay: 1200, period: 2700 },
] as const;

function Glow({
  left,
  top,
  size,
  delay,
  period,
  reducedMotion,
}: {
  left: number;
  top: number;
  size: number;
  delay: number;
  period: number;
  reducedMotion: boolean;
}) {
  const opacity = useRef(new Animated.Value(reducedMotion ? 0.55 : 0.35)).current;

  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.95,
          duration: period,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.22,
          duration: period + 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const start = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(start);
      loop.stop();
    };
  }, [delay, opacity, period, reducedMotion]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.glow,
        {
          left,
          top,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: size / 2,
          opacity,
        },
      ]}
    />
  );
}

/** Тёплые огоньки в кроне — только ночная сцена, без камеры. */
export function GroveFairyLights({ size }: { size: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {LIGHTS.map((light) => (
        <Glow
          key={`${light.x}-${light.y}`}
          left={light.x * size}
          top={light.y * size}
          size={light.size}
          delay={light.delay}
          period={light.period}
          reducedMotion={reducedMotion}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    backgroundColor: "#F4D48A",
    shadowColor: "#F6E0A0",
    shadowOpacity: 0.95,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
});
