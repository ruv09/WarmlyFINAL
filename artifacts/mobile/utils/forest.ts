import type { MoodKey } from "@/utils/phrases";
import type { ForestTree, ForestStats, ForestTreeType } from "@/types/forest";

// ─── Tree type mapping ────────────────────────────────────────────────────────

const TYPE_BY_MOOD: Record<MoodKey, ForestTreeType> = {
  good:    "oak",
  calm:    "cherry",
  neutral: "birch",
  tired:   "willow",
  anxious: "pine",
  sad:     "willow",
};

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Создаёт и возвращает новый объект дерева (чистая функция, без побочных эффектов).
 * Хранение — ответственность ForestContext.
 *
 * @param mood    Настроение записи.
 * @param note    Заметка пользователя (если была оставлена).
 */
export function plantTree(mood: MoodKey, note?: string): ForestTree {
  const now = new Date().toISOString();
  return {
    id:          `tree_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    mood,
    growthStage: 0,
    createdAt:   now,
    lastUpdated: now,
    note:        note || undefined,
    isFavorite:  false,
    x:           Math.random(),
    y:           Math.random(),
    treeType:    TYPE_BY_MOOD[mood],
  };
}

// ─── Future functions ─────────────────────────────────────────────────────────
// Архитектурные заглушки. Реализация — в следующих спринтах.

/**
 * Переводит дерево на следующую стадию роста (max 3).
 * TODO: реализовать логику роста.
 */
export function growTree(tree: ForestTree): ForestTree {
  // TODO: увеличить growthStage, обновить lastUpdated, скорректировать размер кроны
  return tree;
}

/**
 * Помечает дерево как удалённое (или убирает из массива).
 * TODO: реализовать с подтверждением.
 */
export function deleteTree(trees: ForestTree[], id: string): ForestTree[] {
  // TODO: мягкое удаление или фильтрация
  return trees;
}

/**
 * Обновляет произвольные поля дерева, проставляет lastUpdated.
 * TODO: реализовать с частичным слиянием полей.
 */
export function updateTree(
  tree: ForestTree,
  _patch: Partial<Pick<ForestTree, "note" | "isFavorite">>,
): ForestTree {
  // TODO: вернуть { ...tree, ..._patch, lastUpdated: new Date().toISOString() }
  return tree;
}

/**
 * Возвращает агрегированную статистику по дереву или группе деревьев.
 * TODO: расширить метриками (streak, любимое настроение, стадии роста и т. д.).
 */
export function getTreeStatistics(trees: ForestTree[]): ForestStats {
  // TODO: расширенная аналитика
  return calculateForestStats(trees);
}

// ─── Statistics ───────────────────────────────────────────────────────────────

/** Вычисляет агрегированную статистику по списку деревьев. */
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
    totalTrees:    trees.length,
    mostCommonMood,
    oldestTree:    sorted[0] ?? null,
    newestTree:    sorted[sorted.length - 1] ?? null,
  };
}

// ─── Display helpers ──────────────────────────────────────────────────────────

/** Возвращает отображаемые данные (эмодзи, название, тинт) для настроения. */
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
