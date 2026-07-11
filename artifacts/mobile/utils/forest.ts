import type { MoodKey } from "@/utils/phrases";
import type { ForestTree, ForestStats, ForestTreeType } from "@/types/forest";

// ─── Stub data store (replaced in later sprints with AsyncStorage) ────────────
const _trees: ForestTree[] = [];

/** Returns the current forest (all planted trees). */
export function getForest(): ForestTree[] {
  return _trees;
}

/** Creates and stores a new tree for the given mood. Returns the new tree. */
export function plantTree(mood: MoodKey): ForestTree {
  const typeByMood: Record<MoodKey, ForestTreeType> = {
    good: "oak",
    calm: "cherry",
    neutral: "birch",
    tired: "willow",
    anxious: "pine",
    sad: "willow",
  };

  const tree: ForestTree = {
    id: `tree_${Date.now()}`,
    mood,
    createdAt: new Date().toISOString(),
    x: Math.random(),
    y: Math.random(),
    type: typeByMood[mood],
  };

  _trees.push(tree);
  return tree;
}

/** Returns display data (emoji, label, tint colour) for a mood. */
export function getTreeByMood(
  mood: MoodKey,
): { emoji: string; label: string; tint: string } {
  const map: Record<MoodKey, { emoji: string; label: string; tint: string }> =
    {
      good: { emoji: "🌳", label: "Дуб", tint: "#5DAA7A" },
      calm: { emoji: "🌸", label: "Сакура", tint: "#E8A0B4" },
      neutral: { emoji: "🌲", label: "Ель", tint: "#7C9B6F" },
      tired: { emoji: "🍃", label: "Ива", tint: "#8BAF8B" },
      anxious: { emoji: "🍁", label: "Клён", tint: "#D4A847" },
      sad: { emoji: "🍂", label: "Осина", tint: "#C4855A" },
    };
  return map[mood];
}

/** Calculates aggregate statistics for the forest. */
export function calculateForestStats(trees: ForestTree[]): ForestStats {
  if (trees.length === 0) {
    return {
      totalTrees: 0,
      mostCommonMood: null,
      oldestTree: null,
      newestTree: null,
    };
  }

  const moodCount: Partial<Record<MoodKey, number>> = {};
  for (const tree of trees) {
    moodCount[tree.mood] = (moodCount[tree.mood] ?? 0) + 1;
  }

  const mostCommonMood =
    (Object.entries(moodCount) as [MoodKey, number][]).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0] ?? null;

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
