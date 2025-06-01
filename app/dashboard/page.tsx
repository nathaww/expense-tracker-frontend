'use client';

import EnhancedOverview from '@/components/Dashboard/EnhancedOverview';
import DataManagementCard from '@/components/Dashboard/DataManagementCard';
import AnalyticsCard from '@/components/Dashboard/AnalyticsCard';
import Trends from '@/components/Dashboard/Trends';
import BudgetComparison from '@/components/Dashboard/BudgetComparison';
import ExpenseComposition from '@/components/Dashboard/ExpenseComposition';
import OnboardingTour from '@/components/Onboarding/OnboardingTour';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useOnboarding } from '@/providers/OnboardingProvider';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { preferredCurrency } = useAppSettings();
  const { isNewUser, markOnboardingCompleted } = useOnboarding();

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
      <OnboardingTour
        isNew={isNewUser}
        onComplete={markOnboardingCompleted}
      />      {/* Animated Header */}
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-[var(--text)] to-[var(--text)]/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Dashboard
          </motion.h1>
        </div>
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={toggleHideAmounts}
            className="flex items-center justify-center transition-all cursor-pointer w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--bg)] to-[var(--bgSecondary)] border border-[var(--border-color)] hover:scale-105 hover:shadow-lg"
            title={hideAmounts ? "Show amounts" : "Hide amounts"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {hideAmounts ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="dashboard-overview">
        <EnhancedOverview currencyType={preferredCurrency} hideAmount={hideAmounts} />
      </div>

      {/* Data Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-[var(--text)]">Data Management</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-color)] to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DataManagementCard
            title="Export Data"
            description="Download all your data as a backup file"
            type="export"
          />
          <DataManagementCard
            title="Import Data"
            description="Restore your data from a backup file"
            type="import"
          />
        </div>
      </motion.div>      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-[var(--text)]">Analytics Overview</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-color)] to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnalyticsCard
            title="Monthly Trends"
            data={[65, 45, 78, 52, 67, 43, 89]}
            value="12.5%"
            change={{
              value: 12.5,
              isPositive: true,
              period: "vs last month"
            }}
            delay={0}
          />
          <AnalyticsCard
            title="Category Distribution"
            data={[30, 25, 20, 15, 10]}
            value="5 Categories"
            change={{
              value: 5,
              isPositive: true,
              period: "active"
            }}
            delay={0.1}
          />
          <AnalyticsCard
            title="Budget Health"
            data={[85]}
            value="85%"
            change={{
              value: 15,
              isPositive: false,
              period: "over budget"
            }}
            delay={0.2}
          />
        </div>
      </motion.div>      {/* Detailed Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-[var(--text)]">Detailed Reports</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-color)] to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <motion.div
            className="budget-comparison"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <BudgetComparison currencyType={preferredCurrency} hideAmount={hideAmounts} />
          </motion.div>

          <motion.div
            className="expense-composition"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <ExpenseComposition currencyType={preferredCurrency} hideAmount={hideAmounts} />
          </motion.div>
        </div>
      </motion.div>

      {/* Trends Section */}
      <motion.div
        className="trends-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-[var(--text)]">Spending Trends</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-color)] to-transparent"></div>
        </div>
        <Trends currencyType={preferredCurrency} hideAmount={hideAmounts} />
      </motion.div>
    </div>
  );
}