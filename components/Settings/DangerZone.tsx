"use client";

import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

interface DangerZoneProps {
  onDeleteAccount: () => void;
}

export const DangerZone = ({ onDeleteAccount }: DangerZoneProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-[var(--border-radius)] p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <FaExclamationTriangle className="text-red-600 dark:text-red-400" size={20} />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Danger Zone
        </h3>
      </div>
      
      <p className="text-red-700 dark:text-red-300 text-sm mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      
      <button
        type="button"
        onClick={onDeleteAccount}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-[var(--border-radius)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Delete Account
      </button>
    </motion.div>
  );
};
