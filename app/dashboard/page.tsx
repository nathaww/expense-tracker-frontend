'use client';

import Overview from '@/components/Dashboard/Overview';
import Trends from '@/components/Dashboard/Trends';
import BudgetComparison from '@/components/Dashboard/BudgetComparison';
import ExpenseComposition from '@/components/Dashboard/ExpenseComposition';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function DashboardPage() {
  const { preferredCurrency } = useAppSettings();

  const [hideAmounts, setHideAmounts] = useState(false);
  
  const toggleHideAmounts = () => {
    setHideAmounts((prev: boolean) => !prev);
    localStorage.setItem('hideAmounts', (!hideAmounts).toString());
  };

  useEffect(() => {
    const storedValue = localStorage.getItem('hideAmounts');
    if (storedValue) {
      setHideAmounts(storedValue === 'true');
    }
  }, [hideAmounts]);


  return (
    <div className="container min-h-screen mx-auto px-4 py-8 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-secondary)]">Dashboard</h1>
        <button
        onClick={toggleHideAmounts}
          className="flex items-center justify-center transition-all cursor-pointer active:scale-95 hover:scale-105 w-9 h-9 rounded-full bg-[var(--bg)] border border-[var(--border-color)] hover:bg-[var(--bgSecondary)]"
          title={hideAmounts ? "Show amounts" : "Hide amounts"}
        >
          {hideAmounts ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
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