import React, { memo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { useTheme } from "../../theme";

function RoundTree({
  cx,
  base,
  size,
  crown,
  trunk,
  pine,
}: {
  cx: number;
  base: number;
  size: number;
  crown: string;
  trunk: string;
  pine?: boolean;
}) {
  const h = size;
  const w = pine ? size * 0.42 : size * 0.48;
  return (
    <>
      <Path
        d={`M${cx - 3} ${base} Q ${cx} ${base + 6} ${cx + 3} ${base} L ${cx + 2} ${base - h * 0.22} L ${cx - 2} ${base - h * 0.22} Z`}
        fill={trunk}
        opacity={0.85}
      />
      {pine ? (
        <>
          <Ellipse cx={cx} cy={base - h * 0.38} rx={w * 0.95} ry={h * 0.22} fill={crown} />
          <Ellipse cx={cx} cy={base - h * 0.55} rx={w * 0.72} ry={h * 0.18} fill={crown} />
          <Ellipse cx={cx} cy={base - h * 0.72} rx={w * 0.48} ry={h * 0.16} fill={crown} />
        </>
      ) : (
        <>
          <Ellipse cx={cx - w * 0.18} cy={base - h * 0.48} rx={w * 0.55} ry={h * 0.32} fill={crown} />
          <Ellipse cx={cx + w * 0.22} cy={base - h * 0.5} rx={w * 0.5} ry={h * 0.3} fill={crown} />
          <Ellipse cx={cx} cy={base - h * 0.62} rx={w * 0.58} ry={h * 0.34} fill={crown} />
        </>
      )}
    </>
  );
}

function Stone({ cx, cy, rx, ry, fill }: { cx: number; cy: number; rx: number; ry: number; fill: string }) {
  return <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} opacity={0.78} />;
}

/**
 * Статичная пастельная атмосфера леса Warmly (небо, холмы, тропа, крайние стволы).
 * Без камеры и жестов — только декоративный фон каталога и сцены дерева.
 */
