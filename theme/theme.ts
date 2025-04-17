export type ThemeName = "light" | "dark" | "coffee" | "halloween" | "aqua" | "forest" | "luxury";

interface ThemeDefinition {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  borderRadius: string;
  font: string;
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  light: {
    primary: "#6366f1",
    secondary: "#a5b4fc",
    tertiary: "#e0e7ff",
    background: "#f9fafb",
    backgroundSecondary: "#e5e7eb", // Tailwind gray-200
    text: "#111827",
    borderRadius: "1rem",
    font: "Arial, sans-serif",
  },
  dark: {
    primary: "#111827",
    secondary: "#1f2937",
    tertiary: "#374151",
    background: "#0f172a",
    backgroundSecondary: "#1e293b", // dark blue-gray
    text: "#f1f5f9",
    borderRadius: "0.5rem",
    font: "Arial, sans-serif",
  },
  coffee: {
    primary: "#6f4e37",
    secondary: "#a9746e",
    tertiary: "#c8b6a6",
    background: "#f3ede3",
    backgroundSecondary: "#d6c9b8", // muted latte tone
    text: "#3b2f2f",
    borderRadius: "0.75rem",
    font: "Georgia, serif",
  },
  halloween: {
    primary: "#ff7518",
    secondary: "#000000",
    tertiary: "#ffffff",
    background: "#1e1e1e",
    backgroundSecondary: "#2e2e2e", // slightly lighter dark
    text: "#ff7518",
    borderRadius: "1rem",
    font: "Courier New, monospace",
  },
  aqua: {
    primary: "#0f52ba",
    secondary: "#4682b4",
    tertiary: "#5dade2",
    background: "#e6f0fa",
    backgroundSecondary: "#DAE7F1", // soft cool blue
    text: "#0a192f",
    borderRadius: "1rem",
    font: "Verdana, sans-serif",
  },
  forest: {
    primary: "#009e60",
    secondary: "#4caf50",
    tertiary: "#a8d5ba",
    background: "#f4fbf6",
    backgroundSecondary: "#d2e6dc", // soft leafy green
    text: "#103c2d",
    borderRadius: "0.25rem",
    font: "Tahoma, sans-serif",
  },
  luxury: {
    primary: "#bfa980",
    secondary: "#a67c52",
    tertiary: "#000000",
    background: "#f5f5f5",
    backgroundSecondary: "#e0e0e0", // silver tone
    text: "#1a1a1a",
    borderRadius: "1rem",
    font: "Times New Roman, serif",
  },
  darkPurple: {
    primary: "#6b21a8",             // deep purple (Tailwind purple-800)
    secondary: "#9333ea",           // vivid purple (Tailwind purple-600)
    tertiary: "#c084fc",            // soft lavender (Tailwind purple-300)
    background: "#1e1b2e",          // dark purple-gray
    backgroundSecondary: "#2a223a", // slightly lighter than bg
    text: "#f3e8ff",                // soft light lavender
    borderRadius: "0.75rem",
    font: "'Segoe UI', sans-serif",
  }
};
