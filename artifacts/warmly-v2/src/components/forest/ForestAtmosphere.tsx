import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { useTheme } from "../../theme";

interface ForestAtmosphereProps {
  width: number;
  height: number;
}

/**
 * Фон леса по референсам:
 * светлая — концепт 2 «Природный уют» (кремовое небо, холмы);
 * тёмная — 4 «Сказочный лес» + 5 «Тёплый вечер» (индиго, светлячки, костёр).
 */
export const ForestAtmosphere = memo(function ForestAtmosphere({
  width,
  height,
}: ForestAtmosphereProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const groundY = height * 0.56;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={isDark ? "#2E2450" : "#FAF4EA"} />
            <Stop offset="0.35" stopColor={isDark ? "#22183C" : "#F0E6D4"} />
            <Stop offset="0.7" stopColor={isDark ? "#18102C" : "#E4D6BE"} />
            <Stop offset="1" stopColor={isDark ? "#100A1E" : "#D2C4A8"} />
          </LinearGradient>
          <RadialGradient id="sun" cx="82%" cy="16%" rx="32%" ry="22%">
            <Stop offset="0" stopColor="#FFE6B0" stopOpacity={0.5} />
            <Stop offset="0.55" stopColor="#F0D090" stopOpacity={0.16} />
            <Stop offset="1" stopColor="#F0D090" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="moon" cx="78%" cy="14%" rx="24%" ry="16%">
            <Stop offset="0" stopColor="#F0E6D0" stopOpacity={0.38} />
            <Stop offset="0.55" stopColor="#C8B8E0" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#C8B8E0" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="camp" cx="50%" cy="78%" rx="26%" ry="14%">
            <Stop offset="0" stopColor="#E8A060" stopOpacity={isDark ? 0.45 : 0} />
            <Stop offset="0.5" stopColor="#E8A060" stopOpacity={isDark ? 0.14 : 0} />
            <Stop offset="1" stopColor="#E8A060" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />

        {!isDark && (
          <>
            <Ellipse cx={width * 0.82} cy={height * 0.14} rx={width * 0.28} ry={height * 0.16} fill="url(#sun)" />
            <Circle cx={width * 0.84} cy={height * 0.12} r={15} fill="#FFE8B8" opacity={0.4} />
          </>
        )}

        {isDark && (
          <>
            <Ellipse cx={width * 0.78} cy={height * 0.12} rx={width * 0.22} ry={height * 0.13} fill="url(#moon)" />
            <Circle cx={width * 0.8} cy={height * 0.11} r={10} fill="#EDE4D4" opacity={0.78} />
            {[
              [0.1, 0.07],
              [0.24, 0.16],
              [0.4, 0.06],
              [0.55, 0.2],
              [0.32, 0.28],
              [0.68, 0.09],
              [0.88, 0.24],
              [0.15, 0.32],
            ].map(([x, y], i) => (
              <Circle
                key={`st-${i}`}
                cx={width * x}
                cy={height * y}
                r={1 + (i % 2) * 0.4}
                fill="#F0EAE2"
                opacity={0.3 + (i % 3) * 0.1}
              />
            ))}
          </>
        )}

        {/* Холмы: светлая — охра/олива; тёмная — глубокий индиго */}
        <Path
          d={`M0 ${groundY + 18}
              Q ${width * 0.22} ${groundY - 36} ${width * 0.48} ${groundY + 8}
              T ${width} ${groundY - 4}
              V ${height} H0 Z`}
          fill={isDark ? "#241C3A" : "#D8CDB4"}
          opacity={0.88}
        />
        <Path
          d={`M0 ${groundY + 52}
              Q ${width * 0.3} ${groundY + 8} ${width * 0.58} ${groundY + 42}
              T ${width} ${groundY + 28}
              V ${height} H0 Z`}
          fill={isDark ? "#1C1630" : "#C8D2AE"}
          opacity={0.94}
        />
        <Path
          d={`M0 ${groundY + 95}
              Q ${width * 0.35} ${groundY + 58} ${width * 0.7} ${groundY + 82}
              T ${width} ${groundY + 72}
              V ${height} H0 Z`}
          fill={isDark ? "#141022" : "#B6C498"}
          opacity={0.98}
        />

        {isDark && (
          <>
            {/* Светлячки в воздухе — концепт 4 */}
            {[
              [0.12, 0.48],
              [0.28, 0.42],
              [0.45, 0.5],
              [0.62, 0.4],
              [0.78, 0.46],
              [0.2, 0.58],
              [0.55, 0.55],
              [0.85, 0.52],
              [0.38, 0.62],
              [0.7, 0.6],
            ].map(([x, y], i) => (
              <React.Fragment key={`ff-${i}`}>
                <Circle cx={width * x} cy={height * y} r={3.2} fill="#E8B975" opacity={0.18} />
                <Circle cx={width * x} cy={height * y} r={1.3} fill="#FFF6E0" opacity={0.75} />
              </React.Fragment>
            ))}

            {/* Гирлянда / тёплое свечение — концепт 5 */}
            <Path
              d={`M${width * 0.18} ${groundY + 8} Q ${width * 0.5} ${groundY + 28} ${width * 0.82} ${groundY + 6}`}
              stroke="#E8B975"
              strokeWidth={1.2}
              fill="none"
              opacity={0.28}
            />
            {[0.28, 0.4, 0.52, 0.64, 0.76].map((x, i) => (
              <Circle
                key={`sl-${i}`}
                cx={width * x}
                cy={groundY + 10 + (i % 2) * 6}
                r={2.4}
                fill="#FFE6B0"
                opacity={0.55}
              />
            ))}

            <Ellipse cx={width * 0.5} cy={groundY + 88} rx={width * 0.28} ry={height * 0.07} fill="url(#camp)" />

            {/* Костёр */}
            <Circle cx={width * 0.5} cy={groundY + 86} r={10} fill="#E89050" opacity={0.55} />
            <Circle cx={width * 0.5} cy={groundY + 82} r={5.5} fill="#F6D090" opacity={0.85} />
            <Path
              d={`M${width * 0.5 - 14} ${groundY + 94}
                  Q ${width * 0.5} ${groundY + 102} ${width * 0.5 + 14} ${groundY + 94}`}
              stroke="#5A4030"
              strokeWidth={3}
              fill="none"
              opacity={0.55}
            />

            {/* Скамейка */}
            <Path
              d={`M${width * 0.5 - 36} ${groundY + 108}
                  L ${width * 0.5 + 36} ${groundY + 108}`}
              stroke="#6A5040"
              strokeWidth={3.5}
              strokeLinecap="round"
              opacity={0.5}
            />
            <Path
              d={`M${width * 0.5 - 28} ${groundY + 108} L ${width * 0.5 - 28} ${groundY + 118}
                  M${width * 0.5 + 28} ${groundY + 108} L ${width * 0.5 + 28} ${groundY + 118}`}
              stroke="#6A5040"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.45}
            />
          </>
        )}
      </Svg>
    </View>
  );
});
