"use client";

import React from 'react';
import { FaEye, FaEyeSlash, FaDollarSign, FaCoins } from 'react-icons/fa';
import { toast } from 'sonner';
import { AppSettings, UpdateAppSettingsInput } from '@/app/settings/_requests';

interface DashboardControlsProps {
  settings: AppSettings;
  onUpdateSettings: (data: UpdateAppSettingsInput) => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({ settings, onUpdateSettings }) => {
  const toggleHideAmounts = () => {
    const newValue = !settings.hideAmounts;
    onUpdateSettings({ hideAmounts: newValue });
    toast.success(newValue ? "Amounts are now hidden" : "Amounts are now visible");
  };

  const toggleCurrency = () => {
    const newCurrency = settings.preferredCurrency === "USD" ? "ETB" : "USD";
    onUpdateSettings({ preferredCurrency: newCurrency });
    toast.success(`Currency changed to ${newCurrency}`);
  };

  return (
    <div className="flex items-center justify-end gap-2 mb-4">
      <button
        onClick={toggleCurrency}
        className="flex items-center gap-1 px-3 py-1 rounded-[var(--border-radius)] bg-[var(--bg)] border border-[var(--border-color)] hover:bg-[var(--bgSecondary)] transition-colors"
        title={`Switch to ${settings.preferredCurrency === "USD" ? "ETB" : "USD"}`}
      >
        {settings.preferredCurrency === "USD" ? (
          <>
            <FaDollarSign size={14} />
            <span>USD</span>
          </>
        ) : (
          <>
            <FaCoins size={14} />
            <span>ETB</span>
          </>
        )}
      </button>

      <button
        onClick={toggleHideAmounts}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--bg)] border border-[var(--border-color)] hover:bg-[var(--bgSecondary)] transition-colors"
        title={settings.hideAmounts ? "Show amounts" : "Hide amounts"}
      >
        {settings.hideAmounts ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </button>
    </div>
  );
};

export default DashboardControls;