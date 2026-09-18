import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";

import type { ForestTree, ForestTreeType } from "@/types/forest";
import type { GrowthStage } from "@/types/forest";
import type { MoodKey } from "@/utils/phrases";

// ─── Mood palette ─────────────────────────────────────────────────────────────
// Every mood gets a beautiful, calm tone — no mood looks "worse" than another.

const LEAF_PALETTE: Record<
  MoodKey,
  { primary: string; secondary: string; highlight: string; accent: string }
> = {
  good: {
    primary: "#7AA95A",
    secondary: "#9FBE68",
    highlight: "#D2D982",
    accent: "#E7B85B",
  },
  calm: {
    primary: "#8FA85A",
    secondary: "#F1B7BC",
    highlight: "#FFE0D6",
    accent: "#F4C7A1",
  },
  neutral: {
    primary: "#AFC76A",
    secondary: "#D8C85E",
    highlight: "#EFE18C",
    accent: "#D8A94D",
  },
  sad: {
    primary: "#7FA09B",
    secondary: "#9EB7A9",
    highlight: "#CFD9BC",
    accent: "#E4C06F",
  },
  anxious: {
    primary: "#D99B2D",
    secondary: "#F0B44B",
    highlight: "#FFD37A",
    accent: "#A7712F",
  },
  tired: {
    primary: "#8BA882",
    secondary: "#B4BA73",
    highlight: "#DAD69A",
    accent: "#D7A95E",
  },
};

const TRUNK_PALETTE: Record<MoodKey, { base: string; shade: string }> = {
  good: { base: "#8B6346", shade: "#5E3F2C" },
  calm: { base: "#7A5C38", shade: "#4F3B27" },
  neutral: { base: "#7A6040", shade: "#51402C" },
  sad: { base: "#667365", shade: "#46534B" },
  anxious: { base: "#8B6B30", shade: "#5D471F" },
  tired: { base: "#7A7060", shade: "#554C42" },
};

const TYPE_BY_MOOD: Record<MoodKey, ForestTreeType> = {
  good: "oak",
  calm: "cherry",
  neutral: "birch",
  tired: "willow",
  anxious: "pine",
  sad: "willow",
};

const SIZE_BY_STAGE: Record<GrowthStage, number> = {
  0: 0.62,
  1: 0.78,
  2: 0.92,
  3: 1,
};

const TREE_SIZE = 96;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  tree: ForestTree;
}

/**
 * Tree
 *
 * Renders hand-drawn SVG tree illustrations with soft, watercolor-like shapes.
 * The variants are intentionally illustrative (not photo assets) and include
 * small leaves, blossoms and branch details so every planted tree feels alive.
 */
export function Tree({ tree }: Props) {
  return (
    <View style={styles.root}>
      <TreeIllustration tree={tree} />
    </View>
  );
}

// ─── Illustration ─────────────────────────────────────────────────────────────

function TreeIllustration({ tree }: { tree: ForestTree }) {
  const mood = tree.mood;
  const treeType = tree.treeType ?? TYPE_BY_MOOD[mood];
  const scale = SIZE_BY_STAGE[tree.growthStage] ?? SIZE_BY_STAGE[0];
  const leaves = LEAF_PALETTE[mood];
  const trunk = TRUNK_PALETTE[mood];

  return (
    <View style={[styles.tree, { transform: [{ scale }] }]}>
      <Svg width={TREE_SIZE} height={TREE_SIZE} viewBox="0 0 96 96">
        <Ellipse cx="48" cy="88" rx="30" ry="6" fill="#D8C99A" opacity="0.38" />
        <Ellipse cx="48" cy="87" rx="22" ry="4" fill="#8FA55B" opacity="0.25" />
        <Trunk treeType={treeType} trunk={trunk} />
        <Crown treeType={treeType} leaves={leaves} trunkShade={trunk.shade} />
        <GroundDetails leaves={leaves} />
      </Svg>
    </View>
  );
}

function Trunk({
  treeType,
  trunk,
}: {
  treeType: ForestTreeType;
  trunk: { base: string; shade: string };
}) {
  if (treeType === "birch") {
    return (
      <G>
        <Path
          d="M45 84 C46 66 45 53 44 35"
          stroke="#F2E9D5"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <Path
          d="M50 84 C50 67 51 54 53 36"
          stroke="#EEE4CA"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <Line
          x1="42"
          y1="48"
          x2="49"
          y2="46"
          stroke="#47382C"
          strokeWidth="1.6"
        />
        <Line
          x1="45"
          y1="61"
          x2="51"
          y2="59"
          stroke="#47382C"
          strokeWidth="1.5"
        />
        <Line
          x1="41"
          y1="72"
          x2="48"
          y2="70"
          stroke="#47382C"
          strokeWidth="1.4"
        />
      </G>
    );
  }

  return (
    <G>
      <Path
        d="M45 84 C46 68 47 54 48 38 C50 55 51 69 52 84 Z"
        fill={trunk.base}
      />
      <Path
        d="M48 39 C43 50 38 58 31 63"
        stroke={trunk.shade}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M50 42 C56 52 62 59 69 64"
        stroke={trunk.shade}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M47 55 C42 63 38 70 34 78"
        stroke={trunk.shade}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <Path
        d="M51 57 C56 64 60 71 64 79"
        stroke={trunk.shade}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </G>
  );
}

