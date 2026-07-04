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
import { type MoodHistoryEntry } from "@/utils/journey";
import { buildUniqueAiPhrase, type MoodKey } from "@/utils/phrases";

const STORAGE_KEY = "warmly_state_v3";
 codex/continue-the-discussion-k4xcgp
const DAILY_MOOD_ENTRY_LIMIT = 20;

export type { MoodEntry };

const MAX_ENTRIES_PER_DAY = 20;

export interface MoodEntry {
  id: string;
  mood: MoodKey;
  note: string;
  createdAt: string;
}
 main

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
 codex/continue-the-discussion-k4xcgp
  moodHistory: MoodEntry[];

codex/continue-the-discussion-dymt18
  moodHistory: MoodHistoryEntry[];

  moodHistory: MoodEntry[];
 main
 main
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
 codex/continue-the-discussion-k4xcgp

 codex/continue-the-discussion-dymt18
 main
  addMoodHistory: (entry: {
    mood: MoodKey;
    note: string;
    victory?: string;
 codex/continue-the-discussion-k4xcgp
  }) => boolean;
  editMoodEntry: (
    id: string,
    patch: Partial<Omit<MoodEntry, "id" | "createdAt">>,
  ) => void;
  deleteMoodEntry: (id: string) => void;

  }) => void;

  addMoodHistory: (entry: { mood: MoodKey; note: string }) => boolean;
  editMoodEntry: (id: string, mood: MoodKey, note: string) => void;
  deleteMoodEntry: (id: string) => void;
 main
 main
  addFavorite: (quote: string) => void;
  removeFavorite: (quote: string) => void;
  getTodayEntries: () => MoodEntry[];
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

 codex/continue-the-discussion-k4xcgp
