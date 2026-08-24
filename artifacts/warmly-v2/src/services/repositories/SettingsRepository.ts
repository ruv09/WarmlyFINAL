import { Settings } from "../../types";
import { StorageClient } from "../storage/StorageClient";
import { STORAGE_KEYS } from "../../constants/storageKeys";

export const DEFAULT_SETTINGS: Settings = {
  theme: "auto",
  notifications: {
    enabled: false,
    morningEnabled: true,
    eveningEnabled: true,
    morningTime: "09:00",
    eveningTime: "21:00",
  },
  name: "",
  isOnboarded: false,
  joinedAt: "",
  avatarId: "fox",
  supportivePhrasesEnabled: true,
  dailyPhrase: "",
  dailyPhraseDate: "",
  recentPhrases: [],
};

/**
 * Настройки хранятся как единый объект. При чтении мержим с DEFAULT_SETTINGS,
 * чтобы старые сохранённые объекты без новых полей продолжали работать.
 */
export class SettingsRepository {
  constructor(private readonly storage: StorageClient) {}

  async get(): Promise<Settings> {
    const stored = await this.storage.getItem<Partial<Settings>>(STORAGE_KEYS.settings);
    if (!stored) return { ...DEFAULT_SETTINGS };
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...(stored.notifications ?? {}),
      },
      recentPhrases: Array.isArray(stored.recentPhrases) ? stored.recentPhrases : [],
      joinedAt: stored.joinedAt || stored.dailyPhraseDate || DEFAULT_SETTINGS.joinedAt,
    };
  }

  async save(settings: Settings): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.settings, settings);
  }
}
