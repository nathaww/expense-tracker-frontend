"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { themes, ThemeName, getCustomTheme, ThemeDefinition } from "./theme";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  customTheme: ThemeDefinition | null;
  setCustomTheme: (theme: ThemeDefinition) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>('haftom');
  const [customTheme, setCustomTheme] = useState<ThemeDefinition | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    const savedCustomTheme = getCustomTheme();
    if (savedCustomTheme) {
      setCustomTheme(savedCustomTheme);
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const selectedTheme = theme === 'custom' ? customTheme : themes[theme as Exclude<ThemeName, 'custom'>];
    if (!selectedTheme) return;
  
    const root = document.documentElement;
    root.style.setProperty("--color-primary", selectedTheme.primary);
    root.style.setProperty("--color-secondary", selectedTheme.secondary);
    root.style.setProperty("--color-tertiary", selectedTheme.tertiary);
    root.style.setProperty("--bg", selectedTheme.background);
    root.style.setProperty("--bgSecondary", selectedTheme.backgroundSecondary);
    root.style.setProperty("--text", selectedTheme.text);
    root.style.setProperty("--border-radius", selectedTheme.borderRadius);
    root.style.setProperty("--border-color", selectedTheme.borderColor);
    root.style.setProperty("--font", selectedTheme.font);
  }, [theme, customTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customTheme, setCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
