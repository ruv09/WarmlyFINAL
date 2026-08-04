/** Единый список ключей AsyncStorage — исключает опечатки и дублирование строк. */
export const STORAGE_KEYS = {
  entries: "warmly:entries",
  trees: "warmly:trees",
  settings: "warmly:settings",
  favorites: "warmly:favorites",
} as const;
