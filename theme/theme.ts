export type ThemeName = "light" | "dark" | "coffee" | "halloween" | "aqua" | "forest" | "luxury" | "purple" | "haftom";

interface ThemeDefinition {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  borderColor: string;
  borderRadius: string;
  font: string;
}
export const themes: Record<ThemeName, ThemeDefinition> = {
  light: {
    primary: "#6366f1",
    secondary: "#a5b4fc",
    tertiary: "#e0e7ff",
    background: "#f9fafb",
    backgroundSecondary: "#e5e7eb",
    text: "#111827",
    borderColor: "#cbd5e1",
    borderRadius: "0.5rem",
    font: "Arial, sans-serif",
  },
  dark: {
    primary: "#111827",
    secondary: "#1f2937",
    tertiary: "#374151",
    background: "#0f172a",
    backgroundSecondary: "#1e293b",
    text: "#f1f5f9",
    borderColor: "#334155",
    borderRadius: "0.5rem",
    font: "Arial, sans-serif",
  },
  coffee: {
    primary: "#6f4e37",
    secondary: "#a9746e",
    tertiary: "#c8b6a6",
    background: "#f3ede3",
    backgroundSecondary: "#d6c9b8",
    text: "#3b2f2f",
    borderColor: "#a58f87",
    borderRadius: "0.75rem",
    font: "Georgia, serif",
  },
  halloween: {
    primary: "#ff7518",
    secondary: "#000000",
    tertiary: "#ffffff",
    background: "#1e1e1e",
    backgroundSecondary: "#2e2e2e",
    text: "#ff7518",
    borderColor: "#ffae6f",
    borderRadius: "1rem",
    font: "Courier New, monospace",
  },
  aqua: {
    primary: "#0f52ba",
    secondary: "#4682b4",
    tertiary: "#5dade2",
    background: "#e6f0fa",
    backgroundSecondary: "#c8dceb",
    text: "#0a192f",
    borderColor: "#b1c9da",
    borderRadius: "0.25rem",
    font: "Verdana, sans-serif",
  },
  forest: {
    primary: "#009e60",
    secondary: "#4caf50",
    tertiary: "#a8d5ba",
    background: "#f4fbf6",
    backgroundSecondary: "#d2e6dc",
    text: "#103c2d",
    borderColor: "#a7cbbf",
    borderRadius: "0.25rem",
    font: "Tahoma, sans-serif",
  },
  luxury: {
    primary: "#bfa980",
    secondary: "#a67c52",
    tertiary: "#000000",
    background: "#f5f5f5",
    backgroundSecondary: "#e0e0e0",
    text: "#1a1a1a",
    borderColor: "#b3b3b3",
    borderRadius: "1rem",
    font: "Times New Roman, serif",
  },
  purple: {
    primary: "#6b21a8",
    secondary: "#9333ea",
    tertiary: "#c084fc",
    background: "#1e1b2e",
    backgroundSecondary: "#2a223a",
    text: "#f3e8ff",
    borderColor: "#a78bfa",
    borderRadius: "0.75rem",
    font: "'Segoe UI', sans-serif",
  },
  haftom: {
    primary: "#A4D28D",
    secondary: "#BCF2A1",
    tertiary: "#c084fc",
    background: "#161D16",
    backgroundSecondary: "#1A231A",
    text: "#f2f2f2",
    borderColor: "#2B3B2B",
    borderRadius: "0.5rem",
    font: "'Segoe UI', sans-serif",
  },
};
