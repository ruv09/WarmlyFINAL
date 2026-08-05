import React, { memo, useMemo } from "react";
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { Tree } from "../../types";
import { CanopyShape, getSpeciesVisual, SpeciesVisual } from "../../constants/treeSpecies";
import { useTheme } from "../../theme";

interface TreeIllustrationProps {
  tree: Tree;
  /** Высота иллюстрации; ширина считается из вертикального viewBox. */
  size?: number;
  showLights?: boolean;
}

interface Palette {
  canopy: string;
  highlight: string;
  shade: string;
  trunk: string;
  accent?: string;
  grass: string;
  grassDeep: string;
  flowerA: string;
  flowerB: string;
  light: string;
}

/** Вертикальный кадр: смотрим на дерево в фас, как в ботаническом справочнике. */
const VB_W = 100;
const VB_H = 130;

export const TreeIllustration = memo(function TreeIllustration({
  tree,
  size = 96,
  showLights,
}: TreeIllustrationProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const visual = getSpeciesVisual(tree.species);
  const lightsEnabled = showLights ?? isDark;
  const width = Math.round(size * (VB_W / VB_H));
  const height = size;

  const palette = useMemo<Palette>(
    () => ({
      canopy: isDark ? visual.canopyColorDark : visual.canopyColor,
      highlight: isDark ? visual.canopyHighlightDark : visual.canopyHighlight,
      shade: isDark ? visual.canopyShadeDark : visual.canopyShade,
      trunk: isDark ? visual.trunkColorDark : visual.trunkColor,
      accent: isDark ? visual.accentColorDark ?? visual.accentColor : visual.accentColor,
      grass: isDark ? "#3A4A38" : "#9CB86E",
      grassDeep: isDark ? "#2A3828" : "#7A9A52",
      flowerA: isDark ? "#E8B975" : "#F0D48A",
      flowerB: isDark ? "#E8C4D0" : "#F2EDE8",
      light: theme.colors.accentWarm,
    }),
    [isDark, visual, theme.colors.accentWarm],
  );

  const lightPositions = useMemo(
    () => (lightsEnabled && visual.hasEveningLights ? lightsForTree(tree.id) : []),
    [lightsEnabled, visual.hasEveningLights, tree.id],
  );

  const gid = `tg-${tree.id}`;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
      <Defs>
        <RadialGradient id={gid} cx="40%" cy="35%" rx="60%" ry="55%">
          <Stop offset="0" stopColor={palette.highlight} stopOpacity={0.95} />
          <Stop offset="0.55" stopColor={palette.canopy} stopOpacity={0.92} />
          <Stop offset="1" stopColor={palette.shade} stopOpacity={0.88} />
        </RadialGradient>
      </Defs>

      {/* Мягкая тень под деревом */}
      <Ellipse cx="50" cy="118" rx="28" ry="5" fill="#000000" opacity={isDark ? 0.22 : 0.08} />

      {/* Травка с цветочками — как на референсе */}
      <Ellipse cx="50" cy="116" rx="30" ry="7" fill={palette.grass} opacity={0.9} />
      <Ellipse cx="38" cy="115" rx="10" ry="4" fill={palette.grassDeep} opacity={0.55} />
      <Ellipse cx="62" cy="116" rx="9" ry="3.5" fill={palette.grassDeep} opacity={0.45} />
      <Circle cx="34" cy="114" r="1.3" fill={palette.flowerA} />
      <Circle cx="44" cy="113" r="1.1" fill={palette.flowerB} />
      <Circle cx="58" cy="114" r="1.2" fill={palette.flowerA} />
      <Circle cx="68" cy="113" r="1" fill={palette.flowerB} />

      {renderTrunk(visual, palette)}
      {renderCanopy(visual.canopyShape, palette, gid)}

      {lightPositions.map((light, index) => (
        <React.Fragment key={index}>
          <Circle cx={light.x} cy={light.y} r={3.4} fill={palette.light} opacity={0.2} />
          <Circle cx={light.x} cy={light.y} r={1.3} fill="#FFF6E4" opacity={0.95} />
        </React.Fragment>
      ))}
    </Svg>
  );
});

function lightsForTree(treeId: string): { x: number; y: number }[] {
  let hash = 0;
  for (let i = 0; i < treeId.length; i++) hash = (hash * 31 + treeId.charCodeAt(i)) >>> 0;
  const count = 3 + (hash % 3);
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const n = (hash + i * 9973) >>> 0;
    points.push({ x: 28 + (n % 44), y: 18 + ((n >> 6) % 48) });
  }
  return points;
}

