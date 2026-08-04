import { create } from "zustand";
import { Tree } from "../types";
import { treeRepository } from "../services";

interface ForestState {
  trees: Tree[];
  isLoading: boolean;
  load: () => Promise<void>;
}

/**
 * Дерево не растёт после создания — здесь больше нет пересчёта
 * стадии при загрузке (см. /FOREST.md). Стор просто отражает то,
 * что хранится в репозитории.
 *
 * Важно: после createEntry/deleteEntry вызывается load() из
 * useEntriesStore, иначе UI леса остаётся на stale-снимке до
 * перезапуска приложения.
 */
export const useForestStore = create<ForestState>((set) => ({
  trees: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const trees = await treeRepository.getAll();
    set({ trees, isLoading: false });
  },
}));
