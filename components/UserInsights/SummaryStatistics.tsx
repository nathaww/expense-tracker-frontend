'use client';

import { SpendingComparison } from '@/app/user-insights/_requests';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';
import React from 'react';

export const SummaryStatistics = ({ data }: { data: SpendingComparison }) => {
  const isSpendingLess = data.overallDifferencePercentage < 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md"
        whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2">Your Monthly Spending</h3>
        <p className="text-2xl font-bold text-[var(--text)]">
          {formatCurrency(data.userMonthlySpending, data.currency)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md"
        whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2">Average Spending</h3>
        <p className="text-2xl font-bold text-[var(--text)]">
          {formatCurrency(data.averageMonthlySpending, data.currency)}
          <span className="text-sm font-normal ml-2 text-[var(--text)]/70">({data.comparisonUserCount} users)</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`p-6 rounded-[var(--border-radius)] border-2 ${
          isSpendingLess 
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
            : 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5'
        } shadow-md`}
        whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2">Compared to Average</h3>
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${
            isSpendingLess 
              ? 'text-[var(--color-primary)]' 
              : 'text-[var(--color-secondary)]'
          }`}>
            {isSpendingLess ? '↓' : '↑'} {Math.abs(data.overallDifferencePercentage).toFixed(1)}%
          </span>
          <span className="ml-2 text-sm text-[var(--text)]/70">
            {isSpendingLess ? 'less than average' : 'more than average'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};