function renderTrunk(visual: SpeciesVisual, palette: Palette) {
  switch (visual.canopyShape) {
    case "bambooClump":
      return null;
    case "bottle":
      return (
        <>
          <Path
            d="M34 112 C30 90 28 70 36 58 C40 52 60 52 64 58 C72 70 70 90 66 112 Z"
            fill={palette.trunk}
          />
          <Path d="M40 90 C38 78 42 68 48 66" stroke={palette.shade} strokeWidth={1.2} opacity={0.25} fill="none" />
        </>
      );
    case "oliveTwisted":
      return (
        <>
          <Path d="M48 112 C42 96 54 86 46 72 C42 64 52 58 50 50" stroke={palette.trunk} strokeWidth={7} strokeLinecap="round" fill="none" />
          <Path d="M50 72 C58 64 56 54 52 48" stroke={palette.trunk} strokeWidth={4.5} strokeLinecap="round" fill="none" />
        </>
      );
    case "tallPine":
      return <Rect x="47" y="58" width="6" height="56" rx="3" fill={palette.trunk} />;
    case "columnar":
      return <Rect x="46.5" y="40" width="7" height="74" rx="3.2" fill={palette.trunk} />;
    case "conicalEvergreen":
    case "flameEvergreen":
      return <Rect x="47" y="70" width="6" height="44" rx="2.8" fill={palette.trunk} />;
    case "weeping":
      return <Rect x="46.5" y="48" width="7" height="66" rx="3" fill={palette.trunk} />;
    case "flatTop":
      return (
        <>
          <Path d="M50 112 L46 70 L42 58" stroke={palette.trunk} strokeWidth={5} strokeLinecap="round" fill="none" />
          <Path d="M50 78 L58 60" stroke={palette.trunk} strokeWidth={4} strokeLinecap="round" fill="none" />
          <Path d="M48 88 L38 66" stroke={palette.trunk} strokeWidth={3.5} strokeLinecap="round" fill="none" />
        </>
      );
    default:
      return (
        <>
          <Rect x="46" y="62" width="8" height={50} rx={3.5} fill={palette.trunk} />
          {visual.species === "birch" && (
            <>
              <Rect x="47.5" y="72" width={1.3} height={8} rx={0.5} fill="#5C5348" opacity={0.35} />
              <Rect x="51" y="88" width={1.3} height={7} rx={0.5} fill="#5C5348" opacity={0.3} />
              <Rect x="48" y="98" width={1.2} height={6} rx={0.5} fill="#5C5348" opacity={0.28} />
            </>
          )}
        </>
      );
  }
}

