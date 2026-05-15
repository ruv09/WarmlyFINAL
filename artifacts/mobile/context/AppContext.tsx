import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import type { MoodKey } from "@/utils/phrases";

const STORAGE_KEY = "warmly_state_v3";

export interface AppState {
  name: string;
  mood: MoodKey | null;
  moodNote: string;
  moodNoteSubmitted: boolean;
  favorites: string[];
  notifications: boolean;
  morning: string;
  evening: string;
  aiEnabled: boolean;
  note: string;
}

const DEFAULT_STATE: AppState = {
  name: "Настасья",
  mood: null,
  moodNote: "",
  moodNoteSubmitted: false,
  favorites: [],
  notifications: true,
  morning: "08:00",
  evening: "22:00",
  aiEnabled: false,
  note: "",
};

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateField: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
  addFavorite: (quote: string) => void;
  removeFavorite: (quote: string) => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const updateField = <K extends keyof AppState>(key: K, value: AppState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const addFavorite = (quote: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(quote) ? prev.favorites : [...prev.favorites, quote],
    }));
  };

  const removeFavorite = (quote: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((q) => q !== quote),
    }));
  };

  return (
    <AppContext.Provider value={{ state, setState, updateField, addFavorite, removeFavorite, isLoaded }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
