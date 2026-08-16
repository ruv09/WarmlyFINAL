import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
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
  groundY: number;
  camX: SharedValue<number>;
  camY: SharedValue<number>;
  camZ: SharedValue<number>;
}

function useLookStyle(camX: SharedValue<number>, factor: number, extra = 80) {
  return useAnimatedStyle(() => ({
    transform: [{ translateX: -camX.value * factor }],
    width: "100%",
    height: "100%",
    position: "absolute" as const,
    left: -extra,
    right: -extra,
  }));
}

function useWalkStyle(camZ: SharedValue<number>, cycle: number, extra: number) {
  return useAnimatedStyle(() => {
    const phase = ((camZ.value % cycle) + cycle) % cycle;
    const t = phase / cycle;
    return {
      transform: [
        { translateY: t * 36 },
        { scale: 1 + t * 0.22 },
      ],
      opacity: 1 - t * 0.72,
      width: "100%",
      height: "100%",
      position: "absolute" as const,
      left: -extra,
      right: -extra,
    };
  });
}

/**
 * Пейзаж по референсам 3/4: туманная глубина, тропа, папоротники, камни.
 * Слои едут с разным параллаксом.
 */
export const ForestAtmosphere = memo(function ForestAtmosphere({
  width,
  height,
  groundY,
  camX,
  camZ,
}: ForestAtmosphereProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const extra = Math.round(width * 0.45);
  const sceneW = width + extra * 2;

  const farStyle = useLookStyle(camX, 0.12, extra);
  const midStyle = useLookStyle(camX, 0.28, extra);
  const nearStyle = useLookStyle(camX, 0.55, extra);
  const fgStyle = useWalkStyle(camZ, 240, extra);

  const farFill = isDark ? "#1A1430" : "#C5D0B0";
  const midFill = isDark ? "#161028" : "#A8B98C";
  const nearFill = isDark ? "#120C20" : "#8FA374";
  const groundFill = isDark ? "#0E0A18" : "#7C9464";
  const moss = isDark ? "#24301C" : "#6E8B52";
  const stone = isDark ? "#3A3548" : "#C4B49A";
  const trunk = isDark ? "#2A2238" : "#7A6248";

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={isDark ? "#2A2148" : "#F4EEDC"} />
            <Stop offset="0.38" stopColor={isDark ? "#1E1738" : "#E4E6C8"} />
            <Stop offset="0.72" stopColor={isDark ? "#141028" : "#C9D6B0"} />
            <Stop offset="1" stopColor={isDark ? "#0E0A1C" : "#B4C49A"} />
          </LinearGradient>
          <RadialGradient id="glow" cx="50%" cy="28%" rx="42%" ry="32%">
            <Stop offset="0" stopColor={isDark ? "#E8C990" : "#FFF6D8"} stopOpacity={isDark ? 0.22 : 0.7} />
            <Stop offset="0.45" stopColor={isDark ? "#C9A878" : "#E8E0B0"} stopOpacity={isDark ? 0.08 : 0.28} />
            <Stop offset="1" stopColor={isDark ? "#C9A878" : "#E8E0B0"} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={isDark ? "#D8D0E8" : "#F7F2E4"} stopOpacity={0} />
            <Stop offset="0.45" stopColor={isDark ? "#C8C0D8" : "#E8EED8"} stopOpacity={isDark ? 0.08 : 0.22} />
            <Stop offset="1" stopColor={isDark ? "#C8C0D8" : "#E8EED8"} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />
        <Ellipse cx={width * 0.5} cy={height * 0.22} rx={width * 0.46} ry={height * 0.2} fill="url(#glow)" />
      </Svg>

      <Animated.View style={farStyle}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${groundY - 70}
                C ${sceneW * 0.18} ${groundY - 140} ${sceneW * 0.32} ${groundY - 40} ${sceneW * 0.5} ${groundY - 88}
                S ${sceneW * 0.78} ${groundY - 30} ${sceneW} ${groundY - 76}
                V ${height} H0 Z`}
            fill={farFill}
            opacity={isDark ? 0.55 : 0.5}
          />
          {[0.12, 0.22, 0.31, 0.4, 0.52, 0.61, 0.7, 0.8, 0.9].map((x, i) => (
            <Ellipse
              key={`far-t-${i}`}
              cx={sceneW * x}
              cy={groundY - 95 - (i % 3) * 18}
              rx={28 + (i % 4) * 10}
              ry={52 + (i % 3) * 14}
              fill={isDark ? "#201834" : "#B7C6A0"}
              opacity={0.55}
            />
          ))}
        </Svg>
      </Animated.View>

      <Animated.View style={midStyle}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${groundY - 8}
                Q ${sceneW * 0.25} ${groundY - 64} ${sceneW * 0.5} ${groundY - 18}
                T ${sceneW} ${groundY - 28}
                V ${height} H0 Z`}
            fill={midFill}
            opacity={0.88}
          />
          <Rect x={0} y={groundY - 50} width={sceneW} height={90} fill={isDark ? "#C8C0D8" : "#E8EED8"} opacity={isDark ? 0.06 : 0.18} />
          {[0.08, 0.18, 0.29, 0.43, 0.57, 0.69, 0.81, 0.93].map((x, i) => (
            <Path
              key={`mid-tr-${i}`}
              d={`M${sceneW * x} ${groundY + 8}
                  C ${sceneW * x - 8} ${groundY - 40} ${sceneW * x - 6} ${groundY - 90} ${sceneW * x} ${groundY - 118 - (i % 3) * 16}
                  C ${sceneW * x + 7} ${groundY - 90} ${sceneW * x + 9} ${groundY - 40} ${sceneW * x + 4} ${groundY + 8} Z`}
              fill={trunk}
              opacity={0.35 + (i % 3) * 0.08}
            />
          ))}
          {isDark
            ? [0.2, 0.38, 0.55, 0.73].map((x, i) => (
                <Circle
                  key={`ff-${i}`}
                  cx={sceneW * x}
                  cy={groundY - 24 - (i % 2) * 18}
                  r={1.6}
                  fill="#FFE6B0"
                  opacity={0.45}
                />
              ))
            : null}
        </Svg>
      </Animated.View>

      <Animated.View style={nearStyle}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${groundY + 36}
                Q ${sceneW * 0.3} ${groundY + 4} ${sceneW * 0.55} ${groundY + 40}
                T ${sceneW} ${groundY + 22}
                V ${height} H0 Z`}
            fill={nearFill}
          />
          <Path
            d={`M0 ${groundY + 78}
                Q ${sceneW * 0.4} ${groundY + 48} ${sceneW} ${groundY + 70}
                V ${height} H0 Z`}
            fill={groundFill}
          />
          {steppingStones(sceneW, groundY, stone)}
        </Svg>
      </Animated.View>

      <Animated.View style={fgStyle}>
        <Svg width={sceneW} height={height}>
          <Path
            d={`M0 ${height * 0.18}
                C ${sceneW * 0.08} ${height * 0.08} ${sceneW * 0.04} ${groundY - 40} 18 ${height}
                H0 Z`}
            fill={trunk}
            opacity={0.55}
          />
          <Path
            d={`M${sceneW} ${height * 0.14}
                C ${sceneW - sceneW * 0.1} ${height * 0.06} ${sceneW - 10} ${groundY - 20} ${sceneW - 14} ${height}
                H${sceneW} Z`}
            fill={trunk}
            opacity={0.5}
          />
          <Ellipse cx={sceneW * 0.12} cy={height - 28} rx={90} ry={36} fill={moss} opacity={0.7} />
          <Ellipse cx={sceneW * 0.88} cy={height - 22} rx={110} ry={40} fill={moss} opacity={0.65} />
          <Ellipse cx={sceneW * 0.2} cy={groundY + 118} rx={34} ry={18} fill={stone} opacity={0.85} />
          <Ellipse cx={sceneW * 0.78} cy={groundY + 128} rx={42} ry={20} fill={stone} opacity={0.8} />
          {ferns(sceneW, height, isDark ? "#3A4A30" : "#5E7A44")}
        </Svg>
      </Animated.View>
    </View>
  );
});

function steppingStones(sceneW: number, groundY: number, fill: string) {
  const stones = [0.42, 0.47, 0.52, 0.57, 0.61, 0.66];
  return stones.map((x, i) => (
    <Ellipse
      key={`st-${i}`}
      cx={sceneW * x + (i % 2) * 8}
      cy={groundY + 86 + i * 10}
      rx={18 - i * 1.2}
      ry={8}
      fill={fill}
      opacity={0.72 - i * 0.05}
    />
  ));
}

function ferns(sceneW: number, height: number, fill: string) {
  return [0.06, 0.14, 0.84, 0.93].map((x, i) => (
    <Path
      key={`fern-${i}`}
      d={`M${sceneW * x} ${height - 8}
          Q ${sceneW * x - 18} ${height - 40} ${sceneW * x + 4} ${height - 62}
          Q ${sceneW * x + 22} ${height - 36} ${sceneW * x + 8} ${height - 8} Z`}
      fill={fill}
      opacity={0.72}
    />
  ));
}