function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
 main
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastNotificationSignature = useRef("");

  const ensureDailyPhrase = () => {
 codex/continue-the-discussion-k4xcgp
    const today = getDateKey();

    const today = getTodayStr();
 main
    setState((prev) => {
      if (!prev.aiEnabled) return prev;
      if (prev.dailyAiPhraseDate === today && prev.dailyAiPhrase) return prev;
      const phrase = buildUniqueAiPhrase(prev.recentAiPhrases);
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

 codex/continue-the-discussion-k4xcgp
  useEffect(() => {
    if (!isLoaded) return;

    const victories = state.moodHistory.filter((entry) =>
      entry.victory?.trim(),
    ).length;

 codex/continue-the-discussion-dymt18
  // Keep the rolling local notification plan in sync with user settings.
  // We intentionally run this only after state is hydrated from storage so
  // native schedules are replaced without duplicates.
 main
  useEffect(() => {
    if (!isLoaded) return;

    const today = getTodayStr();
    const hasTodayEntry = state.moodHistory.some(
      (e) => e.createdAt.slice(0, 10) === today,
    );

 main
    const signature = JSON.stringify({
      notifications: state.notifications,
      aiEnabled: state.aiEnabled,
 codex/continue-the-discussion-dymt18
      mood: state.mood,
      morning: state.morning,
      evening: state.evening,
 codex/continue-the-discussion-k4xcgp
      date: getDateKey(),
      entries: state.moodHistory.length,
      victories,

      date: new Date().toISOString().slice(0, 10),
      entries: state.moodHistory.length,
      victories: state.moodHistory.filter((entry) => entry.victory?.trim())
        .length,

      morning: state.morning,
      evening: state.evening,
      hasTodayEntry,
      date: today,
 main
 main
    });

    if (signature === lastNotificationSignature.current) return;
    lastNotificationSignature.current = signature;

    ensureDailyAiNotification({
      enabled: state.notifications,
      aiEnabled: state.aiEnabled,
      preferredHour: state.morning,
      preferredEvening: state.evening,
      recentPhrases: state.recentAiPhrases,
 codex/continue-the-discussion-k4xcgp
      totalEntries: state.moodHistory.length,
      totalVictories: victories,

 codex/continue-the-discussion-dymt18
      totalEntries: state.moodHistory.length,
      totalVictories: state.moodHistory.filter((entry) => entry.victory?.trim())
        .length,

      hasTodayMoodEntry: hasTodayEntry,
main
 main
    }).catch(() => {});
  }, [
    isLoaded,
    state.notifications,
    state.aiEnabled,
 codex/continue-the-discussion-k4xcgp
    state.mood,

 codex/continue-the-discussion-dymt18
    state.mood,
 main
 main
    state.morning,
    state.evening,
    state.recentAiPhrases,
    state.moodHistory,
  ]);

  useEffect(() => {
    if (!isLoaded) return;
    ensureDailyPhrase();
  }, [isLoaded, state.aiEnabled]);

  const updateField = <K extends keyof AppState>(
    key: K,
    value: AppState[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

 codex/continue-the-discussion-k4xcgp
  const getTodayEntriesFromState = (entries: MoodEntry[]) => {
    const today = getDateKey();
    return entries.filter((entry) => entry.createdAt.slice(0, 10) === today);
  };


  const addFavorite = (quote: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(quote)
        ? prev.favorites
        : [...prev.favorites, quote],
    }));
  };

 codex/continue-the-discussion-dymt18
 main
  const addMoodHistory = (entry: {
    mood: MoodKey;
    note: string;
    victory?: string;
 codex/continue-the-discussion-k4xcgp
  }): boolean => {
    if (
      getTodayEntriesFromState(state.moodHistory).length >=
      DAILY_MOOD_ENTRY_LIMIT
    ) {
      return false;
    }


  }) => {
 main
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

  const addMoodHistory = (entry: { mood: MoodKey; note: string }): boolean => {
    const today = getTodayStr();
    let added = false;
    setState((prev) => {
      const todayCount = prev.moodHistory.filter(
        (e) => e.createdAt.slice(0, 10) === today,
      ).length;
      if (todayCount >= MAX_ENTRIES_PER_DAY) return prev;
      added = true;
      return {
        ...prev,
        mood: entry.mood,
        moodNoteSubmitted: true,
        moodHistory: [
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            mood: entry.mood,
            note: entry.note,
            createdAt: new Date().toISOString(),
          },
          ...prev.moodHistory,
        ],
      };
    });
    return added;
  };

  const editMoodEntry = (id: string, mood: MoodKey, note: string) => {
    setState((prev) => ({
      ...prev,
      moodHistory: prev.moodHistory.map((e) =>
        e.id === id ? { ...e, mood, note } : e,
      ),
 main
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

  const deleteMoodEntry = (id: string) => {
    setState((prev) => {
      const updated = prev.moodHistory.filter((e) => e.id !== id);
      const today = getTodayStr();
      const todayEntries = updated.filter((e) => e.createdAt.slice(0, 10) === today);
      const hasTodayEntry = todayEntries.length > 0;
      return {
        ...prev,
        moodHistory: updated,
        moodNoteSubmitted: hasTodayEntry,
        mood: hasTodayEntry ? todayEntries[0]!.mood : prev.mood,
      };
    });
  };

  const removeFavorite = (quote: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((q) => q !== quote),
    }));
  };

 codex/continue-the-discussion-k4xcgp
  const getTodayEntries = () => getTodayEntriesFromState(state.moodHistory);

  const getTodayEntries = (): MoodEntry[] => {
    const today = getTodayStr();
    return state.moodHistory
      .filter((e) => e.createdAt.slice(0, 10) === today)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };
 main

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        updateField,
        addMoodHistory,
 codex/continue-the-discussion-k4xcgp

 codex/continue-the-discussion-dymt18
        addFavorite,
        removeFavorite,

 main
        editMoodEntry,
        deleteMoodEntry,
        addFavorite,
        removeFavorite,
        getTodayEntries,
 codex/continue-the-discussion-k4xcgp

main
 main
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
