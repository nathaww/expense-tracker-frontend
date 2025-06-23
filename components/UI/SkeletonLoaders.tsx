'use client';

import { motion } from 'framer-motion';

/**
 * Collection of skeleton loaders for different components
 */

export const OverviewCardSkeleton = ({ index = 0 }: { index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="h-40 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] p-6"
  >
    <div className="animate-pulse h-full flex flex-col justify-between">
      <div className="flex justify-between">
        <div className="h-4 bg-[var(--bgSecondary)] rounded w-1/3"></div>
        <div className="h-6 w-6 rounded-full bg-[var(--bgSecondary)]"></div>
      </div>
      <div>
        <div className="h-8 bg-[var(--bgSecondary)] rounded mb-2"></div>
        <div className="h-3 bg-[var(--bgSecondary)] rounded w-2/3"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-[var(--bgSecondary)] rounded w-1/5"></div>
        <div className="w-12 h-12 bg-[var(--bgSecondary)] opacity-30 rounded-full"></div>
      </div>
    </div>
  </motion.div>
);

export const EnhancedOverviewSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <OverviewCardSkeleton key={i} index={i} />
    ))}
  </div>
);

export const AnalyticsCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] p-6 h-full min-h-[200px]"
  >
    <div className="animate-pulse h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 bg-[var(--bgSecondary)] rounded w-1/3"></div>
        <div className="h-5 w-5 rounded-full bg-[var(--bgSecondary)]"></div>
      </div>
      <div className="flex-1 bg-[var(--bgSecondary)] rounded-lg opacity-30 mb-4"></div>
      <div>
        <div className="h-6 bg-[var(--bgSecondary)] rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-[var(--bgSecondary)] rounded w-1/4"></div>
      </div>
    </div>
  </motion.div>
);

export const AnalyticsSectionSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <AnalyticsCardSkeleton key={i} delay={i * 0.1} />
    ))}
  </div>
);

export const ChartSkeleton = ({ height = '400px' }: { height?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] p-6"
  >
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 bg-[var(--bgSecondary)] rounded w-1/4"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 rounded bg-[var(--bgSecondary)]"></div>
          <div className="h-8 w-8 rounded bg-[var(--bgSecondary)]"></div>
          <div className="h-8 w-8 rounded bg-[var(--bgSecondary)]"></div>
        </div>
      </div>
      <div className={`w-full bg-[var(--bgSecondary)] rounded-lg opacity-30`} style={{ height }}></div>
      <div className="mt-4 flex justify-between">
        <div className="h-3 bg-[var(--bgSecondary)] rounded w-16"></div>
        <div className="h-3 bg-[var(--bgSecondary)] rounded w-24"></div>
      </div>
    </div>
  </motion.div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-[var(--border-color)]">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="py-2 px-3">
        <div className="h-4 bg-[var(--bgSecondary)] rounded w-full"></div>
      </td>
    ))}
  </tr>
);

export const TableSkeleton = ({ rowCount = 5 }: { rowCount?: number }) => (
  <div className="overflow-x-auto mt-4 animate-pulse">
    <table className="w-full text-sm">
      <thead className="text-left">
        <tr className="border-b border-[var(--border-color)]">
          {[...Array(5)].map((_, i) => (
            <th key={i} className="py-2 px-3">
              <div className="h-4 bg-[var(--bgSecondary)] rounded w-full"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rowCount)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </tbody>
    </table>
  </div>
);

export const BudgetComparisonSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] p-6"
  >
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-[var(--bgSecondary)] rounded w-1/3"></div>
        <div className="h-6 w-6 rounded-full bg-[var(--bgSecondary)]"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 flex justify-center items-center">
          <div className="w-40 h-40 rounded-full bg-[var(--bgSecondary)] opacity-30"></div>
        </div>
        <div className="col-span-2">
          <TableSkeleton rowCount={3} />
        </div>
      </div>
    </div>
  </motion.div>
);

export const ExpenseCompositionSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] p-6"
  >
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-[var(--bgSecondary)] rounded w-1/3"></div>
        <div className="h-6 w-6 rounded-full bg-[var(--bgSecondary)]"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 flex justify-center items-center">
          <div className="w-40 h-40 rounded-full bg-[var(--bgSecondary)] opacity-30"></div>
        </div>
        <div className="col-span-2">
          <TableSkeleton rowCount={5} />
        </div>
      </div>
    </div>
  </motion.div>
);

