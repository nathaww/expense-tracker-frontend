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
import { useQuery } from '@tanstack/react-query';
import { dashboardRequests } from './_requests';
import { AnalyticsService } from '@/lib/analytics';

export default function DashboardPage() {
  const { preferredCurrency } = useAppSettings();
  const { isNewUser, markOnboardingCompleted } = useOnboarding();

  const [hideAmounts, setHideAmounts] = useState(false);

  // Fetch all dashboard data for analytics
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardRequests.getOverview,
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['dashboard-trends'],
    queryFn: dashboardRequests.getTrends,
  });

  const { data: budgetComparison, isLoading: budgetLoading } = useQuery({
    queryKey: ['dashboard-budget-comparison'],
    queryFn: dashboardRequests.getBudgetComparison,
  });

  const { data: expenseComposition, isLoading: compositionLoading } = useQuery({
    queryKey: ['dashboard-expense-composition'],
    queryFn: dashboardRequests.getExpenseComposition,
  });

  // Check if any data is still loading
  const isAnalyticsLoading = overviewLoading || trendsLoading || budgetLoading || compositionLoading;

  // Compute analytics when all data is available
  const computedAnalytics = overview && trends && budgetComparison && expenseComposition
    ? AnalyticsService.computeAnalytics(overview, trends, budgetComparison, expenseComposition)
    : null;

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
      </motion.div>      <div className="dashboard-overview">
        <EnhancedOverview 
          currencyType={preferredCurrency} 
          hideAmount={hideAmounts} 
          overview={overview}
          isLoading={overviewLoading}
        />
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
      </motion.div>    
      
        {/* Analytics Section */}
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
          {isAnalyticsLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-6 rounded-[var(--border-radius)] bg-[var(--bgSecondary)] h-40" />
              ))}
            </>
          ) : computedAnalytics ? (
            <>
              <AnalyticsCard
                title={computedAnalytics.monthlyTrends.title}
                data={computedAnalytics.monthlyTrends.data}
                value={computedAnalytics.monthlyTrends.value}
                change={computedAnalytics.monthlyTrends.change}
                delay={0}
              />
              <AnalyticsCard
                title={computedAnalytics.categoryDistribution.title}
                data={computedAnalytics.categoryDistribution.data}
                value={computedAnalytics.categoryDistribution.value}
                change={computedAnalytics.categoryDistribution.change}
                delay={0.1}
              />
              <AnalyticsCard
                title={computedAnalytics.budgetHealth.title}
                data={computedAnalytics.budgetHealth.data}
                value={computedAnalytics.budgetHealth.value}
                change={computedAnalytics.budgetHealth.change}
                delay={0.2}
              />
            </>
          ) : (
            <div className="col-span-3 p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bgSecondary)]">
              <p className="text-[var(--text)]/60 text-center">Unable to load analytics data</p>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Detailed Analytics Section */}
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