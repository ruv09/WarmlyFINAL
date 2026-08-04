import React from "react";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { useTheme } from "../../theme";

interface ForestBackdropProps {
  width: number;
  height: number;
}

/**
 * Декоративная сцена для карточки "Мой лес" — процедурная, не копия
 * присланного референса (см. /FOREST.md про требование не копировать
 * художественные материалы): мягкий градиент неба, силуэт холма,
 * россыпь небольших деревьев. В тёмной теме добавляются тёплые
 * огоньки — объединение "туманного леса" и "тёплого вечера" в одно
 * настроение, как и решили для тёмной темы приложения.
 */
export function ForestBackdrop({ width, height }: ForestBackdropProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";

  const skyTop = isDark ? "#2C2747" : "#F3ECDC";
  const skyBottom = isDark ? "#1D1A2E" : "#EAE0C8";
  const hillColor = isDark ? "#151327" : theme.colors.accent;
  const treeColors = isDark
    ? ["#4A4468", "#3C3856", "#585078"]
    : [theme.colors.accent, "#9CAE6B", "#7C9473"];

  const trees = [
    { x: width * 0.12, size: 20 },
    { x: width * 0.26, size: 30 },
    { x: width * 0.42, size: 16 },
    { x: width * 0.58, size: 26 },
    { x: width * 0.74, size: 18 },
    { x: width * 0.88, size: 24 },
  ];

  const lights = [
    { x: width * 0.2, y: height * 0.28 },
    { x: width * 0.35, y: height * 0.4 },
    { x: width * 0.52, y: height * 0.24 },
    { x: width * 0.67, y: height * 0.36 },
    { x: width * 0.8, y: height * 0.22 },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={skyTop} />
          <Stop offset="1" stopColor={skyBottom} />
        </LinearGradient>
      </Defs>

      <Path d={`M0 0 H${width} V${height} H0 Z`} fill="url(#sky)" />

      {isDark && (
        <Circle cx={width * 0.82} cy={height * 0.2} r={14} fill="#EDE6D6" opacity={0.85} />
      )}

      <Path
        d={`M0 ${height * 0.72} Q ${width * 0.25} ${height * 0.6} ${width * 0.5} ${height * 0.7} T ${width} ${height * 0.66} V${height} H0 Z`}
        fill={hillColor}
        opacity={isDark ? 0.9 : 0.35}
      />

      {trees.map((tree, index) => (
        <React.Fragment key={index}>
          <Circle
            cx={tree.x}
            cy={height * 0.78 - tree.size * 0.6}
            r={tree.size}
            fill={treeColors[index % treeColors.length]}
            opacity={0.85}
          />
        </React.Fragment>
      ))}

      {isDark &&
        lights.map((light, index) => (
          <Circle key={index} cx={light.x} cy={light.y} r={2.4} fill={theme.colors.accentWarm} opacity={0.9} />
        ))}
    </Svg>
  );
}
