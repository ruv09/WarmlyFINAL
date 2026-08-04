import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageClient } from "./StorageClient";

/** Единственный файл в проекте, который напрямую импортирует AsyncStorage. */
export class AsyncStorageClient implements StorageClient {
  async getItem<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

export const storageClient: StorageClient = new AsyncStorageClient();
