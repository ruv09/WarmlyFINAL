import type { MoodKey } from "@/utils/phrases";

export type ForestTreeType = "oak" | "pine" | "birch" | "cherry" | "willow";

/**
 * Стадии роста дерева.
 * 0 = Росток, 1 = Молодое, 2 = Подросшее, 3 = Большое.
 * Все новые деревья создаются со стадией 0.
 * Логика роста будет реализована позже.
 */
export type GrowthStage = 0 | 1 | 2 | 3;

export interface ForestTree {
  /** Уникальный идентификатор — не изменяется после создания. */
  id: string;

  /** Настроение, с которым посажено дерево. */
  mood: MoodKey;

  /** Стадия роста (0–3). */
  growthStage: GrowthStage;

  /** ISO-строка момента создания. */
  createdAt: string;

  /** ISO-строка последнего обновления. */
  lastUpdated: string;

  /** Заметка из записи настроения (если была оставлена). */
  note?: string;

  /** Зарезервировано для будущей функции «Избранное». */
  isFavorite: boolean;

  /** Горизонтальная позиция в сцене (0..1). */
  x: number;

  /** Глубина в сцене (0 = ближе к земле, 1 = выше / дальше). */
  y: number;

  /** Вид дерева, определяется настроением. */
  treeType: ForestTreeType;
}

export interface ForestStats {
  totalTrees: number;
  mostCommonMood: MoodKey | null;
  oldestTree: ForestTree | null;
  newestTree: ForestTree | null;
}
