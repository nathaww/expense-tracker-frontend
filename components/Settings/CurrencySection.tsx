"use client";

import { motion } from "framer-motion";
import { AppSettings, appSettingsRequests } from "@/app/settings/_requests";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { exchangeRatesRequests } from "@/app/exchange-rates/_requests";
import { toast } from "sonner";
import { CurrencySelect } from "@/components/UI/CurrencySelect";

interface CurrencySectionProps {
  settings: AppSettings;
}

export const CurrencySection = ({ settings }: CurrencySectionProps) => {
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
      </div>      <div className="mb-4">
        <p className="text-[var(--textSecondary)] mb-4">
          Select your preferred currency for displaying balances and transactions.
        </p>
        <div className="w-full max-w-xs">
          <CurrencySelect
            value={settings.preferredCurrency}
            onValueChange={changeCurrency}
            currencies={exchangeRatesData?.currencies || []}
            placeholder="Select Currency"
            isLoading={isLoadingCurrencies}
            searchable={true}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
};