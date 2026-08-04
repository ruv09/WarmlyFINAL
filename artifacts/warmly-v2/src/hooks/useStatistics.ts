import { useMemo } from "react";
import { useEntries } from "./useEntries";
import { useForest } from "./useForest";
import { calculateEntryStatistics } from "../utils/statistics";

export function useStatistics() {
  const { entries } = useEntries();
  const { total } = useForest();

  const entryStats = useMemo(() => calculateEntryStatistics(entries), [entries]);

  return { ...entryStats, treesGrown: total };
}
