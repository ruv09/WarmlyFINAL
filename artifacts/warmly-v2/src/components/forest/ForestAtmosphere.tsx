import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";
import { useTheme } from "../../theme";

interface ForestAtmosphereProps {
  width: number;
  height: number;
}

/**
 * Неподвижное небо и атмосфера за картой леса.
 * Светлая тема — тёплое утро; тёмная — отдельный вечерний свет, не инверсия.
 */
export const ForestAtmosphere = memo(function ForestAtmosphere({
  width,
  height,
}: ForestAtmosphereProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";

  const skyTop = isDark ? "#2A243C" : "#F7F0E2";
  const skyMid = isDark ? "#211E30" : "#F0E6D4";
  const skyBottom = isDark ? "#1A1726" : "#E8DCC8";

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={skyTop} />
            <Stop offset="0.45" stopColor={skyMid} />
            <Stop offset="1" stopColor={skyBottom} />
          </LinearGradient>
          <RadialGradient id="sunGlow" cx="78%" cy="18%" rx="28%" ry="22%">
            <Stop offset="0" stopColor="#FFE6B0" stopOpacity={0.55} />
            <Stop offset="0.45" stopColor="#F5D090" stopOpacity={0.2} />
            <Stop offset="1" stopColor="#F5D090" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="moonGlow" cx="76%" cy="16%" rx="20%" ry="16%">
            <Stop offset="0" stopColor="#F0E6D0" stopOpacity={0.35} />
            <Stop offset="0.5" stopColor="#C8B8E0" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#C8B8E0" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill="url(#forestSky)" />

        {!isDark && (
          <>
            <Ellipse cx={width * 0.78} cy={height * 0.16} rx={width * 0.28} ry={height * 0.18} fill="url(#sunGlow)" />
            <Circle cx={width * 0.8} cy={height * 0.14} r={18} fill="#FFE8B8" opacity={0.55} />
          </>
        )}

        {isDark && (
          <>
            <Ellipse cx={width * 0.76} cy={height * 0.14} rx={width * 0.22} ry={height * 0.14} fill="url(#moonGlow)" />
            <Circle cx={width * 0.78} cy={height * 0.13} r={12} fill="#EDE4D4" opacity={0.75} />
            <Circle cx={width * 0.18} cy={height * 0.1} r={1.2} fill="#F0EAE2" opacity={0.45} />
            <Circle cx={width * 0.32} cy={height * 0.18} r={0.9} fill="#F0EAE2" opacity={0.35} />
            <Circle cx={width * 0.55} cy={height * 0.08} r={1.1} fill="#F0EAE2" opacity={0.4} />
            <Circle cx={width * 0.42} cy={height * 0.22} r={0.8} fill="#F0EAE2" opacity={0.3} />
          </>
        )}

        {/* Нижняя дымка у горизонта */}
        <Ellipse
          cx={width / 2}
          cy={height * 0.78}
          rx={width * 0.7}
          ry={height * 0.22}
          fill={isDark ? "#2C2740" : "#FFF9F0"}
          opacity={isDark ? 0.35 : 0.4}
        />
      </Svg>
    </View>
  );
});
