import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { useTheme } from "../../theme";

interface ForestAtmosphereProps {
  width: number;
  height: number;
}

/**
 * Фон экрана «Лес» по референсам:
 * светлая — минимализм + природный уют;
 * тёмная — сказочный лес + тёплый вечер (не инверсия).
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
            <Stop offset="0" stopColor={isDark ? "#3A2A58" : "#FFFDF8"} />
            <Stop offset="0.35" stopColor={isDark ? "#2A1E42" : "#F7F1E6"} />
            <Stop offset="0.7" stopColor={isDark ? "#1E1632" : "#EDE4D4"} />
            <Stop offset="1" stopColor={isDark ? "#14101E" : "#D8CEB8"} />
          </LinearGradient>
          <RadialGradient id="sun" cx="82%" cy="16%" rx="30%" ry="22%">
            <Stop offset="0" stopColor="#FFE6B0" stopOpacity={0.65} />
            <Stop offset="0.5" stopColor="#F5D090" stopOpacity={0.22} />
            <Stop offset="1" stopColor="#F5D090" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="moon" cx="78%" cy="14%" rx="22%" ry="16%">
            <Stop offset="0" stopColor="#F0E6D0" stopOpacity={0.4} />
            <Stop offset="0.55" stopColor="#C8B8E0" stopOpacity={0.14} />
            <Stop offset="1" stopColor="#C8B8E0" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="camp" cx="50%" cy="72%" rx="28%" ry="18%">
            <Stop offset="0" stopColor="#E8A060" stopOpacity={isDark ? 0.4 : 0} />
            <Stop offset="0.5" stopColor="#E8A060" stopOpacity={isDark ? 0.12 : 0} />
            <Stop offset="1" stopColor="#E8A060" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />

        {!isDark && (
          <>
            <Ellipse cx={width * 0.82} cy={height * 0.14} rx={width * 0.3} ry={height * 0.18} fill="url(#sun)" />
            <Circle cx={width * 0.84} cy={height * 0.12} r={16} fill="#FFE8B8" opacity={0.55} />
          </>
        )}

        {isDark && (
          <>
            <Ellipse cx={width * 0.78} cy={height * 0.12} rx={width * 0.22} ry={height * 0.14} fill="url(#moon)" />
            <Circle cx={width * 0.8} cy={height * 0.11} r={11} fill="#EDE4D4" opacity={0.8} />
            {[
              [0.12, 0.08],
              [0.28, 0.16],
              [0.45, 0.07],
              [0.58, 0.2],
              [0.35, 0.28],
            ].map(([x, y], i) => (
              <Circle key={i} cx={width * x} cy={height * y} r={1 + (i % 2) * 0.3} fill="#F0EAE2" opacity={0.35 + (i % 3) * 0.1} />
            ))}
            <Ellipse cx={width * 0.5} cy={height * 0.7} rx={width * 0.35} ry={height * 0.16} fill="url(#camp)" />
          </>
        )}

        {/* Холмы / земля — линия горизонта как на референсе */}
        <Path
          d={`M0 ${groundY + 40}
              Q ${width * 0.2} ${groundY - 10} ${width * 0.45} ${groundY + 20}
              T ${width} ${groundY + 8}
              V ${height} H0 Z`}
          fill={isDark ? "#241E34" : "#D8CDB8"}
          opacity={0.85}
        />
        <Path
          d={`M0 ${groundY + 70}
              Q ${width * 0.3} ${groundY + 35} ${width * 0.55} ${groundY + 55}
              T ${width} ${groundY + 48}
              V ${height} H0 Z`}
          fill={isDark ? "#1C1828" : "#C8D2AE"}
          opacity={0.95}
        />

        {isDark && (
          <>
            <Circle cx={width * 0.5} cy={groundY + 58} r={8} fill="#E8A060" opacity={0.55} />
            <Circle cx={width * 0.5} cy={groundY + 54} r={4} fill="#F6D090" opacity={0.8} />
            <Path
              d={`M${width * 0.5 - 16} ${groundY + 68} Q ${width * 0.5} ${groundY + 76} ${width * 0.5 + 16} ${groundY + 68}`}
              stroke="#5A4030"
              strokeWidth={3}
              fill="none"
              opacity={0.55}
            />
          </>
        )}
      </Svg>
    </View>
  );
});
