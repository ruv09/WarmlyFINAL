import { create } from "zustand";
import { Settings } from "../types";
import { settingsRepository, syncNotifications, DEFAULT_SETTINGS } from "../services";
import { DAILY_PHRASES, buildUniqueAiPhrase, toDateKey } from "../utils";

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  isHydrated: boolean;
  load: () => Promise<void>;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
  ensureDailyPhrase: () => Promise<void>;
  completeOnboarding: (name: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  isHydrated: false,

  load: async () => {
    set({ isLoading: true });
    let settings = await settingsRepository.get();
    if (!settings.joinedAt && settings.isOnboarded) {
      settings = { ...settings, joinedAt: toDateKey() };
      await settingsRepository.save(settings);
    }
    set({ settings, isLoading: false, isHydrated: true });
    // Восстанавливаем запланированные уведомления после холодного старта.
    await syncNotifications(settings.notifications).catch(() => undefined);
    await get().ensureDailyPhrase();
  },

  updateSettings: async (partial) => {
    const next: Settings = { ...get().settings, ...partial };
    set({ settings: next });
    await settingsRepository.save(next);
    if (partial.notifications || partial.supportivePhrasesEnabled !== undefined) {
      await syncNotifications(next.notifications);
    }
    if (partial.supportivePhrasesEnabled === true) {
      await get().ensureDailyPhrase();
    }
  },

  ensureDailyPhrase: async () => {
    const prev = get().settings;
    if (!prev.supportivePhrasesEnabled) return;

    const today = toDateKey();
    const phraseStillValid =
      prev.dailyPhraseDate === today &&
      Boolean(prev.dailyPhrase) &&
      DAILY_PHRASES.includes(prev.dailyPhrase);
    if (phraseStillValid) return;

    const phrase = buildUniqueAiPhrase(prev.recentPhrases);
    const next: Settings = {
      ...prev,
      dailyPhrase: phrase,
      dailyPhraseDate: today,
      recentPhrases: [...prev.recentPhrases.slice(-49), phrase],
    };
    set({ settings: next });
    await settingsRepository.save(next);
  },

  completeOnboarding: async (name) => {
    await get().updateSettings({
      name: name.trim() || "Друг",
      isOnboarded: true,
      joinedAt: get().settings.joinedAt || toDateKey(),
    });
  },
}));