export const ForestAtmosphere = memo(function ForestAtmosphere() {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  const groundY = height * 0.58;
  const sceneW = width;
  const cx = sceneW / 2;

  function onLayout(event: LayoutChangeEvent) {
    const next = event.nativeEvent.layout;
    if (next.width === size.width && next.height === size.height) return;
    setSize({ width: next.width, height: next.height });
  }

  const mountain = isDark ? "#3A3558" : "#C9D0E4";
  const mountainFar = isDark ? "#2E2A48" : "#D8DCEC";
  const hillFar = isDark ? "#2A3340" : "#C5D6B4";
  const hillMid = isDark ? "#243428" : "#AFC99A";
  const hillMain = isDark ? "#1E2C22" : "#97B882";
  const grass = isDark ? "#18241C" : "#8EAF74";
  const path = isDark ? "#3A3228" : "#E6D3B0";
  const pathEdge = isDark ? "#2A241C" : "#D4C09A";
  const crownFar = isDark ? "#2C3A32" : "#B7CDA4";
  const crownMid = isDark ? "#314636" : "#8FB57A";
  const crownMain = isDark ? "#3A5640" : "#7AA566";
  const crownNear = isDark ? "#44644A" : "#6B9658";
  const trunk = isDark ? "#3A322C" : "#C4A07A";
  const trunkDeep = isDark ? "#2A221C" : "#A88868";
  const stone = isDark ? "#4A4558" : "#D2C4B0";
  const moss = isDark ? "#2A3A28" : "#7A9A62";
  const foliage = isDark ? "#3A523C" : "#6F9A5C";

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={onLayout}>
      {width > 0 && height > 0 ? (
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={isDark ? "#2A2450" : "#F7EFE4"} />
            <Stop offset="0.28" stopColor={isDark ? "#221C40" : "#F3E4D4"} />
            <Stop offset="0.62" stopColor={isDark ? "#1A1634" : "#E8E6D4"} />
            <Stop offset="1" stopColor={isDark ? "#141028" : "#D5E0C6"} />
          </LinearGradient>
          <RadialGradient id="glow" cx="72%" cy="18%" rx="38%" ry="24%">
            <Stop offset="0" stopColor={isDark ? "#E8C990" : "#FFE8C8"} stopOpacity={isDark ? 0.22 : 0.7} />
            <Stop offset="1" stopColor={isDark ? "#E8C990" : "#FFE8C8"} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />
        <Ellipse cx={width * 0.74} cy={height * 0.16} rx={width * 0.34} ry={height * 0.14} fill="url(#glow)" />

        <Path
          d={`M0 ${groundY - 28}
              C ${sceneW * 0.16} ${groundY - 118} ${sceneW * 0.34} ${groundY - 40} ${sceneW * 0.5} ${groundY - 96}
              S ${sceneW * 0.78} ${groundY - 24} ${sceneW} ${groundY - 72}
              V ${height} H0 Z`}
          fill={mountainFar}
        />
        <Path
          d={`M0 ${groundY + 8}
              C ${sceneW * 0.22} ${groundY - 64} ${sceneW * 0.42} ${groundY + 20} ${sceneW * 0.62} ${groundY - 48}
              S ${sceneW * 0.88} ${groundY + 16} ${sceneW} ${groundY - 20}
              V ${height} H0 Z`}
          fill={mountain}
          opacity={0.92}
        />

        <Path
          d={`M0 ${groundY + 24}
              Q ${sceneW * 0.25} ${groundY - 28} ${sceneW * 0.5} ${groundY + 18}
              T ${sceneW} ${groundY + 6}
              V ${height} H0 Z`}
          fill={hillFar}
        />
        {[0.1, 0.2, 0.3, 0.42, 0.58, 0.7, 0.82, 0.92].map((x, i) => (
          <RoundTree
            key={`far-${i}`}
            cx={sceneW * x}
            base={groundY + 8}
            size={42 + (i % 3) * 10}
            crown={crownFar}
            trunk={trunk}
            pine={i % 2 === 0}
          />
        ))}

        <Path
          d={`M0 ${groundY + 48}
              Q ${sceneW * 0.3} ${groundY + 8} ${sceneW * 0.55} ${groundY + 40}
              T ${sceneW} ${groundY + 22}
              V ${height} H0 Z`}
          fill={hillMid}
        />
        {[0.08, 0.18, 0.28, 0.72, 0.84, 0.94].map((x, i) => (
          <RoundTree
            key={`mid-${i}`}
            cx={sceneW * x}
            base={groundY + 36}
            size={70 + (i % 3) * 14}
            crown={crownMid}
            trunk={trunk}
            pine={i % 3 !== 1}
          />
        ))}

        <Path
          d={`M0 ${groundY + 70}
              Q ${sceneW * 0.28} ${groundY + 32} ${sceneW * 0.5} ${groundY + 62}
              T ${sceneW} ${groundY + 44}
              V ${height} H0 Z`}
          fill={hillMain}
        />
        <Path
          d={`M${cx - 46} ${groundY + 58}
              Q ${cx} ${groundY + 78} ${cx + 46} ${groundY + 58}
              Q ${cx + 70} ${groundY + 118} ${cx + 52} ${height}
              H ${cx - 52}
              Q ${cx - 70} ${groundY + 118} ${cx - 46} ${groundY + 58} Z`}
          fill={path}
          opacity={0.55}
        />
        {[0.07, 0.17, 0.26, 0.74, 0.84, 0.94].map((x, i) => (
          <RoundTree
            key={`main-${i}`}
            cx={sceneW * x}
            base={groundY + 58}
            size={96 + (i % 2) * 18}
            crown={crownMain}
            trunk={trunkDeep}
            pine={i % 2 === 0}
          />
        ))}

        <Path
          d={`M0 ${groundY + 96}
              Q ${sceneW * 0.32} ${groundY + 64} ${sceneW * 0.5} ${groundY + 92}
              T ${sceneW} ${groundY + 72}
              V ${height} H0 Z`}
          fill={grass}
        />
        <Path
          d={`M${cx - 38} ${groundY + 78}
              Q ${cx + 8} ${groundY + 108} ${cx + 42} ${groundY + 86}
              Q ${cx + 58} ${groundY + 150} ${cx + 36} ${height}
              H ${cx - 34}
              Q ${cx - 56} ${groundY + 150} ${cx - 38} ${groundY + 78} Z`}
          fill={path}
        />
        <Path
          d={`M${cx - 22} ${groundY + 88}
              Q ${cx} ${groundY + 112} ${cx + 24} ${groundY + 94}
              L ${cx + 18} ${height} H ${cx - 16} Z`}
          fill={pathEdge}
          opacity={0.45}
        />
        {[0.06, 0.16, 0.84, 0.94].map((x, i) => (
          <RoundTree
            key={`near-${i}`}
            cx={sceneW * x}
            base={groundY + 92}
            size={120 + (i % 2) * 20}
            crown={crownNear}
            trunk={trunkDeep}
            pine={i !== 1}
          />
        ))}
        <Ellipse cx={sceneW * 0.22} cy={groundY + 108} rx={28} ry={16} fill={foliage} opacity={0.8} />
        <Ellipse cx={sceneW * 0.78} cy={groundY + 114} rx={32} ry={17} fill={foliage} opacity={0.8} />
        <Stone cx={sceneW * 0.3} cy={groundY + 122} rx={16} ry={8} fill={stone} />
        <Stone cx={sceneW * 0.68} cy={groundY + 128} rx={20} ry={9} fill={stone} />
        <Stone cx={cx + 18} cy={groundY + 136} rx={12} ry={6} fill={stone} />

        <Path
          d={`M0 ${height * 0.12}
              C ${sceneW * 0.12} ${height * 0.02} ${sceneW * 0.08} ${groundY - 20} ${sceneW * 0.05} ${height}
              H0 Z`}
          fill={trunkDeep}
          opacity={0.92}
        />
        <Ellipse cx={sceneW * 0.08} cy={height * 0.18} rx={90} ry={70} fill={foliage} />
        <Ellipse cx={sceneW * 0.02} cy={height * 0.28} rx={70} ry={54} fill={crownNear} />
        <Path
          d={`M${sceneW} ${height * 0.1}
              C ${sceneW - sceneW * 0.12} ${height * 0.0} ${sceneW - sceneW * 0.06} ${groundY} ${sceneW - sceneW * 0.04} ${height}
              H${sceneW} Z`}
          fill={trunkDeep}
          opacity={0.9}
        />
        <Ellipse cx={sceneW * 0.93} cy={height * 0.16} rx={100} ry={76} fill={foliage} />
        <Ellipse cx={sceneW * 0.98} cy={height * 0.3} rx={72} ry={50} fill={crownNear} />
        <Ellipse cx={sceneW * 0.12} cy={height - 22} rx={92} ry={28} fill={moss} opacity={0.7} />
        <Ellipse cx={sceneW * 0.88} cy={height - 18} rx={110} ry={32} fill={moss} opacity={0.65} />
        <Stone cx={sceneW * 0.2} cy={height - 36} rx={28} ry={12} fill={stone} />
        <Stone cx={sceneW * 0.8} cy={height - 30} rx={34} ry={14} fill={stone} />
      </Svg>
      ) : null}
    </View>
  );
});