export const DataManagementCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] p-6 h-40"
  >
    <div className="animate-pulse h-full flex flex-col justify-between">
      <div className="h-6 bg-[var(--bgSecondary)] rounded w-1/3"></div>
      <div className="h-4 bg-[var(--bgSecondary)] rounded w-2/3"></div>
      <div className="flex justify-end">
        <div className="h-9 bg-[var(--bgSecondary)] rounded w-1/4"></div>
      </div>
    </div>
  </motion.div>
);

export const DashboardSkeleton = () => (
  <div className="container min-h-screen mx-auto px-4 py-8 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 space-y-8">
    {/* Header Skeleton */}
    <motion.div
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-8 bg-[var(--bgSecondary)] rounded w-1/5 animate-pulse"></div>
      <div className="h-10 w-10 rounded-xl bg-[var(--bgSecondary)] animate-pulse"></div>
    </motion.div>

    {/* Overview Skeleton */}
    <EnhancedOverviewSkeleton />

    {/* Data Management Section Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 bg-[var(--bgSecondary)] rounded w-1/6 animate-pulse"></div>
        <div className="flex-1 h-px bg-[var(--bgSecondary)] animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DataManagementCardSkeleton />
        <DataManagementCardSkeleton />
      </div>
    </div>

    {/* Analytics Section Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 bg-[var(--bgSecondary)] rounded w-1/6 animate-pulse"></div>
        <div className="flex-1 h-px bg-[var(--bgSecondary)] animate-pulse"></div>
      </div>
      <AnalyticsSectionSkeleton />
    </div>

    {/* Detailed Reports Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 bg-[var(--bgSecondary)] rounded w-1/6 animate-pulse"></div>
        <div className="flex-1 h-px bg-[var(--bgSecondary)] animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <BudgetComparisonSkeleton />
        <ExpenseCompositionSkeleton />
      </div>
    </div>

    {/* Trends Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 bg-[var(--bgSecondary)] rounded w-1/6 animate-pulse"></div>
        <div className="flex-1 h-px bg-[var(--bgSecondary)] animate-pulse"></div>
      </div>
      <ChartSkeleton height="400px" />
    </div>
  </div>
);

// Expenses Page Skeleton
export const ExpensesPageSkeleton = () => (
  <div className="container min-h-screen mx-auto px-4 py-8 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 space-y-8">
    {/* Header Skeleton */}
    <motion.div
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-8 bg-[var(--bgSecondary)] rounded w-1/5 animate-pulse"></div>
      <div className="flex gap-2">
        <div className="h-10 w-24 rounded-xl bg-[var(--bgSecondary)] animate-pulse"></div>
        <div className="h-10 w-10 rounded-xl bg-[var(--bgSecondary)] animate-pulse"></div>
      </div>
    </motion.div>

    {/* Filter Toolbar Skeleton */}
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg)] p-4 mb-6 animate-pulse">
      <div className="flex flex-wrap gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-[var(--bgSecondary)] rounded-lg w-32"></div>
        ))}
      </div>
    </div>

    {/* Expenses Table Skeleton */}
    <TableSkeleton rowCount={10} />

    {/* Pagination Skeleton */}
    <div className="flex justify-between items-center mt-6 animate-pulse">
      <div className="h-8 bg-[var(--bgSecondary)] rounded w-20"></div>
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-8 rounded-md bg-[var(--bgSecondary)]"></div>
        ))}
      </div>
      <div className="h-8 bg-[var(--bgSecondary)] rounded w-20"></div>
    </div>
  </div>
);

// Categories Page Skeleton
export const CategoriesPageSkeleton = () => (
  <div className="min-h-screen p-4 sm:p-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:mb-8 sm:gap-0">
      <div className="h-8 bg-[var(--bgSecondary)] rounded w-32 animate-pulse"></div>
      <div className="h-10 w-28 rounded-xl bg-[var(--bgSecondary)] animate-pulse"></div>
    </div>

    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="animate-pulse bg-[var(--bgSecondary)] h-32 sm:h-36 rounded-[var(--border-radius)]"
        />
      ))}
    </motion.div>
  </div>
);

// Money Sources Page Skeleton
export const MoneySourcesPageSkeleton = () => (
  <div className="min-h-screen p-4 sm:p-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:mb-8 sm:gap-0">
      <div className="w-48 h-8 bg-[var(--bgSecondary)] rounded animate-pulse" />
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded bg-[var(--bgSecondary)] animate-pulse" />
        <div className="h-9 w-28 rounded-lg bg-[var(--bgSecondary)] animate-pulse" />
      </div>
    </div>

    <div className="overflow-hidden rounded-[var(--border-radius)] border border-[var(--border-color)] mb-6 animate-pulse">
      <div className="grid grid-cols-2 gap-2 p-4 bg-[var(--bg)]">
        <div className="h-20 bg-[var(--bgSecondary)] rounded" />
        <div className="h-20 bg-[var(--bgSecondary)] rounded" />
      </div>
    </div>

    {/* View Mode Controls */}
    <div className="flex justify-end mb-4 gap-2">
      <div className="h-8 w-8 rounded bg-[var(--bgSecondary)] animate-pulse" />
      <div className="h-8 w-8 rounded bg-[var(--bgSecondary)] animate-pulse" />
    </div>

    {/* Table View */}
    <TableSkeleton rowCount={6} />
  </div>
);

