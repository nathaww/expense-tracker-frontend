export type ThemeName =
  | "modern"
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
  | "sunset"
  | "midnight";


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
  modern: {
    primary: "#00B9FF",     // Wise brand blue - clear, trustworthy
    secondary: "#37517E",   // Deep blue for stability
    tertiary: "#9FE870",    // Wise accent green for success states
    background: "#FFFFFF",   // Clean white for readability
    backgroundSecondary: "#F9FAFB", // Subtle distinction for hierarchy
    text: "#2D4B6B",        // Accessible, professional text color
    borderColor: "#E5E9F0",  // Subtle borders for structure
    borderRadius: "0.75rem", // Modern, friendly corners
    font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
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
    primary: "#7F7F7F",
    secondary: "#0a0a0a",
    tertiary: "#1a1a1a",
    background: "#000000",
    backgroundSecondary: "#0d0d0d",
    text: "#e5e5e5",
    borderColor: "#2e2e2e",
    borderRadius: "1rem",
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
    borderRadius: "1.2rem",
    font: "'Segoe UI', sans-serif",
  },
  sunset: {
    primary: "#FF6B35",              // Fiery orange (main call-to-action color)
    secondary: "#FFB627",            // Warm golden tone for highlights/badges
    tertiary: "#FF8966",             // Soft coral/orange-pink blend
    background: "#2B1B1A",           // Deep reddish-brown (evening sky)
    backgroundSecondary: "#3A2B28",  // Slightly lighter for surfaces/cards
    text: "#FFF4E6",                 // Warm creamy white for contrast
    borderColor: "#A45A44",          // Sunset brown-orange for borders
    borderRadius: "0.75rem",         // Soft and cozy curves
    font: "'Segoe UI', sans-serif",  // Clean and readable, fits all modern use
  },
  midnight: {
    primary: "#0A0F29",               // Almost-black navy
    secondary: "#1E3A8A",             // Deep indigo blue
    tertiary: "#4B5563",              // Muted slate for accents
    background: "#060B1A",            // Rich midnight black-blue
    backgroundSecondary: "#101524",   // Slightly lighter navy surface
    text: "#E5E7EB",                  // Cool light gray
    borderColor: "#2D3748",           // Soft neutral border
    borderRadius: "0.5rem",
    font: "'Segoe UI', sans-serif",
  },
}