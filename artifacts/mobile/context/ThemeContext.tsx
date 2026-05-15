import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type AppTheme = "light" | "dark" | "system";

const THEME_KEY = "warmly_theme";

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "system", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("system");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((v) => { if (v === "light" || v === "dark" || v === "system") setThemeState(v); })
      .catch(() => {});
  }, []);

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    AsyncStorage.setItem(THEME_KEY, t).catch(() => {});
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
