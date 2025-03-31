"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { themes } from "@/theme";

export type ThemeName = "retro" | "classic" | "modern";
type Mode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeName;
  mode: Mode;
  setTheme: (theme: ThemeName) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeName>(() => {
    return (localStorage.getItem("theme") as ThemeName) || "retro";
  });
  
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem("mode") as Mode) || "light";
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeName;
    const savedMode = localStorage.getItem("mode") as Mode;

    if (savedTheme) setTheme(savedTheme);
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("mode", mode);

    const currentTheme = themes[theme][mode];

    document.documentElement.style.setProperty("--color-primary", currentTheme.primary);
    document.documentElement.style.setProperty("--color-secondary", currentTheme.secondary);
    document.documentElement.style.setProperty("--color-tertiary", currentTheme.tertiary);
    document.documentElement.style.setProperty("--bg", currentTheme.background);
    document.documentElement.style.setProperty("--text", currentTheme.text);
    document.documentElement.style.setProperty("--border-radius", currentTheme.borderRadius);
    document.documentElement.style.setProperty("--font", currentTheme.font);
  }, [theme, mode]);

  const toggleMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
