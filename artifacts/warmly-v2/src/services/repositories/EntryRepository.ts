import { Entry } from "../../types";
import { StorageClient } from "../storage/StorageClient";
import { STORAGE_KEYS } from "../../constants/storageKeys";

/**
 * Repository — единственный слой, которому разрешено читать/писать
 * записи дневника. Не содержит бизнес-логики (валидация настроения,
 * связь "запись -> дерево") — это ответственность store
 * (src/store/useEntriesStore.ts). Repository знает только "как
 * достать/сохранить данные", ничего не знает про то, зачем.
 *
 * UI (components, screens) никогда не импортирует этот класс напрямую —
 * только через store -> hooks. См. /DATA_LAYER.md.
 */
export class EntryRepository {
  constructor(private readonly storage: StorageClient) {}

  async getAll(): Promise<Entry[]> {
    return (await this.storage.getItem<Entry[]>(STORAGE_KEYS.entries)) ?? [];
  }

  async saveAll(entries: Entry[]): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.entries, entries);
  }

  async add(entry: Entry): Promise<void> {
    const entries = await this.getAll();
    entries.push(entry);
    await this.saveAll(entries);
  }

  async update(id: string, updater: (entry: Entry) => Entry): Promise<Entry | undefined> {
    const entries = await this.getAll();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) return undefined;
    const updated = updater(entries[index]);
    entries[index] = updated;
    await this.saveAll(entries);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const entries = await this.getAll();
    await this.saveAll(entries.filter((e) => e.id !== id));
  }
}
