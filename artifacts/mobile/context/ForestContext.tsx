/**
 * ForestContext — Sprint 4
 *
 * Каждая запись настроения создаёт отдельное дерево (note передаётся в дерево).
 * Несколько деревьев в сутки поддерживаются без ограничений.
 * Хранение (AsyncStorage) — в следующем спринте.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useApp } from "@/context/AppContext";
import type { ForestTree } from "@/types/forest";
import type { MoodKey } from "@/utils/phrases";
import {
  plantTree as makePlantTree,
  growTree,
  deleteTree,
  updateTree,
  getTreeStatistics,
} from "@/utils/forest";
import type { ForestStats } from "@/types/forest";

// ─── Context shape ────────────────────────────────────────────────────────────

interface ForestContextType {
  trees: ForestTree[];

  /** Вручную посадить дерево (для тестов / будущих спринтов). */
  plantTree: (mood: MoodKey, note?: string) => ForestTree;

  /** Перевести дерево на следующую стадию роста. TODO: реализовать. */
  growTree: (tree: ForestTree) => void;

  /** Удалить дерево из леса. TODO: реализовать. */
  deleteTree: (id: string) => void;

  /** Обновить поля дерева. TODO: реализовать. */
  updateTree: (id: string, patch: Partial<Pick<ForestTree, "note" | "isFavorite">>) => void;

  /** Агрегированная статистика по лесу. */
  getTreeStatistics: () => ForestStats;
}

const ForestContext = createContext<ForestContextType>({
  trees: [],
  plantTree:         () => { throw new Error("ForestProvider is not mounted"); },
  growTree:          () => {},
  deleteTree:        () => {},
  updateTree:        () => {},
  getTreeStatistics: () => ({ totalTrees: 0, mostCommonMood: null, oldestTree: null, newestTree: null }),
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ForestProvider({ children }: { children: React.ReactNode }) {
  const { state, isLoaded } = useApp();
  const [trees, setTrees] = useState<ForestTree[]>([]);

  /**
   * prevLengthRef отслеживает количество уже обработанных записей настроения.
   * Инициализируется текущей длиной после загрузки, чтобы старые записи
   * не создавали деревья повторно при монтировании.
   */
  const prevLengthRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const currentLen = state.moodHistory.length;

    // Первый вызов после загрузки: устанавливаем базовую линию.
    if (prevLengthRef.current === null) {
      prevLengthRef.current = currentLen;
      return;
    }

    // Новые записи этой сессии → одно дерево на каждую запись.
    if (currentLen > prevLengthRef.current) {
      const newEntries = state.moodHistory.slice(prevLengthRef.current);
      setTrees((prev) => [
        ...prev,
        // Передаём заметку, чтобы дерево хранило свою историю.
        ...newEntries.map((entry) => makePlantTree(entry.mood, entry.note || undefined)),
      ]);
    }

    prevLengthRef.current = currentLen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, state.moodHistory.length]);

  // ─── Context methods ───────────────────────────────────────────────────────

  const plantTreeManual = useCallback((mood: MoodKey, note?: string): ForestTree => {
    const tree = makePlantTree(mood, note);
    setTrees((prev) => [...prev, tree]);
    return tree;
  }, []);

  const growTreeHandler = useCallback((tree: ForestTree) => {
    // TODO: обновить стадию роста дерева в массиве
    const grown = growTree(tree);
    setTrees((prev) => prev.map((t) => (t.id === grown.id ? grown : t)));
  }, []);

  const deleteTreeHandler = useCallback((id: string) => {
    // TODO: мягкое удаление или подтверждение
    setTrees((prev) => deleteTree(prev, id));
  }, []);

  const updateTreeHandler = useCallback(
    (id: string, patch: Partial<Pick<ForestTree, "note" | "isFavorite">>) => {
      // TODO: применить patch и обновить lastUpdated
      setTrees((prev) =>
        prev.map((t) => (t.id === id ? updateTree(t, patch) : t)),
      );
    },
    [],
  );

  const getStatsHandler = useCallback(
    (): ForestStats => getTreeStatistics(trees),
    [trees],
  );

  return (
    <ForestContext.Provider
      value={{
        trees,
        plantTree:         plantTreeManual,
        growTree:          growTreeHandler,
        deleteTree:        deleteTreeHandler,
        updateTree:        updateTreeHandler,
        getTreeStatistics: getStatsHandler,
      }}
    >
      {children}
    </ForestContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useForest(): ForestContextType {
  return useContext(ForestContext);
}
