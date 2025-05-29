"use client";

import { motion } from "framer-motion";
import { themes, ThemeName } from "@/theme/theme";
import { useTheme } from "@/theme/ThemeProvider";

export const ThemeSection = () => {
  const { theme, setTheme, customTheme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--text)]">Theme</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(Object.keys(themes) as ThemeName[]).map((themeName) => {
          const themeColor = themeName === 'custom' && customTheme 
            ? customTheme.primary 
            : themes[themeName as Exclude<ThemeName, 'custom'>]?.primary;

          return (
            <motion.button
              key={themeName}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(themeName)}
              className={`p-4 rounded-[var(--border-radius)] transition-all ${
                theme === themeName 
                  ? "ring-2 ring-[var(--color-primary)] bg-[var(--color-secondary)]" 
                  : "bg-[var(--bg)] hover:bg-[var(--color-secondary)]"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full" 
                  style={{ backgroundColor: themeColor }}
                />
                <span className="text-[var(--text)] capitalize">
                  {themeName}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};