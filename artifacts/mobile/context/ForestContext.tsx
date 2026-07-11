/**
 * ForestContext — Sprint 2
 *
 * Manages the in-memory list of forest trees.
 * Trees are NOT mixed with mood data: this context observes moodHistory
 * length changes via useEffect and plants a new tree for every new entry
 * that appears in the current session.
 *
 * Persistence (AsyncStorage) will be wired in a later sprint.
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
import { plantTree as makePlantTree } from "@/utils/forest";

// ─── Context shape ────────────────────────────────────────────────────────────

interface ForestContextType {
  trees: ForestTree[];
  /** Manually plant a tree (used for testing / future sprints). */
  plantTree: (mood: MoodKey) => ForestTree;
}

const ForestContext = createContext<ForestContextType>({
  trees: [],
  plantTree: () => {
    throw new Error("ForestProvider is not mounted");
  },
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ForestProvider({ children }: { children: React.ReactNode }) {
  const { state, isLoaded } = useApp();
  const [trees, setTrees] = useState<ForestTree[]>([]);

  /**
   * prevLengthRef tracks how many moodHistory entries we have already
   * processed. Initialised to the current length once the app state is loaded
   * so that existing entries don't retroactively fill the forest on mount.
   */
  const prevLengthRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const currentLen = state.moodHistory.length;

    // First time after state loads: set baseline, do not plant old entries.
    if (prevLengthRef.current === null) {
      prevLengthRef.current = currentLen;
      return;
    }

    // New entries added in this session → plant one tree each.
    if (currentLen > prevLengthRef.current) {
      const newEntries = state.moodHistory.slice(prevLengthRef.current);
      setTrees((prev) => [
        ...prev,
        ...newEntries.map((entry) => makePlantTree(entry.mood)),
      ]);
    }

    prevLengthRef.current = currentLen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, state.moodHistory.length]);

  const plantTreeManual = useCallback((mood: MoodKey): ForestTree => {
    const tree = makePlantTree(mood);
    setTrees((prev) => [...prev, tree]);
    return tree;
  }, []);

  return (
    <ForestContext.Provider value={{ trees, plantTree: plantTreeManual }}>
      {children}
    </ForestContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useForest(): ForestContextType {
  return useContext(ForestContext);
}