function Crown({
  treeType,
  leaves,
  trunkShade,
}: {
  treeType: ForestTreeType;
  leaves: Record<"primary" | "secondary" | "highlight" | "accent", string>;
  trunkShade: string;
}) {
  if (treeType === "pine") {
    return <PineCrown leaves={leaves} trunkShade={trunkShade} />;
  }

  if (treeType === "willow") {
    return <WillowCrown leaves={leaves} trunkShade={trunkShade} />;
  }

  const isCherry = treeType === "cherry";
  const isBirch = treeType === "birch";

  return (
    <G>
      <Circle cx="37" cy="42" r="15" fill={leaves.primary} />
      <Circle
        cx="53"
        cy="35"
        r="17"
        fill={isCherry ? leaves.secondary : leaves.primary}
      />
      <Circle cx="62" cy="49" r="15" fill={leaves.secondary} />
      <Circle cx="29" cy="56" r="13" fill={leaves.secondary} />
      <Circle cx="48" cy="58" r="18" fill={leaves.primary} />
      <Circle cx="44" cy="28" r="9" fill={leaves.highlight} opacity="0.82" />
      <Circle cx="66" cy="37" r="8" fill={leaves.highlight} opacity="0.72" />
      <Circle cx="35" cy="61" r="7" fill={leaves.highlight} opacity="0.6" />
      <Path
        d="M32 51 C42 45 55 43 66 49"
        stroke={trunkShade}
        strokeWidth="1.4"
        opacity="0.45"
        fill="none"
      />
      <LifeDots isCherry={isCherry} isBirch={isBirch} leaves={leaves} />
    </G>
  );
}

function PineCrown({
  leaves,
  trunkShade,
}: {
  leaves: Record<"primary" | "secondary" | "highlight" | "accent", string>;
  trunkShade: string;
}) {
  return (
    <G>
      <Path
        d="M48 13 L30 43 H38 L25 63 H40 L31 78 H65 L56 63 H71 L58 43 H66 Z"
        fill={leaves.primary}
      />
      <Path
        d="M48 20 L35 44 H42 L32 60 H45 L38 74 H48 Z"
        fill={leaves.secondary}
        opacity="0.75"
      />
      <Path
        d="M50 18 L60 43 H55 L66 62 H56 L62 75 H50 Z"
        fill="#466845"
        opacity="0.42"
      />
      <Line
        x1="48"
        y1="24"
        x2="48"
        y2="80"
        stroke={trunkShade}
        strokeWidth="2"
        opacity="0.35"
      />
      <Circle cx="39" cy="51" r="2" fill={leaves.highlight} opacity="0.7" />
      <Circle cx="59" cy="59" r="2" fill={leaves.highlight} opacity="0.55" />
    </G>
  );
}

function WillowCrown({
  leaves,
  trunkShade,
}: {
  leaves: Record<"primary" | "secondary" | "highlight" | "accent", string>;
  trunkShade: string;
}) {
  const strands = [28, 34, 40, 47, 54, 61, 68];

  return (
    <G>
      <Ellipse cx="48" cy="38" rx="25" ry="18" fill={leaves.primary} />
      <Ellipse
        cx="43"
        cy="47"
        rx="22"
        ry="18"
        fill={leaves.secondary}
        opacity="0.9"
      />
      <Ellipse
        cx="58"
        cy="50"
        rx="18"
        ry="20"
        fill={leaves.primary}
        opacity="0.86"
      />
      {strands.map((x, index) => (
        <Path
          key={x}
          d={`M${x} 38 C${x - 4} ${55 + index} ${x - 2} 66 ${x - 7} 77`}
          stroke={index % 2 === 0 ? leaves.secondary : leaves.highlight}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.78"
        />
      ))}
      <Path
        d="M33 51 C43 43 56 43 66 51"
        stroke={trunkShade}
        strokeWidth="1.3"
        opacity="0.35"
        fill="none"
      />
    </G>
  );
}

function LifeDots({
  isCherry,
  isBirch,
  leaves,
}: {
  isCherry: boolean;
  isBirch: boolean;
  leaves: Record<"primary" | "secondary" | "highlight" | "accent", string>;
}) {
  const dots = [
    [28, 45],
    [39, 31],
    [54, 23],
    [69, 45],
    [58, 63],
    [43, 66],
  ];

  return (
    <G>
      {dots.map(([cx, cy], index) => (
        <Circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={isCherry ? 2.6 : isBirch ? 1.8 : 2.1}
          fill={
            isCherry ? "#FFE3DC" : index % 2 ? leaves.highlight : leaves.accent
          }
          opacity={isCherry ? 0.95 : 0.72}
        />
      ))}
    </G>
  );
}

function GroundDetails({
  leaves,
}: {
  leaves: Record<"primary" | "secondary" | "highlight" | "accent", string>;
}) {
  return (
    <G>
      <Path
        d="M22 86 C28 82 31 83 34 86"
        stroke={leaves.primary}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M60 86 C65 82 69 83 73 86"
        stroke={leaves.secondary}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="29" cy="82" r="1.8" fill={leaves.accent} opacity="0.8" />
      <Circle cx="70" cy="82" r="1.7" fill={leaves.highlight} opacity="0.85" />
      <Rect
        x="43"
        y="84"
        width="10"
        height="3"
        rx="1.5"
        fill="#8FA55B"
        opacity="0.45"
      />
    </G>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: TREE_SIZE,
    height: TREE_SIZE,
  },
  tree: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: TREE_SIZE,
    height: TREE_SIZE,
  },
});
