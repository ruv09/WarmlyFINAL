import { StorageClient } from "../storage/StorageClient";
import { STORAGE_KEYS } from "../../constants/storageKeys";

/**
 * Избранные поддерживающие фразы — сильная сторона Warmly v1,
 * перенесённая в слой repositories v2.
 */
export class FavoritesRepository {
  constructor(private readonly storage: StorageClient) {}

  async getAll(): Promise<string[]> {
    return (await this.storage.getItem<string[]>(STORAGE_KEYS.favorites)) ?? [];
  }

  async saveAll(favorites: string[]): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.favorites, favorites);
  }

  async add(quote: string): Promise<string[]> {
    const favorites = await this.getAll();
    if (favorites.includes(quote)) return favorites;
    const next = [...favorites, quote];
    await this.saveAll(next);
    return next;
  }

  async remove(quote: string): Promise<string[]> {
    const next = (await this.getAll()).filter((item) => item !== quote);
    await this.saveAll(next);
    return next;
  }
}
