import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { useTheme } from "../../theme";

interface ForestAtmosphereProps {
  width: number;
  height: number;
}

/**
 * Атмосферный фон иллюстрированного леса:
 * светлая — тёплый кремовый день; тёмная — индиго-вечер со звёздами.
 */
export const ForestAtmosphere = memo(function ForestAtmosphere({
  width,
  height,
}: ForestAtmosphereProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const groundY = height * 0.58;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={isDark ? "#3A2B5C" : "#FFFDF9"} />
            <Stop offset="0.28" stopColor={isDark ? "#2A1F45" : "#F8F1E6"} />
            <Stop offset="0.62" stopColor={isDark ? "#1B1430" : "#EDE4D2"} />
            <Stop offset="1" stopColor={isDark ? "#100C1C" : "#D7CEB8"} />
          </LinearGradient>
          <RadialGradient id="sun" cx="78%" cy="18%" rx="34%" ry="24%">
            <Stop offset="0" stopColor="#FFE8B8" stopOpacity={0.55} />
            <Stop offset="0.55" stopColor="#F0D2A0" stopOpacity={0.18} />
            <Stop offset="1" stopColor="#F0D2A0" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="moon" cx="76%" cy="14%" rx="26%" ry="18%">
            <Stop offset="0" stopColor="#F2E8D4" stopOpacity={0.35} />
            <Stop offset="0.55" stopColor="#C8B8E0" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#C8B8E0" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="mist" cx="50%" cy="70%" rx="55%" ry="28%">
            <Stop offset="0" stopColor={isDark ? "#E8B975" : "#F5E6C8"} stopOpacity={isDark ? 0.1 : 0.22} />
            <Stop offset="1" stopColor={isDark ? "#E8B975" : "#F5E6C8"} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />

        {!isDark && (
          <>
            <Ellipse cx={width * 0.78} cy={height * 0.16} rx={width * 0.32} ry={height * 0.2} fill="url(#sun)" />
            <Circle cx={width * 0.8} cy={height * 0.14} r={18} fill="#FFE9C0" opacity={0.45} />
          </>
        )}

        {isDark && (
          <>
            <Ellipse cx={width * 0.76} cy={height * 0.13} rx={width * 0.24} ry={height * 0.15} fill="url(#moon)" />
            <Circle cx={width * 0.78} cy={height * 0.12} r={12} fill="#EDE4D4" opacity={0.75} />
            {[
              [0.1, 0.08],
              [0.22, 0.18],
              [0.38, 0.07],
              [0.52, 0.22],
              [0.33, 0.3],
              [0.64, 0.1],
              [0.88, 0.26],
            ].map(([x, y], i) => (
              <Circle
                key={i}
                cx={width * x}
                cy={height * y}
                r={1 + (i % 2) * 0.35}
                fill="#F0EAE2"
                opacity={0.28 + (i % 3) * 0.1}
              />
            ))}
          </>
        )}

        <Ellipse cx={width * 0.5} cy={height * 0.68} rx={width * 0.55} ry={height * 0.18} fill="url(#mist)" />

        {/* Мягкие холмы — земля, не плоская линия */}
        <Path
          d={`M0 ${groundY + 28}
              Q ${width * 0.18} ${groundY - 18} ${width * 0.4} ${groundY + 12}
              T ${width} ${groundY + 4}
              V ${height} H0 Z`}
          fill={isDark ? "#221C34" : "#D4C9B0"}
          opacity={0.9}
        />
        <Path
          d={`M0 ${groundY + 62}
              Q ${width * 0.28} ${groundY + 28} ${width * 0.55} ${groundY + 50}
              T ${width} ${groundY + 42}
              V ${height} H0 Z`}
          fill={isDark ? "#171322" : "#C5D0A8"}
          opacity={0.95}
        />
        <Path
          d={`M0 ${groundY + 110}
              Q ${width * 0.35} ${groundY + 78} ${width * 0.7} ${groundY + 98}
              T ${width} ${groundY + 90}
              V ${height} H0 Z`}
          fill={isDark ? "#120E1A" : "#B7C49A"}
          opacity={0.98}
        />

        {isDark && (
          <>
            <Ellipse cx={width * 0.5} cy={groundY + 78} rx={width * 0.2} ry={height * 0.05} fill="#E8A060" opacity={0.12} />
            {[
              [0.18, 0.72],
              [0.42, 0.66],
              [0.61, 0.74],
              [0.79, 0.69],
            ].map(([x, y], i) => (
              <Circle key={`f-${i}`} cx={width * x} cy={height * y} r={1.4} fill="#FFF2D0" opacity={0.35} />
            ))}
          </>
        )}
      </Svg>
    </View>
  );
});
