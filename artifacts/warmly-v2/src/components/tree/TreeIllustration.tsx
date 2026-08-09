import React, { memo, useMemo } from "react";
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { Tree } from "../../types";
import { CanopyShape, getSpeciesVisual, SpeciesVisual } from "../../constants/treeSpecies";
import { useTheme } from "../../theme";

interface TreeIllustrationProps {
  tree: Tree;
  /** Высота иллюстрации; ширина из вертикального viewBox. */
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
  glow: string;
  spark: string;
}

/** Вертикальный кадр в фас — мягкий «пушистый» стиль гайда. */
const VB_W = 100;
const VB_H = 130;

export const TreeIllustration = memo(function TreeIllustration({
  tree,
  size = 96,
  showLights = true,
}: TreeIllustrationProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const visual = getSpeciesVisual(tree.species);
  const width = Math.round(size * (VB_W / VB_H));
  const height = size;

  const palette = useMemo<Palette>(
    () => ({
      canopy: isDark ? visual.canopyColorDark : visual.canopyColor,
      highlight: isDark ? visual.canopyHighlightDark : visual.canopyHighlight,
      shade: isDark ? visual.canopyShadeDark : visual.canopyShade,
      trunk: isDark ? visual.trunkColorDark : visual.trunkColor,
      accent: isDark ? visual.accentColorDark ?? visual.accentColor : visual.accentColor,
      grass: isDark ? "#3A4A38" : "#A8C878",
      grassDeep: isDark ? "#2A3828" : "#84A85C",
      glow: isDark ? theme.colors.accentWarm : "#FFE9B8",
      spark: isDark ? "#FFF3D0" : "#FFF8E8",
    }),
    [isDark, visual, theme.colors.accentWarm],
  );

  const sparks = useMemo(() => sparkPositions(tree.id), [tree.id]);
  const gid = `warm-canopy-${tree.id}`;
  const baseGlowId = `warm-base-${tree.id}`;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
      <Defs>
        <RadialGradient id={gid} cx="42%" cy="38%" rx="58%" ry="52%">
          <Stop offset="0" stopColor={palette.highlight} stopOpacity={0.98} />
          <Stop offset="0.5" stopColor={palette.canopy} stopOpacity={0.94} />
          <Stop offset="1" stopColor={palette.shade} stopOpacity={0.9} />
        </RadialGradient>
        <RadialGradient id={baseGlowId} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={palette.glow} stopOpacity={isDark ? 0.55 : 0.45} />
          <Stop offset="0.55" stopColor={palette.glow} stopOpacity={isDark ? 0.18 : 0.16} />
          <Stop offset="1" stopColor={palette.glow} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* Мягкая тень */}
      <Ellipse cx="50" cy="118" rx="26" ry="4.5" fill="#000000" opacity={isDark ? 0.2 : 0.07} />

      {/* Свечение у основания + травка */}
      <Ellipse cx="50" cy="112" rx="34" ry="14" fill={`url(#${baseGlowId})`} />
      <Ellipse cx="50" cy="116" rx="28" ry="6.5" fill={palette.grass} opacity={0.92} />
      <Ellipse cx="40" cy="115" rx="9" ry="3.5" fill={palette.grassDeep} opacity={0.5} />
      <Ellipse cx="62" cy="116" rx="8" ry="3" fill={palette.grassDeep} opacity={0.4} />

      {renderTrunk(visual, palette)}
      {renderCanopy(visual.canopyShape, palette, gid)}

      {/* Лёгкое внутреннее свечение кроны */}
      <Ellipse cx="50" cy="42" rx="22" ry="18" fill={palette.glow} opacity={isDark ? 0.14 : 0.1} />

      {showLights &&
        sparks.map((p, i) => (
          <React.Fragment key={i}>
            <Circle cx={p.x} cy={p.y} r={p.r * 2.2} fill={palette.glow} opacity={0.18} />
            <Circle cx={p.x} cy={p.y} r={p.r} fill={palette.spark} opacity={0.9} />
          </React.Fragment>
        ))}
    </Svg>
  );
});

