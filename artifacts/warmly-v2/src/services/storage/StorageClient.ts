/**
 * Абстракция над хранилищем. Всё остальное приложение работает
 * только через этот интерфейс. Когда появится облачная синхронизация,
 * достаточно будет добавить новую реализацию (например, CloudStorageClient)
 * и подменить её в services/index.ts — ни store, ни hooks, ни UI не изменятся.
 */
export interface StorageClient {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}
