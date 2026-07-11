import type { MoodKey } from "@/utils/phrases";

export type ForestTreeType = "oak" | "pine" | "birch" | "cherry" | "willow";

export interface ForestTree {
  id: string;
  mood: MoodKey;
  createdAt: string;
  x: number;
  y: number;
  type: ForestTreeType;
}

export interface ForestStats {
  totalTrees: number;
  mostCommonMood: MoodKey | null;
  oldestTree: ForestTree | null;
  newestTree: ForestTree | null;
}
