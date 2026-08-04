import { useEffect } from "react";
import { useSettingsStore } from "../store";

export function useSettings() {
  const { settings, isLoading, load, updateSettings } = useSettingsStore();

  useEffect(() => {
    load();
  }, [load]);

  return { settings, isLoading, updateSettings };
}
