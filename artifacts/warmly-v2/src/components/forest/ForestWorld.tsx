import React, { memo, useMemo } from "react";
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";
import { useTheme } from "../../theme";

interface ForestWorldProps {
  width: number;
  height: number;
}

/**
 * Мировая декорация леса — холмы, дымка, цветы / вечерние огоньки.
 * Движется вместе с картой. Не копия референса: собственная композиция
 * в духе «Природный уют» (светлая) и «Тёплый вечер» (тёмная).
 */
export const ForestWorld = memo(function ForestWorld({ width, height }: ForestWorldProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const cx = width / 2;
  const cy = height / 2;

  const flowers = useMemo(() => seededPoints(width, height, 42, 0xa11ce), [width, height]);
  const fireflies = useMemo(() => seededPoints(width, height, 56, 0xf17e5), [width, height]);
  const mistBlobs = useMemo(() => seededPoints(width, height, 10, 0xc1570), [width, height]);

  const grass = isDark ? "#2A2438" : "#D9E0C4";
  const grassDeep = isDark ? "#1E1A2C" : "#C8D2AE";
  const hillFar = isDark ? "#322B42" : "#E4D8C0";
  const hillMid = isDark ? "#282236" : "#DCCFBA";
  const warmGlow = theme.colors.accentWarm;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <RadialGradient id="worldGround" cx="50%" cy="48%" rx="55%" ry="55%">
          <Stop offset="0" stopColor={grass} stopOpacity={isDark ? 0.95 : 0.9} />
          <Stop offset="0.55" stopColor={grassDeep} stopOpacity={0.85} />
          <Stop offset="1" stopColor={isDark ? "#16121F" : "#EDE4D2"} stopOpacity={0.2} />
        </RadialGradient>
        <RadialGradient id="warmPocket" cx="50%" cy="52%" rx="22%" ry="18%">
          <Stop offset="0" stopColor={warmGlow} stopOpacity={isDark ? 0.35 : 0.18} />
          <Stop offset="0.55" stopColor={warmGlow} stopOpacity={isDark ? 0.12 : 0.06} />
          <Stop offset="1" stopColor={warmGlow} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="hazeBand" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={isDark ? "#3A3350" : "#FFF8EE"} stopOpacity={0} />
          <Stop offset="0.45" stopColor={isDark ? "#2C2740" : "#F7F0E4"} stopOpacity={isDark ? 0.25 : 0.35} />
          <Stop offset="1" stopColor={isDark ? "#211E30" : "#F0E8D8"} stopOpacity={0} />
        </LinearGradient>
      </Defs>

      <Ellipse cx={cx} cy={cy} rx={width * 0.48} ry={height * 0.42} fill="url(#worldGround)" />

      {/* Дальние мягкие холмы */}
      <Path
        d={softHillPath(cx - width * 0.22, cy + height * 0.08, width * 0.55, height * 0.12)}
        fill={hillFar}
        opacity={isDark ? 0.55 : 0.45}
      />
      <Path
        d={softHillPath(cx + width * 0.18, cy + height * 0.05, width * 0.5, height * 0.1)}
        fill={hillMid}
        opacity={isDark ? 0.5 : 0.4}
      />
      <Path
        d={softHillPath(cx, cy + height * 0.14, width * 0.62, height * 0.11)}
        fill={grass}
        opacity={isDark ? 0.65 : 0.55}
      />

      <Ellipse cx={cx} cy={cy + height * 0.02} rx={width * 0.2} ry={height * 0.14} fill="url(#warmPocket)" />

      {/* Дымка */}
      {mistBlobs.map((p, i) => (
        <Ellipse
          key={`mist-${i}`}
          cx={p.x}
          cy={p.y}
          rx={80 + (i % 4) * 28}
          ry={28 + (i % 3) * 12}
          fill={isDark ? "#4A4260" : "#FFFDF8"}
          opacity={isDark ? 0.08 : 0.16}
        />
      ))}

      <Ellipse cx={cx} cy={cy} rx={width * 0.42} ry={height * 0.2} fill="url(#hazeBand)" opacity={0.7} />

      {!isDark &&
        flowers.map((p, i) => (
          <Circle
            key={`flower-${i}`}
            cx={p.x}
            cy={p.y}
            r={1.6 + (i % 3) * 0.7}
            fill={flowerColor(i)}
            opacity={0.7}
          />
        ))}

      {isDark &&
        fireflies.map((p, i) => (
          <React.Fragment key={`ff-${i}`}>
            <Circle cx={p.x} cy={p.y} r={4} fill={warmGlow} opacity={0.12} />
            <Circle cx={p.x} cy={p.y} r={1.4} fill="#FFF3D6" opacity={0.55 + (i % 3) * 0.12} />
          </React.Fragment>
        ))}

      {/* Уютный очаг света у центра — только вечером */}
      {isDark && (
        <>
          <Ellipse cx={cx} cy={cy + 36} rx={28} ry={14} fill={warmGlow} opacity={0.18} />
          <Circle cx={cx} cy={cy + 28} r={7} fill="#E8A060" opacity={0.55} />
          <Circle cx={cx - 3} cy={cy + 24} r={3.5} fill="#F6D090" opacity={0.7} />
          <Path
            d={`M${cx - 18} ${cy + 40} Q ${cx} ${cy + 48} ${cx + 18} ${cy + 40}`}
            stroke="#5A4030"
            strokeWidth={3}
            fill="none"
            opacity={0.55}
          />
        </>
      )}
    </Svg>
  );
});

function softHillPath(cx: number, cy: number, w: number, h: number): string {
  const left = cx - w / 2;
  const right = cx + w / 2;
  return `M${left} ${cy} Q ${cx - w * 0.2} ${cy - h} ${cx} ${cy - h * 0.55} Q ${cx + w * 0.22} ${cy - h * 1.05} ${right} ${cy} Z`;
}

function flowerColor(index: number): string {
  const colors = ["#E8B4A8", "#F0D48A", "#D4C4E8", "#F2C6D0", "#C5D4A8"];
  return colors[index % colors.length];
}

/** Детерминированные точки по территории мира — стабильны между рендерами. */
function seededPoints(width: number, height: number, count: number, seed: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  let state = seed >>> 0;
  const padX = width * 0.12;
  const padY = height * 0.12;
  for (let i = 0; i < count; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const x = padX + ((state % 10000) / 10000) * (width - padX * 2);
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const y = padY + ((state % 10000) / 10000) * (height - padY * 2);
    points.push({ x, y });
  }
  return points;
}