// Settings Page Skeleton
export const SettingsPageSkeleton = () => (
  <div className="p-8 max-w-4xl mx-auto min-h-screen animate-pulse">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="h-8 bg-[var(--bgSecondary)] rounded w-32"></div>
    </motion.div>

    {/* Profile Section */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
    >
      <div className="h-6 bg-[var(--bg)] rounded w-24 mb-6"></div>
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-[var(--bg)] rounded w-16"></div>
            <div className="h-10 bg-[var(--bg)] rounded w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-[var(--bg)] rounded w-16"></div>
            <div className="h-10 bg-[var(--bg)] rounded w-full"></div>
          </div>
          <div className="h-10 bg-[var(--bg)] rounded w-32 mt-4"></div>
        </div>
      </div>
    </motion.div>

    {/* Currency Section */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-[var(--bg)] rounded w-28"></div>
      </div>
      <div className="mb-4">
        <div className="h-4 bg-[var(--bg)] rounded w-full mb-4"></div>
        <div className="w-full max-w-xs">
          <div className="h-10 bg-[var(--bg)] rounded w-full"></div>
        </div>
      </div>
    </motion.div>

    {/* Theme Section */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-[var(--bg)] rounded w-20"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="p-4 rounded-[var(--border-radius)] bg-[var(--bg)]"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--bg)]"></div>
              <div className="h-4 bg-[var(--bg)] rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>

    {/* App Tour & Help Section */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
    >
      <div className="h-6 bg-[var(--bg)] rounded w-32 mb-4"></div>
      <div className="space-y-4">
        <div className="h-4 bg-[var(--bg)] rounded w-full mb-3"></div>
        <div className="h-10 bg-[var(--bg)] rounded w-40"></div>
      </div>
    </motion.div>

    {/* Danger Zone Section */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-red-950 border border-red-200 dark:border-red-800 rounded-[var(--border-radius)] p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 bg-red-600 dark:bg-red-400 rounded-full"></div>
        <div className="h-5 bg-red-800 dark:bg-red-200 rounded w-32"></div>
      </div>
      <div className="h-4 bg-red-700 dark:bg-red-300 rounded w-full mb-4 opacity-70"></div>
      <div className="h-10 bg-red-600 rounded w-40"></div>
    </motion.div>
  </div>
);

// User Insights Page Skeleton
export const UserInsightsPageSkeleton = () => (
  <div className="container mx-auto p-4 pb-16">
    <div className="flex justify-between items-center mb-6 animate-pulse">
      <div>
        <div className="h-8 bg-[var(--bgSecondary)] rounded w-32 mb-2"></div>
        <div className="h-4 bg-[var(--bgSecondary)] rounded w-64"></div>
      </div>
      <div className="h-10 w-28 rounded bg-[var(--bgSecondary)]"></div>
    </div>

    {/* Summary Statistics */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg bg-[var(--bgSecondary)] h-24"></div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8 animate-pulse">
      <div className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md">
        <div className="h-6 bg-[var(--bgSecondary)] rounded w-40 mb-4"></div>
        <div className="h-60 bg-[var(--bgSecondary)] rounded opacity-30"></div>
      </div>
    </div>
  </div>
);

// Add Expense Page Skeleton
export const AddExpensePageSkeleton = () => (
  <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl animate-pulse">
    <div className="mb-6">
      <div className="h-8 bg-[var(--bgSecondary)] rounded w-48"></div>
    </div>

    <div className="bg-[var(--bg)] rounded-lg border border-[var(--border-color)] p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-[var(--bgSecondary)] rounded w-24"></div>
            <div className="h-10 bg-[var(--bgSecondary)] rounded w-full"></div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 space-y-2">
        <div className="h-4 bg-[var(--bgSecondary)] rounded w-24"></div>
        <div className="h-20 bg-[var(--bgSecondary)] rounded w-full"></div>
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <div className="h-10 bg-[var(--bgSecondary)] rounded w-24"></div>
        <div className="h-10 bg-[var(--bgSecondary)] rounded w-24"></div>
      </div>
    </div>
  </div>
);