function sparkPositions(treeId: string): { x: number; y: number; r: number }[] {
  let hash = 0;
  for (let i = 0; i < treeId.length; i++) hash = (hash * 31 + treeId.charCodeAt(i)) >>> 0;
  const points: { x: number; y: number; r: number }[] = [];
  const count = 5 + (hash % 3);
  for (let i = 0; i < count; i++) {
    const n = (hash + i * 7919) >>> 0;
    points.push({
      x: 22 + (n % 56),
      y: 16 + ((n >> 5) % 70),
      r: 0.9 + ((n >> 12) % 3) * 0.35,
    });
  }
  // Пара частиц у основания — как на гайде
  points.push({ x: 36 + (hash % 8), y: 108, r: 1.1 });
  points.push({ x: 58 + ((hash >> 3) % 8), y: 110, r: 0.95 });
  return points;
}

/** Мягкий «комок» листвы — основа стиля гайда. */
function Clump({
  cx,
  cy,
  r,
  fill,
  opacity = 0.95,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  opacity?: number;
}) {
  return <Circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />;
}

function renderTrunk(visual: SpeciesVisual, palette: Palette) {
  switch (visual.canopyShape) {
    case "birchTall":
      return (
        <>
          <Rect x="47" y="48" width="6" height="66" rx="3" fill={palette.trunk} />
          <Rect x="48.2" y="58" width={1.2} height={7} rx={0.5} fill="#4A4038" opacity={0.35} />
          <Rect x="50.5" y="74" width={1.2} height={6} rx={0.5} fill="#4A4038" opacity={0.3} />
          <Rect x="48.5" y="92" width={1.1} height={5} rx={0.5} fill="#4A4038" opacity={0.28} />
        </>
      );
    case "poplarSlim":
      return <Rect x="47" y="36" width="6" height="78" rx="3" fill={palette.trunk} />;
    case "pineTiered":
      return <Rect x="47.5" y="58" width="5" height="56" rx="2.5" fill={palette.trunk} />;
    case "willowWeep":
      return <Rect x="46.5" y="46" width="7" height="68" rx="3.2" fill={palette.trunk} />;
    case "seabuckthornSparse":
      return (
        <>
          <Path d="M50 114 L48 70 L44 52" stroke={palette.trunk} strokeWidth={4.5} strokeLinecap="round" fill="none" />
          <Path d="M49 80 L58 58" stroke={palette.trunk} strokeWidth={3.2} strokeLinecap="round" fill="none" />
          <Path d="M48 90 L38 66" stroke={palette.trunk} strokeWidth={3} strokeLinecap="round" fill="none" />
        </>
      );
    default:
      return (
        <>
          <Rect x="46" y="58" width="8" height="56" rx="3.5" fill={palette.trunk} />
          <Path d="M46 108 Q40 112 36 114" stroke={palette.trunk} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7} />
          <Path d="M54 108 Q60 112 64 114" stroke={palette.trunk} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7} />
        </>
      );
  }
}

