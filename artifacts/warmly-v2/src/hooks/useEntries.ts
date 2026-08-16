import { useEffect, useMemo } from "react";
import { useEntriesStore } from "../store";
import { toDateKey } from "../utils";

/**
 * Экраны используют этот хук, а не useEntriesStore напрямую.
 * Если завтра появится, например, пагинация или дебаунс автозагрузки —
 * меняется этот файл, а не каждый экран, который показывает записи.
 */
export function useEntries() {
  const { entries, isLoading, load, createEntry, updateEntry, deleteEntry } = useEntriesStore();

  useEffect(() => {
    load();
  }, [load]);

  const todayEntries = useMemo(() => {
    const todayKey = toDateKey();
    return entries.filter((entry) => entry.date === todayKey);
  }, [entries]);

  return { entries, isLoading, todayEntries, createEntry, updateEntry, deleteEntry, refresh: load };
}

export function useEntry(id: string | undefined) {
  const entries = useEntriesStore((state) => state.entries);
  return useMemo(() => entries.find((entry) => entry.id === id), [entries, id]);
}
