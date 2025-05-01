'use client';

import React, { useState, useEffect } from 'react';
import Overview from '@/components/Dashboard/Overview';
import Trends from '@/components/Dashboard/Trends';
import BudgetComparison from '@/components/Dashboard/BudgetComparison';
import ExpenseComposition from '@/components/Dashboard/ExpenseComposition';
import DashboardControls from '@/components/Dashboard/DashboardControls';
import { AppSettings, UpdateAppSettingsInput, appSettingsRequests } from '../settings/_requests';
import { useQueryClient } from '@tanstack/react-query';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [appSettings, setAppSettings] = useState<AppSettings>({
    id: "default",
    preferredCurrency: "USD",
    hideAmounts: false,
    themePreference: "system",
    userId: "default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await appSettingsRequests.getAppSettings();
        setAppSettings(settings);
      } catch (error) {
        console.error("Error fetching app settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // Handle settings updates
  const handleUpdateSettings = async (data: UpdateAppSettingsInput) => {
    try {
      const updatedSettings = { ...appSettings, ...data };
      setAppSettings(updatedSettings);
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-budget-comparison'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-expense-composition'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-trends'] });
    } catch (error) {
      console.error("Error updating app settings:", error);
      const originalSettings = await appSettingsRequests.getAppSettings();
      setAppSettings(originalSettings);
    }
  };

  return (
    <div className="container min-h-screen mx-auto px-4 py-8 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-secondary)]">Dashboard</h1>
        <DashboardControls settings={appSettings} onUpdateSettings={handleUpdateSettings} />
      </div>

      <Overview currencyType={appSettings.preferredCurrency} hideAmount={appSettings.hideAmounts} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BudgetComparison currencyType={appSettings.preferredCurrency} hideAmount={appSettings.hideAmounts} />
        <ExpenseComposition currencyType={appSettings.preferredCurrency} hideAmount={appSettings.hideAmounts} />
      </div>

      <Trends currencyType={appSettings.preferredCurrency} hideAmount={appSettings.hideAmounts} />
    </div>
  );
}