function renderCanopy(shape: CanopyShape, palette: Palette, gid: string) {
  const fill = `url(#${gid})`;

  switch (shape) {
    case "oakClumps":
      return (
        <>
          <Ellipse cx="50" cy="48" rx="38" ry="32" fill={palette.canopy} opacity={0.16} />
          <Clump cx={30} cy={54} r={18} fill={palette.shade} opacity={0.45} />
          <Clump cx={70} cy={52} r={17} fill={palette.shade} opacity={0.4} />
          <Clump cx={34} cy={46} r={18} fill={fill} />
          <Clump cx={66} cy={44} r={17} fill={fill} />
          <Clump cx={50} cy={30} r={20} fill={fill} />
          <Clump cx={42} cy={50} r={15} fill={palette.canopy} opacity={0.85} />
          <Clump cx={58} cy={48} r={14} fill={palette.canopy} opacity={0.8} />
          <Ellipse cx="40" cy="32" rx="10" ry="7" fill={palette.highlight} opacity={0.45} />
        </>
      );

    case "birchTall":
      return (
        <>
          <Ellipse cx="50" cy="40" rx="22" ry="32" fill={palette.canopy} opacity={0.16} />
          <Clump cx={50} cy={28} r={16} fill={fill} />
          <Clump cx={40} cy={40} r={13} fill={fill} />
          <Clump cx={60} cy={42} r={13} fill={fill} />
          <Clump cx={50} cy={50} r={14} fill={palette.canopy} opacity={0.88} />
          <Ellipse cx="44" cy="30" rx="8" ry="10" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "mapleJagged":
      return (
        <>
          <Ellipse cx="50" cy="44" rx="36" ry="28" fill={palette.canopy} opacity={0.16} />
          <Path
            d="M50 18 C62 22 74 34 72 48 C78 52 74 62 64 64 C60 74 40 74 36 64 C24 62 22 50 28 44 C24 32 38 18 50 18 Z"
            fill={fill}
          />
          <Clump cx={38} cy={40} r={12} fill={palette.highlight} opacity={0.35} />
          <Clump cx={60} cy={46} r={11} fill={palette.shade} opacity={0.35} />
        </>
      );

    case "lindenRound":
      return (
        <>
          <Ellipse cx="50" cy="44" rx="34" ry="30" fill={palette.canopy} opacity={0.16} />
          <Clump cx={50} cy={42} r={30} fill={fill} />
          <Clump cx={50} cy={40} r={24} fill={palette.canopy} opacity={0.55} />
          <Ellipse cx="40" cy="34" rx="12" ry="9" fill={palette.highlight} opacity={0.42} />
        </>
      );

    case "pineTiered":
      return (
        <>
          <Path d="M50 12 L63 36 L37 36 Z" fill={palette.shade} opacity={0.5} />
          <Path d="M50 14 L61 36 L39 36 Z" fill={fill} />
          <Path d="M50 28 L67 54 L33 54 Z" fill={fill} opacity={0.95} />
          <Path d="M50 44 L71 72 L29 72 Z" fill={palette.canopy} opacity={0.92} />
          <Path d="M50 18 L56 30 L44 30 Z" fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "appleFruit":
      return (
        <>
          <Ellipse cx="50" cy="46" rx="32" ry="28" fill={palette.canopy} opacity={0.16} />
          <Clump cx={34} cy={48} r={17} fill={fill} />
          <Clump cx={66} cy={46} r={16} fill={fill} />
          <Clump cx={50} cy={32} r={18} fill={fill} />
          <Clump cx={50} cy={46} r={14} fill={palette.canopy} opacity={0.82} />
          {palette.accent && (
            <>
              <Circle cx="38" cy="44" r={2.4} fill={palette.accent} />
              <Circle cx="56" cy="36" r={2.4} fill={palette.accent} />
              <Circle cx="64" cy="52" r={2.2} fill={palette.accent} />
              <Circle cx="46" cy="54" r={2.2} fill={palette.accent} />
              <Circle cx="52" cy="44" r={2} fill={palette.accent} opacity={0.9} />
            </>
          )}
        </>
      );

    case "sakuraFluff":
      return (
        <>
          <Ellipse cx="50" cy="42" rx="36" ry="28" fill={palette.canopy} opacity={0.18} />
          <Clump cx={32} cy={46} r={17} fill={palette.shade} opacity={0.35} />
          <Clump cx={68} cy={44} r={16} fill={palette.shade} opacity={0.3} />
          <Clump cx={34} cy={40} r={17} fill={fill} />
          <Clump cx={66} cy={38} r={16} fill={fill} />
          <Clump cx={50} cy={26} r={18} fill={fill} />
          <Clump cx={44} cy={44} r={13} fill={palette.highlight} opacity={0.45} />
          {/* Падающие лепестки */}
          <Circle cx="28" cy="70" r={1.6} fill={palette.highlight} opacity={0.7} />
          <Circle cx="72" cy="66" r={1.4} fill={palette.highlight} opacity={0.65} />
          <Circle cx="36" cy="82" r={1.3} fill={palette.canopy} opacity={0.55} />
          {palette.accent && (
            <>
              <Circle cx="40" cy="32" r={2} fill={palette.accent} />
              <Circle cx="56" cy="28" r={2} fill={palette.accent} />
              <Circle cx="48" cy="42" r={1.8} fill={palette.accent} />
            </>
          )}
        </>
      );

    case "willowWeep":
      return (
        <>
          <Clump cx={50} cy={30} r={18} fill={fill} />
          <Ellipse cx="28" cy={58} rx={10} ry={30} fill={palette.canopy} opacity={0.78} />
          <Ellipse cx="72" cy={60} rx={10} ry={32} fill={palette.canopy} opacity={0.78} />
          <Ellipse cx="38" cy={68} rx={8} ry={28} fill={palette.shade} opacity={0.5} />
          <Ellipse cx="62" cy={70} rx={8} ry={30} fill={palette.shade} opacity={0.45} />
          <Ellipse cx="50" cy={74} rx={7} ry={28} fill={palette.canopy} opacity={0.65} />
          <Ellipse cx="44" cy={26} rx={9} ry={6} fill={palette.highlight} opacity={0.4} />
        </>
      );

    case "rowanBerries":
      return (
        <>
          <Ellipse cx="50" cy="44" rx="30" ry="26" fill={palette.canopy} opacity={0.16} />
          <Clump cx={36} cy={46} r={15} fill={fill} />
          <Clump cx={64} cy={44} r={14} fill={fill} />
          <Clump cx={50} cy={30} r={16} fill={fill} />
          <Clump cx={50} cy={46} r={12} fill={palette.canopy} opacity={0.8} />
          {palette.accent && (
            <>
              <Circle cx="40" cy="48" r={2.3} fill={palette.accent} />
              <Circle cx="44" cy="52" r={2} fill={palette.accent} />
              <Circle cx="58" cy="40" r={2.2} fill={palette.accent} />
              <Circle cx="62" cy="46" r={2} fill={palette.accent} />
              <Circle cx="50" cy="50" r={2.1} fill={palette.accent} />
            </>
          )}
        </>
      );

    case "poplarSlim":
      return (
        <>
          <Ellipse cx="50" cy="48" rx="15" ry="44" fill={palette.canopy} opacity={0.16} />
          <Clump cx={50} cy={28} r={12} fill={fill} />
          <Clump cx={50} cy={44} r={13} fill={fill} />
          <Clump cx={50} cy={60} r={12} fill={palette.canopy} opacity={0.9} />
          <Ellipse cx="46" cy="34" rx="6" ry="14" fill={palette.highlight} opacity={0.35} />
        </>
      );

    case "chestnutSpikes":
      return (
        <>
          <Ellipse cx="50" cy="44" rx="34" ry="28" fill={palette.canopy} opacity={0.16} />
          <Clump cx={34} cy={48} r={17} fill={fill} />
          <Clump cx={66} cy={46} r={16} fill={fill} />
          <Clump cx={50} cy={30} r={18} fill={fill} />
          {(palette.accent ? [0, 1, 2, 3, 4] : []).map((i) => (
            <Ellipse
              key={i}
              cx={34 + i * 8}
              cy={26 + (i % 2) * 5}
              rx={2.2}
              ry={8}
              fill={palette.accent}
              opacity={0.88}
            />
          ))}
        </>
      );

    case "seabuckthornSparse":
      return (
        <>
          <Clump cx={42} cy={48} r={11} fill={fill} opacity={0.88} />
          <Clump cx={58} cy={42} r={10} fill={fill} opacity={0.88} />
          <Clump cx={50} cy={34} r={9} fill={fill} />
          <Clump cx={36} cy={58} r={8} fill={palette.canopy} opacity={0.75} />
          <Clump cx={64} cy={56} r={8} fill={palette.canopy} opacity={0.75} />
          {palette.accent && (
            <>
              <Circle cx="40" cy="50" r={1.8} fill={palette.accent} />
              <Circle cx="46" cy="44" r={1.6} fill={palette.accent} />
              <Circle cx="56" cy="40" r={1.8} fill={palette.accent} />
              <Circle cx="62" cy="52" r={1.7} fill={palette.accent} />
              <Circle cx="52" cy="56" r={1.5} fill={palette.accent} />
              <Circle cx="34" cy="60" r={1.5} fill={palette.accent} />
            </>
          )}
        </>
      );
  }
}
