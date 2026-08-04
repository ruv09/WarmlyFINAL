import { Tree } from "../../types";
import { StorageClient } from "../storage/StorageClient";
import { STORAGE_KEYS } from "../../constants/storageKeys";

/**
 * Дерево неизменяемо после создания (см. /FOREST.md — отказ от
 * механики роста): репозиторию не нужен метод массового обновления,
 * только добавление и удаление.
 */
export class TreeRepository {
  constructor(private readonly storage: StorageClient) {}

  async getAll(): Promise<Tree[]> {
    return (await this.storage.getItem<Tree[]>(STORAGE_KEYS.trees)) ?? [];
  }

  async saveAll(trees: Tree[]): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.trees, trees);
  }

  async add(tree: Tree): Promise<void> {
    const trees = await this.getAll();
    trees.push(tree);
    await this.saveAll(trees);
  }

  async remove(id: string): Promise<void> {
    const trees = await this.getAll();
    await this.saveAll(trees.filter((t) => t.id !== id));
  }
}
