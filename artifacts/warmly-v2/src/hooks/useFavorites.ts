import { useEffect } from "react";
import { useFavoritesStore } from "../store";

export function useFavorites() {
  const { favorites, isLoading, load, addFavorite, removeFavorite } = useFavoritesStore();

  useEffect(() => {
    load();
  }, [load]);

  return { favorites, isLoading, addFavorite, removeFavorite, refresh: load };
}
