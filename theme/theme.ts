export type ThemeName =
  | "haftom"
  | "dark"
  | "coffee"
  | "halloween"
  | "aqua"
  | "forest"
  | "luxury"
  | "purple"
  | "light"
  | "crimson"
  | "deepBlue"
  | "christmas"
  | "custom"
  | "brain";

export interface ThemeDefinition {
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

// Custom theme storage
export const saveCustomTheme = (theme: ThemeDefinition) => {
  localStorage.setItem("customTheme", JSON.stringify(theme));
};

export const getCustomTheme = (): ThemeDefinition | null => {
  const saved = localStorage.getItem("customTheme");
  return saved ? JSON.parse(saved) : null;
};

export const themes: Record<Exclude<ThemeName, "custom">, ThemeDefinition> = {
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
    primary: "#000000",
    secondary: "#0a0a0a",
    tertiary: "#1a1a1a",
    background: "#000000",
    backgroundSecondary: "#0d0d0d",
    text: "#e5e5e5",
    borderColor: "#2e2e2e",
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
    secondary: "#7DA16B",
    tertiary: "#c084fc",
    background: "#161D16",
    backgroundSecondary: "#1A231A",
    text: "#f2f2f2",
    borderColor: "#2B3B2B",
    borderRadius: "0.5rem",
    font: "'Segoe UI', sans-serif",
  },
  crimson: {
    primary: "#AD2021",
    secondary: "#8B0000",
    tertiary: "#FA8072",
    background: "#1A0B0B",
    backgroundSecondary: "#2E1111",
    text: "#FFE4E1",
    borderColor: "#462424",
    borderRadius: "0.5rem",
    font: "'Segoe UI', sans-serif",
  },
  christmas: {
    primary: "#008000",
    secondary: "#FF0000",
    tertiary: "#FFD700",
    background: "#0F1A0F",
    backgroundSecondary: "#1F2F1F",
    text: "#FFFFFF",
    borderColor: "#A9BFA9",
    borderRadius: "0.5rem",
    font: "'Segoe UI', sans-serif",
  },
  deepBlue: {
    primary: "#0D47A1",
    secondary: "#1565C0",
    tertiary: "#42A5F5",
    background: "#0A0F1A",
    backgroundSecondary: "#121B2A",
    text: "#E3F2FD",
    borderColor: "#5C6F91",
    borderRadius: "0.5rem",
    font: "'Segoe UI', sans-serif",
  },
  brain: {
    primary: "#4E94DB",       
    secondary: "#FFD18B",           
    tertiary: "#E1EDFE",            
    background: "#F6F9FF",          
    backgroundSecondary: "#FFFFFF", 
    text: "#1A1A1A",                
    borderColor: "",        
    borderRadius: "1.5rem",
    font: "Inter, sans-serif",
  },
};
