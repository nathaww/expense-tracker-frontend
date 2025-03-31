"use client"
import { ThemeName, useTheme } from "@/context/ThemeContext";


const ThemeSwitcher = () => {
  const { theme, mode, setTheme, toggleMode } = useTheme();

  return (
    <div className="p-4 flex gap-4">
      <select
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        value={theme}
        className="p-2 bg-primary text-bg border-[var(--border)] rounded-[var(--border-radius)]"
      >
        <option value="retro">Retro</option>
        <option value="classic">Classic</option>
        <option value="modern">Modern</option>
      </select>
      <button
        onClick={toggleMode}
        className="p-2 bg-secondary text-text"
      >
        {mode === "light" ? "Dark Mode" : "Light Mode"}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
