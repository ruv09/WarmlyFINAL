import { create } from "zustand";
import { favoritesRepository } from "../services";

interface FavoritesState {
  favorites: string[];
  isLoading: boolean;
  load: () => Promise<void>;
  addFavorite: (quote: string) => Promise<void>;
  removeFavorite: (quote: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const favorites = await favoritesRepository.getAll();
    set({ favorites, isLoading: false });
  },

  addFavorite: async (quote) => {
    const favorites = await favoritesRepository.add(quote);
    set({ favorites });
  },

  removeFavorite: async (quote) => {
    const favorites = await favoritesRepository.remove(quote);
    set({ favorites });
  },
}));
