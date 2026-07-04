import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { type MoodEntry } from "@/utils/journey";
import { ensureDailyAiNotification } from "@/utils/notifications";
import { buildUniqueAiPhrase, type MoodKey } from "@/utils/phrases";

const STORAGE_KEY = "warmly_state_v3";
const DAILY_MOOD_ENTRY_LIMIT = 20;

export type { MoodEntry };

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
  moodHistory: MoodEntry[];
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
  }) => boolean;
  editMoodEntry: (
    id: string,
    patch: Partial<Omit<MoodEntry, "id" | "createdAt">>,
  ) => void;
  deleteMoodEntry: (id: string) => void;
  addFavorite: (quote: string) => void;
  removeFavorite: (quote: string) => void;
  getTodayEntries: () => MoodEntry[];
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastNotificationSignature = useRef("");

  const ensureDailyPhrase = () => {
    const today = getDateKey();
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

  useEffect(() => {
    if (!isLoaded) return;

    const victories = state.moodHistory.filter((entry) =>
      entry.victory?.trim(),
    ).length;
    const signature = JSON.stringify({
      notifications: state.notifications,
      aiEnabled: state.aiEnabled,
      mood: state.mood,
      morning: state.morning,
      evening: state.evening,
      date: getDateKey(),
      entries: state.moodHistory.length,
      victories,
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
      totalVictories: victories,
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

  const getTodayEntriesFromState = (entries: MoodEntry[]) => {
    const today = getDateKey();
    return entries.filter((entry) => entry.createdAt.slice(0, 10) === today);
  };

  const addMoodHistory = (entry: {
    mood: MoodKey;
    note: string;
    victory?: string;
  }): boolean => {
    if (
      getTodayEntriesFromState(state.moodHistory).length >=
      DAILY_MOOD_ENTRY_LIMIT
    ) {
      return false;
    }

    setState((prev) => ({
      ...prev,
      mood: entry.mood,
      moodNote: entry.note,
      moodNoteSubmitted: true,
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
    return true;
  };

  const editMoodEntry = (
    id: string,
    patch: Partial<Omit<MoodEntry, "id" | "createdAt">>,
  ) => {
    setState((prev) => ({
      ...prev,
      moodHistory: prev.moodHistory.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    }));
  };

  const deleteMoodEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      moodHistory: prev.moodHistory.filter((entry) => entry.id !== id),
    }));
  };

  const addFavorite = (quote: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(quote)
        ? prev.favorites
        : [...prev.favorites, quote],
    }));
  };

  const removeFavorite = (quote: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((q) => q !== quote),
    }));
  };

  const getTodayEntries = () => getTodayEntriesFromState(state.moodHistory);

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        updateField,
        addMoodHistory,
        editMoodEntry,
        deleteMoodEntry,
        addFavorite,
        removeFavorite,
        getTodayEntries,
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
