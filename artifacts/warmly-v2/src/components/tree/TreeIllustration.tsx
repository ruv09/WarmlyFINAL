import React, { memo, useMemo } from "react";
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { Tree } from "../../types";
import { getSpeciesVisual, SpeciesVisual } from "../../constants/treeSpecies";
import { useTheme } from "../../theme";

interface TreeIllustrationProps {
  tree: Tree;
  size?: number;
  /** Показывать огоньки на кроне (тёмная тема). */
  showLights?: boolean;
}

interface Palette {
  canopy: string;
  highlight: string;
  shade: string;
  trunk: string;
  accent?: string;
  ground: string;
  light: string;
}

/**
 * Акварельная иллюстрация полностью выросшего дерева.
 * Форма зависит от вида; в тёмной теме — отдельная палитра и мягкие огоньки.
 */
export const TreeIllustration = memo(function TreeIllustration({
  tree,
  size = 72,
  showLights,
}: TreeIllustrationProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const visual = getSpeciesVisual(tree.species);
  const lightsEnabled = showLights ?? isDark;

  const palette = useMemo<Palette>(
    () => ({
      canopy: isDark ? visual.canopyColorDark : visual.canopyColor,
      highlight: isDark ? visual.canopyHighlightDark : visual.canopyHighlight,
      shade: isDark ? visual.canopyShadeDark : visual.canopyShade,
      trunk: isDark ? visual.trunkColorDark : visual.trunkColor,
      accent: isDark ? visual.accentColorDark ?? visual.accentColor : visual.accentColor,
      ground: isDark ? "#00000040" : "#00000012",
      light: theme.colors.accentWarm,
    }),
    [isDark, visual, theme.colors.accentWarm],
  );

  const lightPositions = useMemo(
    () => (lightsEnabled && visual.hasEveningLights ? lightsForTree(tree.id) : []),
    [lightsEnabled, visual.hasEveningLights, tree.id],
  );

  const gradientId = `canopyGlow-${tree.id}`;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id={gradientId} cx="42%" cy="35%" rx="55%" ry="50%">
          <Stop offset="0" stopColor={palette.highlight} stopOpacity={0.95} />
          <Stop offset="0.55" stopColor={palette.canopy} stopOpacity={0.92} />
          <Stop offset="1" stopColor={palette.shade} stopOpacity={0.88} />
        </RadialGradient>
      </Defs>

      <Ellipse cx="50" cy="91" rx="26" ry="5.5" fill={palette.ground} />

      {/* Мягкая «акварельная» подложка кроны */}
      <Ellipse cx="50" cy="40" rx="34" ry="28" fill={palette.canopy} opacity={0.22} />

      <Rect x="46" y="48" width="8" height="40" rx="3.5" fill={palette.trunk} />
      {visual.species === "birch" && (
        <>
          <Rect x="47.5" y="54" width="1.2" height="8" rx="0.5" fill="#5C5348" opacity={0.35} />
          <Rect x="51" y="66" width="1.2" height="7" rx="0.5" fill="#5C5348" opacity={0.3} />
        </>
      )}

      {renderCanopy(visual, palette, gradientId)}

      {lightPositions.map((light, index) => (
        <React.Fragment key={index}>
          <Circle cx={light.x} cy={light.y} r={3.2} fill={palette.light} opacity={0.22} />
          <Circle cx={light.x} cy={light.y} r={1.35} fill="#FFF6E4" opacity={0.95} />
        </React.Fragment>
      ))}
    </Svg>
  );
});

function lightsForTree(treeId: string): { x: number; y: number }[] {
  let hash = 0;
  for (let i = 0; i < treeId.length; i++) {
    hash = (hash * 31 + treeId.charCodeAt(i)) >>> 0;
  }
  const count = 3 + (hash % 3);
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const n = (hash + i * 9973) >>> 0;
    points.push({
      x: 28 + (n % 45),
      y: 18 + ((n >> 6) % 38),
    });
  }
  return points;
}

