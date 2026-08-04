/**
 * Композиционный корень слоя данных. store импортирует репозитории
 * только отсюда. Подмена AsyncStorageClient на облачную реализацию
 * требует правки только в этом файле — см. /DATA_LAYER.md.
 */
import { storageClient } from "./storage/AsyncStorageClient";
import {
  EntryRepository,
  TreeRepository,
  SettingsRepository,
  FavoritesRepository,
} from "./repositories";

export const entryRepository = new EntryRepository(storageClient);
export const treeRepository = new TreeRepository(storageClient);
export const settingsRepository = new SettingsRepository(storageClient);
export const favoritesRepository = new FavoritesRepository(storageClient);

export * from "./forest";
export * from "./notificationService";
export * from "./exportService";
export { DEFAULT_SETTINGS } from "./repositories";
