"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { AppSettings, appSettingsRequests } from "@/app/settings/_requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CurrencySectionProps {
  settings: AppSettings;
}

export const CurrencySection = ({ settings }: CurrencySectionProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateSettings } = useMutation({
    mutationFn: appSettingsRequests.updateAppSettings,
    onSuccess: () => {
      toast.success("Currency updated successfully");
      
      // Invalidate relevant queries to refetch data with new currency
      queryClient.invalidateQueries({ queryKey: ["app-settings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-budget-comparison"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-expense-composition"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-trends"] });
      queryClient.invalidateQueries({ queryKey: ["money-sources"] });
      
      // Dispatch custom event to notify other components
      const event = new CustomEvent('currencychange');
      window.dispatchEvent(event);
    },
    onError: () => {
      toast.error("Failed to update currency");
    },
  });

  const changeCurrency = (currency: "USD" | "ETB") => {
    if (currency === settings.preferredCurrency) return;
    
    updateSettings({ preferredCurrency: currency });
    setIsDropdownOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--text)]">Currency</h2>
      </div>
      <div className="mb-4">
        <p className="text-[var(--textSecondary)] mb-4">
          Select your preferred currency for displaying balances and transactions.
        </p>
        
        <div className="relative inline-block w-full max-w-xs">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full gap-2 px-4 py-3 rounded-[var(--border-radius)] bg-[var(--bg)] border border-[var(--border-color)] hover:bg-[var(--bgSecondary)] transition-colors"
            title="Select currency"
          >
            <span className="flex items-center gap-1">
              <span className="font-medium">Preferred Currency:</span> {settings.preferredCurrency}
            </span>
            <FaChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full z-10 bg-[var(--bg)] border border-[var(--border-color)] rounded-[var(--border-radius)] shadow-lg overflow-hidden">
              <button
                onClick={() => changeCurrency("USD")}
                className={`w-full px-4 py-3 text-left hover:bg-[var(--bgSecondary)] transition-colors ${settings.preferredCurrency === "USD" ? 'bg-[var(--bgSecondary)]' : ''}`}
              >
                USD
              </button>
              <button
                onClick={() => changeCurrency("ETB")}
                className={`w-full px-4 py-3 text-left hover:bg-[var(--bgSecondary)] transition-colors ${settings.preferredCurrency === "ETB" ? 'bg-[var(--bgSecondary)]' : ''}`}
              >
                ETB
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};