'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userInsightsRequests, SpendingComparison } from '../_requests';

import { motion } from 'framer-motion';
import { FaSync } from 'react-icons/fa';

import { SummaryStatistics } from '@/components/UserInsights/SummaryStatistics';
import React from 'react';
import { UserInsightsPageSkeleton } from '@/components/UI/SkeletonLoaders';
import { InsightsCard } from '@/components/UserInsights/InsightsCardNew';

export default function SpendingComparisonPage() {
    const queryClient = useQueryClient();
    
    // Check if we already have data in cache
    const existingData = queryClient.getQueryData<SpendingComparison>(['spending-comparison']);

    const { data, isLoading, isError, isFetching } = useQuery<SpendingComparison>({
        queryKey: ['spending-comparison'],
        queryFn: userInsightsRequests.getSpendingComparison,
        staleTime: Infinity, // Data never becomes stale
        gcTime: Infinity, // Data never gets garbage collected
        enabled: !existingData, // Only fetch if we don't have existing data
    });

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['spending-comparison'] });
    };    // Use existing data if available, otherwise use newly fetched data
    const currentData = existingData || data;
    
    if (isLoading && !existingData) {
        return <UserInsightsPageSkeleton />;
    }

    if (isError && !currentData) {
        return (
            <div className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bgSecondary)]">
                <p className="text-[var(--text)]">Failed to load spending comparison data</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 pb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}            >                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                            User Insights
                        </h1>
                        <p className="text-sm text-[var(--text)]/60 mt-1">
                            Average spending comparisons are calculated based on the last 3 months of user data
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isFetching}
                        className="btn flex items-center gap-2"
                        title="Refresh data"
                    >
                        <FaSync className={`${isFetching ? 'animate-spin' : ''}`} />
                        {isFetching ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>                <SummaryStatistics data={currentData!} />

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="col-span-1"
                    >
                        <InsightsCard insights={currentData!.insights} />
                    </motion.div>

                    {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1"
          >
            <motion.div 
              className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md h-full"
              whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
            >
              <h3 className="text-lg font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-4">
                Monthly Spending Overview
              </h3>
              <div className="flex flex-col">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[var(--text)]/70">Your Spending</span>
                  <span className="font-bold text-[var(--text)]">
                    {formatCurrency(data.userMonthlySpending, data.currency)}
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-[var(--text)]/70">Average ({data.comparisonUserCount} users)</span>
                  <span className="font-bold text-[var(--text)]">
                    {formatCurrency(data.averageMonthlySpending, data.currency)}
                  </span>
                </div>
                <div className="relative w-full h-4 bg-[var(--bgSecondary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min(100, Math.max(0, (data.userMonthlySpending / data.averageMonthlySpending) * 100))}%` 
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`absolute h-full ${
                      data.overallDifferencePercentage < 0 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-secondary)]'
                    }`}
                  />
                </div>
                <p className="text-center mt-3 text-sm font-medium text-[var(--text)]/80">
                  {data.overallDifferencePercentage >= 0 
                    ? `You spend ${Math.abs(data.overallDifferencePercentage).toFixed(1)}% more than average` 
                    : `You spend ${Math.abs(data.overallDifferencePercentage).toFixed(1)}% less than average`}
                </p>
              </div>
            </motion.div>
          </motion.div> */}
                </div>

            </motion.div>
        </div>
    );
}