function renderCanopy(shape: CanopyShape, palette: Palette, gid: string) {
  const fill = `url(#${gid})`;

  switch (shape) {
    case "roundBroad":
      return (
        <>
          <Ellipse cx="50" cy="48" rx="36" ry="30" fill={palette.canopy} opacity={0.2} />
          <Circle cx="32" cy="52" r="20" fill={palette.shade} opacity={0.45} />
          <Circle cx="68" cy="50" r="19" fill={palette.shade} opacity={0.4} />
          <Circle cx="34" cy="48" r="19" fill={fill} opacity={0.92} />
          <Circle cx="66" cy="46" r="18" fill={fill} opacity={0.9} />
          <Circle cx="50" cy="32" r="22" fill={fill} opacity={0.95} />
          <Circle cx="50" cy="46" r="16" fill={palette.canopy} opacity={0.85} />
          <Ellipse cx="40" cy="34" rx="11" ry="8" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "airyOval":
      return (
        <>
          <Ellipse cx="50" cy="42" rx="28" ry="34" fill={palette.canopy} opacity={0.18} />
          <Ellipse cx="50" cy="40" rx="24" ry="30" fill={fill} opacity={0.9} />
          <Ellipse cx="40" cy="36" rx="12" ry="16" fill={palette.highlight} opacity={0.35} />
          <Ellipse cx="58" cy="48" rx="10" ry="14" fill={palette.shade} opacity={0.35} />
          <Ellipse cx="46" cy="54" rx="8" ry="12" fill={palette.canopy} opacity={0.5} />
        </>
      );

    case "autumnWide":
      return (
        <>
          <Ellipse cx="50" cy="44" rx="38" ry="28" fill={palette.canopy} opacity={0.18} />
          <Ellipse cx="28" cy="50" rx="18" ry="16" fill={palette.shade} opacity={0.45} />
          <Ellipse cx="72" cy="48" rx="18" ry="16" fill={palette.shade} opacity={0.4} />
          <Ellipse cx="30" cy="46" rx="17" ry="15" fill={fill} opacity={0.9} />
          <Ellipse cx="70" cy="44" rx="17" ry="15" fill={fill} opacity={0.9} />
          <Ellipse cx="50" cy="30" rx="26" ry="18" fill={fill} opacity={0.95} />
          <Ellipse cx="42" cy="28" rx="12" ry="8" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "tallPine":
      return (
        <>
          <Path d="M50 10 L62 34 L38 34 Z" fill={palette.shade} opacity={0.55} />
          <Path d="M50 14 L60 34 L40 34 Z" fill={fill} />
          <Path d="M50 28 L66 52 L34 52 Z" fill={fill} opacity={0.95} />
          <Path d="M50 42 L70 68 L30 68 Z" fill={palette.canopy} opacity={0.92} />
          <Path d="M50 18 L56 30 L44 30 Z" fill={palette.highlight} opacity={0.45} />
        </>
      );

    case "fruitRound":
      return (
        <>
          <Ellipse cx="50" cy="46" rx="32" ry="28" fill={palette.canopy} opacity={0.18} />
          <Circle cx="36" cy="48" r="18" fill={fill} opacity={0.9} />
          <Circle cx="64" cy="46" r="17" fill={fill} opacity={0.9} />
          <Circle cx="50" cy="32" r="19" fill={fill} opacity={0.95} />
          <Circle cx="50" cy="46" r="14" fill={palette.canopy} opacity={0.8} />
          {palette.accent && (
            <>
              <Circle cx="38" cy="42" r="2.2" fill={palette.accent} />
              <Circle cx="56" cy="34" r="2.2" fill={palette.accent} />
              <Circle cx="64" cy="50" r="2" fill={palette.accent} />
              <Circle cx="46" cy="52" r="2" fill={palette.accent} />
              <Circle cx="52" cy="44" r="1.8" fill={palette.accent} opacity={0.9} />
            </>
          )}
        </>
      );

    case "blossomCloud":
      return (
        <>
          <Ellipse cx="50" cy="42" rx="34" ry="28" fill={palette.canopy} opacity={0.2} />
          <Circle cx="34" cy="46" r="18" fill={palette.shade} opacity={0.35} />
          <Circle cx="66" cy="44" r="17" fill={palette.shade} opacity={0.3} />
          <Circle cx="36" cy="42" r="17" fill={fill} opacity={0.9} />
          <Circle cx="64" cy="40" r="16" fill={fill} opacity={0.9} />
          <Circle cx="50" cy="28" r="18" fill={fill} opacity={0.95} />
          <Ellipse cx="42" cy="30" rx="10" ry="7" fill={palette.highlight} opacity={0.45} />
          {(palette.accent ? [0, 1, 2, 3, 4, 5] : []).map((i) => (
            <Circle
              key={i}
              cx={34 + (i % 3) * 14}
              cy={30 + Math.floor(i / 3) * 14}
              r={2.1}
              fill={palette.accent}
              opacity={0.9}
            />
          ))}
        </>
      );

    case "weeping":
      return (
        <>
          <Circle cx="50" cy="30" r="20" fill={fill} opacity={0.92} />
          <Ellipse cx="30" cy="52" rx="11" ry="26" fill={palette.canopy} opacity={0.78} />
          <Ellipse cx="70" cy="54" rx="11" ry="28" fill={palette.canopy} opacity={0.78} />
          <Ellipse cx="40" cy="62" rx="9" ry="24" fill={palette.shade} opacity={0.5} />
          <Ellipse cx="60" cy="64" rx="9" ry="26" fill={palette.shade} opacity={0.45} />
          <Ellipse cx="50" cy="68" rx="8" ry="24" fill={palette.canopy} opacity={0.65} />
          <Ellipse cx="44" cy="26" rx="9" ry="6" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "columnar":
      return (
        <>
          <Ellipse cx="50" cy="48" rx="16" ry="42" fill={palette.canopy} opacity={0.18} />
          <Ellipse cx="50" cy="46" rx="14" ry="40" fill={fill} opacity={0.94} />
          <Ellipse cx="46" cy="36" rx="7" ry="18" fill={palette.highlight} opacity={0.35} />
          <Ellipse cx="54" cy="56" rx="6" ry="16" fill={palette.shade} opacity={0.35} />
        </>
      );

    case "conicalEvergreen":
      return (
        <>
          <Path d="M50 12 L64 40 L36 40 Z" fill={palette.shade} opacity={0.5} />
          <Path d="M50 14 L62 40 L38 40 Z" fill={fill} />
          <Path d="M50 30 L68 58 L32 58 Z" fill={fill} opacity={0.95} />
          <Path d="M50 46 L72 76 L28 76 Z" fill={palette.canopy} opacity={0.92} />
          <Path d="M50 18 L56 32 L44 32 Z" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "flameEvergreen":
      return (
        <>
          <Path
            d="M50 12 C58 28 62 44 60 70 C58 88 42 88 40 70 C38 44 42 28 50 12 Z"
            fill={fill}
            opacity={0.95}
          />
          <Path
            d="M50 18 C54 30 56 44 55 62"
            stroke={palette.highlight}
            strokeWidth={3}
            opacity={0.35}
            fill="none"
          />
        </>
      );

    case "chestnutSpikes":
      return (
        <>
          <Circle cx="36" cy="48" r="18" fill={fill} opacity={0.9} />
          <Circle cx="64" cy="46" r="17" fill={fill} opacity={0.9} />
          <Circle cx="50" cy="32" r="19" fill={fill} opacity={0.95} />
          {(palette.accent ? [0, 1, 2, 3, 4] : []).map((i) => (
            <Ellipse
              key={i}
              cx={36 + i * 7}
              cy={28 + (i % 2) * 6}
              rx={2}
              ry={7}
              fill={palette.accent}
              opacity={0.85}
            />
          ))}
        </>
      );

    case "flatTop":
      return (
        <>
          <Ellipse cx="50" cy="42" rx="40" ry="14" fill={palette.canopy} opacity={0.2} />
          <Ellipse cx="50" cy="40" rx="38" ry="13" fill={fill} opacity={0.94} />
          <Ellipse cx="36" cy="38" rx="14" ry="8" fill={palette.highlight} opacity={0.35} />
          <Ellipse cx="66" cy="42" rx="12" ry="7" fill={palette.shade} opacity={0.35} />
        </>
      );

    case "bottle":
      return (
        <>
          <Ellipse cx="50" cy="42" rx="22" ry="14" fill={palette.canopy} opacity={0.2} />
          <Circle cx="38" cy="40" r="10" fill={fill} opacity={0.9} />
          <Circle cx="62" cy="38" r="9" fill={fill} opacity={0.9} />
          <Circle cx="50" cy="30" r="11" fill={fill} opacity={0.95} />
          <Circle cx="44" cy="34" r="5" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "oliveTwisted":
      return (
        <>
          <Ellipse cx="50" cy="44" rx="30" ry="24" fill={palette.canopy} opacity={0.18} />
          <Ellipse cx="50" cy="42" rx="26" ry="22" fill={fill} opacity={0.9} />
          <Ellipse cx="40" cy="38" rx="12" ry="10" fill={palette.highlight} opacity={0.35} />
          <Ellipse cx="60" cy="46" rx="10" ry="9" fill={palette.shade} opacity={0.35} />
        </>
      );

    case "bambooClump":
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 30 + i * 10;
            const h = 70 + (i % 3) * 10;
            const top = 112 - h;
            return (
              <React.Fragment key={i}>
                <Rect x={x} y={top} width={5} height={h} rx={2} fill={palette.trunk} />
                <Rect x={x} y={top + h * 0.35} width={5} height={2} fill={palette.shade} opacity={0.35} />
                <Rect x={x} y={top + h * 0.65} width={5} height={2} fill={palette.shade} opacity={0.3} />
                <Ellipse cx={x + 2.5} cy={top + 4} rx={10} ry={8} fill={fill} opacity={0.85} />
                <Ellipse cx={x - 2} cy={top + 10} rx={7} ry={5} fill={palette.highlight} opacity={0.4} />
              </React.Fragment>
            );
          })}
        </>
      );

    case "ginkgoFan":
      return (
        <>
          <Ellipse cx="50" cy="42" rx="34" ry="28" fill={palette.canopy} opacity={0.18} />
          <Path d="M50 62 C28 52 22 34 36 24 C44 18 50 22 50 30 C50 22 56 18 64 24 C78 34 72 52 50 62 Z" fill={fill} />
          <Path d="M50 58 C36 48 34 36 42 28" stroke={palette.highlight} strokeWidth={2} opacity={0.35} fill="none" />
        </>
      );

    case "jacarandaCloud":
      return (
        <>
          <Ellipse cx="50" cy="42" rx="36" ry="28" fill={palette.canopy} opacity={0.2} />
          <Circle cx="32" cy="46" r="16" fill={fill} opacity={0.85} />
          <Circle cx="68" cy="44" r="15" fill={fill} opacity={0.85} />
          <Circle cx="50" cy="30" r="18" fill={fill} opacity={0.92} />
          <Circle cx="42" cy="40" r="12" fill={palette.highlight} opacity={0.45} />
          <Circle cx="60" cy="38" r="11" fill={palette.canopy} opacity={0.55} />
          {(palette.accent ? [0, 1, 2, 3, 4, 5, 6] : []).map((i) => (
            <Circle
              key={i}
              cx={30 + (i % 4) * 12}
              cy={26 + Math.floor(i / 4) * 14}
              r={1.8}
              fill={palette.accent}
              opacity={0.85}
            />
          ))}
        </>
      );
  }
}
