"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { themes, ThemeName } from "./theme";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const selectedTheme = themes[theme];
    if (!selectedTheme) return;
  
    const root = document.documentElement;
    root.style.setProperty("--color-primary", selectedTheme.primary);
    root.style.setProperty("--color-secondary", selectedTheme.secondary);
    root.style.setProperty("--color-tertiary", selectedTheme.tertiary);
    root.style.setProperty("--bg", selectedTheme.background);
    root.style.setProperty("--text", selectedTheme.text);
    root.style.setProperty("--border-radius", selectedTheme.borderRadius);
    root.style.setProperty("--font", selectedTheme.font);
  }, [theme]);
  

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
