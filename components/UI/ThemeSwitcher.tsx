"use client";
import { themes } from "@/theme/theme";
import { useTheme } from "@/theme/ThemeProvider";


const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as keyof typeof themes)}
      className="p-3 transition-all rounded-[var(--border-radius)] bg-[var(--color-secondary)] text-[var(--text)]"
    >
      {Object.keys(themes).map((key) => (
        <option key={key} value={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default ThemeSwitcher;
