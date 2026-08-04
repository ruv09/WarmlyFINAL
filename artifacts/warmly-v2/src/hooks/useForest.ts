import { useEffect } from "react";
import { useForestStore } from "../store";

export function useForest() {
  const { trees, isLoading, load } = useForestStore();

  useEffect(() => {
    load();
  }, [load]);

  return { trees, total: trees.length, isLoading, refresh: load };
}