function renderCanopy(visual: SpeciesVisual, palette: Palette, gradientId: string) {
  const { canopyShape } = visual;
  const fill = `url(#${gradientId})`;

  switch (canopyShape) {
    case "conical":
      return (
        <>
          <Path d="M50 14 L66 42 L34 42 Z" fill={palette.shade} opacity={0.55} />
          <Path d="M50 16 L64 42 L36 42 Z" fill={fill} opacity={0.95} />
          <Path d="M50 30 L70 58 L30 58 Z" fill={fill} opacity={0.92} />
          <Path d="M50 44 L74 74 L26 74 Z" fill={palette.canopy} opacity={0.9} />
          <Path d="M50 20 L58 38 L42 38 Z" fill={palette.highlight} opacity={0.45} />
        </>
      );

    case "round":
      return (
        <>
          <Circle cx="34" cy="42" r="22" fill={palette.shade} opacity={0.55} />
          <Circle cx="66" cy="40" r="21" fill={palette.shade} opacity={0.5} />
          <Circle cx="36" cy="40" r="20" fill={fill} opacity={0.92} />
          <Circle cx="64" cy="38" r="19" fill={fill} opacity={0.9} />
          <Circle cx="50" cy="24" r="20" fill={fill} opacity={0.95} />
          <Circle cx="50" cy="36" r="15" fill={palette.canopy} opacity={0.85} />
          <Ellipse cx="42" cy="28" rx="10" ry="7" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "drooping":
      return (
        <>
          <Circle cx="50" cy="26" r="19" fill={fill} opacity={0.92} />
          <Ellipse cx="32" cy="48" rx="11" ry="20" fill={palette.canopy} opacity={0.78} />
          <Ellipse cx="68" cy="50" rx="11" ry="22" fill={palette.canopy} opacity={0.78} />
          <Ellipse cx="42" cy="56" rx="9" ry="18" fill={palette.shade} opacity={0.55} />
          <Ellipse cx="58" cy="58" rx="9" ry="20" fill={palette.shade} opacity={0.5} />
          <Ellipse cx="50" cy="62" rx="8" ry="18" fill={palette.canopy} opacity={0.65} />
          <Ellipse cx="44" cy="22" rx="8" ry="5" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "clustered":
      return (
        <>
          <Circle cx="36" cy="40" r="13" fill={fill} opacity={0.9} />
          <Circle cx="58" cy="30" r="14" fill={fill} opacity={0.92} />
          <Circle cx="48" cy="48" r="12" fill={palette.canopy} opacity={0.88} />
          <Circle cx="64" cy="48" r="11" fill={palette.canopy} opacity={0.86} />
          <Circle cx="42" cy="28" r="10" fill={palette.highlight} opacity={0.55} />
          {palette.accent && (
            <>
              <Circle cx="40" cy="40" r="2" fill={palette.accent} />
              <Circle cx="56" cy="30" r="2" fill={palette.accent} />
              <Circle cx="62" cy="50" r="1.8" fill={palette.accent} />
              <Circle cx="46" cy="48" r="1.8" fill={palette.accent} />
              <Circle cx="52" cy="38" r="1.5" fill={palette.accent} opacity={0.85} />
            </>
          )}
        </>
      );

    case "blossom":
      return (
        <>
          <Circle cx="36" cy="38" r="18" fill={palette.shade} opacity={0.45} />
          <Circle cx="64" cy="36" r="17" fill={palette.shade} opacity={0.4} />
          <Circle cx="38" cy="36" r="17" fill={fill} opacity={0.9} />
          <Circle cx="62" cy="34" r="16" fill={fill} opacity={0.9} />
          <Circle cx="50" cy="22" r="17" fill={fill} opacity={0.95} />
          <Ellipse cx="44" cy="26" rx="9" ry="6" fill={palette.highlight} opacity={0.5} />
          {palette.accent && (
            <>
              <Circle cx="42" cy="30" r="2.2" fill={palette.accent} />
              <Circle cx="58" cy="26" r="2.2" fill={palette.accent} />
              <Circle cx="50" cy="40" r="2" fill={palette.accent} />
              <Circle cx="34" cy="40" r="1.8" fill={palette.accent} />
              <Circle cx="66" cy="42" r="1.8" fill={palette.accent} />
            </>
          )}
        </>
      );

    case "wideWarm":
      return (
        <>
          <Ellipse cx="28" cy="44" rx="20" ry="15" fill={palette.shade} opacity={0.5} />
          <Ellipse cx="72" cy="44" rx="20" ry="15" fill={palette.shade} opacity={0.5} />
          <Ellipse cx="30" cy="42" rx="18" ry="14" fill={fill} opacity={0.9} />
          <Ellipse cx="70" cy="42" rx="18" ry="14" fill={fill} opacity={0.9} />
          <Ellipse cx="50" cy="28" rx="26" ry="18" fill={fill} opacity={0.95} />
          <Ellipse cx="42" cy="24" rx="12" ry="8" fill={palette.highlight} opacity={0.4} />
        </>
      );
  }
}
