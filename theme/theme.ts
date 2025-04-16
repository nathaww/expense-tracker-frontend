export type ThemeName = "light" | "dark" | "coffee" | "halloween" | "aqua" | "forest" | "luxury";

interface ThemeDefinition {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  text: string;
  borderRadius: string;
  font: string;
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  light: {
    primary: "#3b82f6",
    secondary: "#60a5fa",
    tertiary: "#93c5fd",
    background: "#ffffff",
    text: "#1f2937",
    borderRadius: "0.5rem",
    font: "Arial, sans-serif",
  },
  dark: {
    primary: "#111827",
    secondary: "#1f2937",
    tertiary: "#374151",
    background: "#0f172a",
    text: "#f1f5f9",
    borderRadius: "0.5rem",
    font: "Arial, sans-serif",
  },
  coffee: {
    primary: "#6f4e37",
    secondary: "#a9746e",
    tertiary: "#c8b6a6",
    background: "#f3ede3",
    text: "#3b2f2f",
    borderRadius: "0.75rem",
    font: "Georgia, serif",
  },
  halloween: {
    primary: "#ff7518",
    secondary: "#000000",
    tertiary: "#ffffff",
    background: "#1e1e1e",
    text: "#ff7518",
    borderRadius: "1rem",
    font: "Courier New, monospace",
  },
  aqua: {
    primary: "#00ffff",
    secondary: "#7fffd4",
    tertiary: "#40e0d0",
    background: "#e0ffff",
    text: "#004f4f",
    borderRadius: "0.25rem",
    font: "Verdana, sans-serif",
  },
  forest: {
    primary: "#228b22",
    secondary: "#6b8e23",
    tertiary: "#8fbc8f",
    background: "#f0fff0",
    text: "#013220",
    borderRadius: "0.25rem",
    font: "Tahoma, sans-serif",
  },
  luxury: {
    primary: "#bfa980",
    secondary: "#a67c52",
    tertiary: "#000000",
    background: "#f5f5f5",
    text: "#1a1a1a",
    borderRadius: "1rem",
    font: "Times New Roman, serif",
  },
};
