'use client';

import Overview from '@/components/Dashboard/Overview';
import Trends from '@/components/Dashboard/Trends';
import BudgetComparison from '@/components/Dashboard/BudgetComparison';
import ExpenseComposition from '@/components/Dashboard/ExpenseComposition';
import DashboardControls from '@/components/Dashboard/DashboardControls';
import { useAppSettings } from '@/providers/AppSettingsProvider';

export default function DashboardPage() {
  const {hideAmounts, preferredCurrency, refetch} = useAppSettings();



  return (
    <div className="container min-h-screen mx-auto px-4 py-8 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-secondary)]">Dashboard</h1>
        <DashboardControls hideAmounts={hideAmounts} refetch={refetch} />
      </div>

      <Overview currencyType={preferredCurrency} hideAmount={hideAmounts} />

      <div className="grid grid-cols-1 gap-8">
        <BudgetComparison currencyType={preferredCurrency} hideAmount={hideAmounts} />
        <ExpenseComposition currencyType={preferredCurrency} hideAmount={hideAmounts} />
      </div>

      <Trends currencyType={preferredCurrency} hideAmount={hideAmounts} />
    </div>
  );
}