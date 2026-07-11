import React from "react";
import { StyleSheet, View } from "react-native";

import type { ForestTree } from "@/types/forest";
import type { MoodKey } from "@/utils/phrases";

// ─── Mood palette ─────────────────────────────────────────────────────────────
// Every mood gets a beautiful, calm tone — no mood looks "worse" than another.

const CROWN_COLOR: Record<MoodKey, string> = {
  good:    "#7DC17E", // светло-зелёный
  calm:    "#5DAA7A", // тёпло-зелёный
  neutral: "#9DC36A", // золотисто-зелёный
  sad:     "#6BAAB5", // голубовато-зелёный
  anxious: "#C4A84A", // тёмно-янтарный
  tired:   "#8BA882", // серо-зелёный
};

const TRUNK_COLOR: Record<MoodKey, string> = {
  good:    "#8B6346",
  calm:    "#7A5C38",
  neutral: "#7A6040",
  sad:     "#6B7A8B",
  anxious: "#8B6B30",
  tired:   "#7A7060",
};

// ─── Dimensions ───────────────────────────────────────────────────────────────
// All trees are the same size in Sprint 3.
// Growth will be wired in a later sprint.

const CROWN_SIZE = 54;
const TRUNK_W    = 10;
const TRUNK_H    = 22;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  tree: ForestTree;
}

/**
 * Tree — Sprint 3
 *
 * Renders a tree using plain React Native Views (round crown + trunk).
 * The inner <TreeIllustration> is deliberately isolated so it can be
 * swapped for an SVG or PNG in a later sprint without touching any
 * other logic (ForestScene, ForestContext, etc.).
 */
export function Tree({ tree }: Props) {
  return (
    <View style={styles.root}>
      <TreeIllustration mood={tree.mood} />
    </View>
  );
}

// ─── Illustration ─────────────────────────────────────────────────────────────
// Swap this component for SVG / PNG in a future sprint.

function TreeIllustration({ mood }: { mood: MoodKey }) {
  const crownColor = CROWN_COLOR[mood];
  const trunkColor = TRUNK_COLOR[mood];

  return (
    <View style={styles.tree}>
      {/* Crown — round canopy */}
      <View
        style={[
          styles.crown,
          { backgroundColor: crownColor },
        ]}
      />
      {/* Trunk */}
      <View
        style={[
          styles.trunk,
          { backgroundColor: trunkColor },
        ]}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tree: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  crown: {
    width: CROWN_SIZE,
    height: CROWN_SIZE,
    borderRadius: CROWN_SIZE / 2,
  },
  trunk: {
    width: TRUNK_W,
    height: TRUNK_H,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    marginTop: -4, // slight overlap so crown sits on the trunk
  },
});
