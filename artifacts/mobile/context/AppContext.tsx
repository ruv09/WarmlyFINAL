import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { ensureDailyAiNotification } from "@/utils/notifications";
import { type MoodHistoryEntry } from "@/utils/journey";
import { buildUniqueAiPhrase, type MoodKey } from "@/utils/phrases";

const STORAGE_KEY = "warmly_state_v3";

export interface AppState {
  name: string;
  isOnboarded: boolean;
  mood: MoodKey | null;
  moodNote: string;
  moodNoteSubmitted: boolean;
  favorites: string[];
  notifications: boolean;
  morning: string;
  evening: string;
  aiEnabled: boolean;
  note: string;
  dailyAiPhrase: string;
  dailyAiPhraseDate: string;
  recentAiPhrases: string[];
  moodHistory: MoodHistoryEntry[];
}

const DEFAULT_STATE: AppState = {
  name: "",
  isOnboarded: false,
  mood: null,
  moodNote: "",
  moodNoteSubmitted: false,
  favorites: [],
  notifications: true,
  morning: "08:00",
  evening: "22:00",
  aiEnabled: false,
  note: "",
  dailyAiPhrase: "",
  dailyAiPhraseDate: "",
  recentAiPhrases: [],
  moodHistory: [],
};

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateField: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
  addMoodHistory: (entry: {
    mood: MoodKey;
    note: string;
    victory?: string;
  }) => void;
  addFavorite: (quote: string) => void;
  removeFavorite: (quote: string) => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastNotificationSignature = useRef("");

  const ensureDailyPhrase = () => {
    const today = new Date().toISOString().slice(0, 10);
    setState((prev) => {
      if (!prev.aiEnabled) return prev;
      if (prev.dailyAiPhraseDate === today && prev.dailyAiPhrase) return prev;
      const phrase = buildUniqueAiPhrase(prev.mood, prev.recentAiPhrases);
      return {
        ...prev,
        dailyAiPhrase: phrase,
        dailyAiPhraseDate: today,
        recentAiPhrases: [...prev.recentAiPhrases.slice(-49), phrase],
      };
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setState({ ...DEFAULT_STATE, ...parsed });
        }
      } catch {
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, isLoaded]);

  // Keep the rolling local notification plan in sync with user settings.
  // We intentionally run this only after state is hydrated from storage so
  // native schedules are replaced without duplicates.
  useEffect(() => {
    if (!isLoaded) return;

    const signature = JSON.stringify({
      notifications: state.notifications,
      aiEnabled: state.aiEnabled,
      mood: state.mood,
      morning: state.morning,
      evening: state.evening,
      date: new Date().toISOString().slice(0, 10),
      entries: state.moodHistory.length,
      victories: state.moodHistory.filter((entry) => entry.victory?.trim())
        .length,
    });

    if (signature === lastNotificationSignature.current) return;
    lastNotificationSignature.current = signature;

    ensureDailyAiNotification({
      enabled: state.notifications,
      aiEnabled: state.aiEnabled,
      mood: state.mood,
      preferredHour: state.morning,
      preferredEvening: state.evening,
      recentPhrases: state.recentAiPhrases,
      totalEntries: state.moodHistory.length,
      totalVictories: state.moodHistory.filter((entry) => entry.victory?.trim())
        .length,
    }).catch(() => {});
  }, [
    isLoaded,
    state.notifications,
    state.aiEnabled,
    state.mood,
    state.morning,
    state.evening,
    state.recentAiPhrases,
    state.moodHistory,
  ]);

  useEffect(() => {
    if (!isLoaded) return;
    ensureDailyPhrase();
  }, [isLoaded, state.aiEnabled, state.mood]);

  const updateField = <K extends keyof AppState>(
    key: K,
    value: AppState[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const addFavorite = (quote: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(quote)
        ? prev.favorites
        : [...prev.favorites, quote],
    }));
  };

  const addMoodHistory = (entry: {
    mood: MoodKey;
    note: string;
    victory?: string;
  }) => {
    setState((prev) => ({
      ...prev,
      moodHistory: [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          mood: entry.mood,
          note: entry.note,
          victory: entry.victory,
          createdAt: new Date().toISOString(),
        },
        ...prev.moodHistory,
      ],
    }));
  };

  const removeFavorite = (quote: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((q) => q !== quote),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        updateField,
        addMoodHistory,
        addFavorite,
        removeFavorite,
        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
