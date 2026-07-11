import type { MoodKey } from "@/utils/phrases";
import type { ForestTree, ForestStats, ForestTreeType } from "@/types/forest";

// ─── Pure factory ─────────────────────────────────────────────────────────────
// plantTree() creates a tree object but does NOT store it.
// Persistence is handled by ForestContext.

const TYPE_BY_MOOD: Record<MoodKey, ForestTreeType> = {
  good: "oak",
  calm: "cherry",
  neutral: "birch",
  tired: "willow",
  anxious: "pine",
  sad: "willow",
};

/** Creates and returns a new ForestTree for the given mood (pure, no side-effects). */
export function plantTree(mood: MoodKey): ForestTree {
  return {
    id: `tree_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    mood,
    createdAt: new Date().toISOString(),
    // x: 0..1 — horizontal position in the scene
    // y: 0..1 — depth offset (0 = near ground, 1 = higher / further back)
    x: Math.random(),
    y: Math.random(),
    treeType: TYPE_BY_MOOD[mood],
  };
}

/** Returns display data (emoji, label, tint colour) for a mood. */
export function getTreeByMood(
  mood: MoodKey,
): { emoji: string; label: string; tint: string } {
  const map: Record<MoodKey, { emoji: string; label: string; tint: string }> = {
    good:    { emoji: "🌳", label: "Дуб",    tint: "#5DAA7A" },
    calm:    { emoji: "🌸", label: "Сакура", tint: "#E8A0B4" },
    neutral: { emoji: "🌲", label: "Ель",    tint: "#7C9B6F" },
    tired:   { emoji: "🍃", label: "Ива",    tint: "#8BAF8B" },
    anxious: { emoji: "🍁", label: "Клён",   tint: "#D4A847" },
    sad:     { emoji: "🍂", label: "Осина",  tint: "#C4855A" },
  };
  return map[mood];
}

/** Calculates aggregate statistics for a list of trees. */
export function calculateForestStats(trees: ForestTree[]): ForestStats {
  if (trees.length === 0) {
    return { totalTrees: 0, mostCommonMood: null, oldestTree: null, newestTree: null };
  }

  const moodCount: Partial<Record<MoodKey, number>> = {};
  for (const tree of trees) {
    moodCount[tree.mood] = (moodCount[tree.mood] ?? 0) + 1;
  }
  const mostCommonMood =
    (Object.entries(moodCount) as [MoodKey, number][])
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const sorted = [...trees].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return {
    totalTrees: trees.length,
    mostCommonMood,
    oldestTree: sorted[0] ?? null,
    newestTree: sorted[sorted.length - 1] ?? null,
  };
}
