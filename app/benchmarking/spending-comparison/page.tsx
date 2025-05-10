'use client';

import { useQuery } from '@tanstack/react-query';
import { benchmarkingRequests, SpendingComparison } from '../_requests';

import { motion } from 'framer-motion';

import { SummaryStatistics } from '@/components/Benchmarking/SummaryStatistics';
import React from 'react';
import Loader from '@/components/UI/Loader';
import { InsightsCard } from '@/components/Benchmarking/InsightsCardNew';

export default function SpendingComparisonPage() {
    const { data, isLoading, isError } = useQuery<SpendingComparison>({
        queryKey: ['spending-comparison'],
        queryFn: benchmarkingRequests.getSpendingComparison,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader />
            </div>
        );
    }

    if (isError || !data) {
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
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-8">
                    Spending Benchmarks
                </h1>

                <SummaryStatistics data={data} />

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="col-span-1"
                    >
                        <InsightsCard insights={data.insights} />
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