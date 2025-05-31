"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { AppSettings, appSettingsRequests } from "@/app/settings/_requests";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { exchangeRatesRequests } from "@/app/exchange-rates/_requests";
import { toast } from "sonner";

interface CurrencySectionProps {
  settings: AppSettings;
}

export const CurrencySection = ({ settings }: CurrencySectionProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch currencies from exchange rates API
  const { data: exchangeRatesData, isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: exchangeRatesRequests.getExchangeRates,
  });

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

  const changeCurrency = (currency: string) => {
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
          <div className="relative inline-block w-full max-w-xs">          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full gap-2 px-4 py-3 rounded-[var(--border-radius)] bg-[var(--bg)] border border-[var(--border-color)] hover:bg-[var(--bgSecondary)] transition-colors cursor-pointer"
            title="Select currency"
            disabled={isLoadingCurrencies}
          >
            <span className="flex items-center gap-1">
              <span className="font-medium">Preferred Currency:</span> {settings.preferredCurrency}
            </span>
            <FaChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && !isLoadingCurrencies && (
            <div className="absolute top-full left-0 mt-1 w-full z-10 bg-[var(--bg)] border border-[var(--border-color)] rounded-[var(--border-radius)] shadow-lg overflow-hidden max-h-48 overflow-y-auto">
              {exchangeRatesData?.currencies?.map((currency) => (                <button
                  key={currency.code}
                  onClick={() => changeCurrency(currency.code)}
                  className={`w-full px-4 py-3 text-left hover:bg-[var(--bgSecondary)] transition-colors flex items-center justify-between cursor-pointer ${settings.preferredCurrency === currency.code ? 'bg-[var(--bgSecondary)]' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-sm text-[var(--text-secondary)]">{currency.name}</span>
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">{currency.symbol}</span>
                </button>
              ))}
            </div>
          )}
          
          {isLoadingCurrencies && (
            <div className="absolute top-full left-0 mt-1 w-full z-10 bg-[var(--bg)] border border-[var(--border-color)] rounded-[var(--border-radius)] shadow-lg p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-[var(--bgSecondary)] rounded mb-2"></div>
                <div className="h-4 bg-[var(--bgSecondary)] rounded mb-2"></div>
                <div className="h-4 bg-[var(--bgSecondary)] rounded"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};