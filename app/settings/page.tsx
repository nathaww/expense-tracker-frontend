"use client";
import { motion } from "framer-motion";
import { themes, ThemeName } from "@/theme/theme";
import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/UI/Loader";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <Loader />;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-[var(--text)]"
      >
        Settings
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">Theme</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(Object.keys(themes) as ThemeName[]).map((themeName) => (
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
                  style={{ backgroundColor: themes[themeName].primary }}
                />
                <span className="text-[var(--text)] capitalize">
                  {themeName}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">Account</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-[var(--border-radius)] transition-all"
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;