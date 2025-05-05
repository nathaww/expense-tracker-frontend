'use client';

import { CategoryComparison } from '@/app/benchmarking/_requests';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/components/utils/formatCurrency';
import React, { useState } from 'react';

interface CategoryComparisonChartProps {
  positiveCategories: CategoryComparison[];
  negativeCategories: CategoryComparison[];
  currency: string;
}

export const CategoryComparisonChart = ({
  positiveCategories,
  negativeCategories,
  currency,
}: CategoryComparisonChartProps) => {
  const [activeTab, setActiveTab] = useState<'spending' | 'savings'>('spending');

  const renderComparisonBars = (categories: CategoryComparison[]) => {
    return categories.map((category, index) => {
      const maxAmount = Math.max(category.userAmount, category.averageAmount);
      const userPercentage = (category.userAmount / maxAmount) * 100;
      const avgPercentage = (category.averageAmount / maxAmount) * 100;
      
      return (
        <motion.div
          key={category.categoryName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * index }}
          className="mb-6"
        >
          <div className="flex justify-between mb-1">
            <h4 className="text-[var(--text)] font-medium">{category.categoryName}</h4>
            <p className="text-sm text-[var(--text)]/60">
              {category.percentageDifference > 0 
                ? `${category.percentageDifference.toFixed(1)}% more than avg` 
                : `${Math.abs(category.percentageDifference).toFixed(1)}% less than avg`}
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs w-14 text-[var(--text)]/60">You</span>
              <div className="relative w-full h-6 bg-[var(--bgSecondary)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${userPercentage}%` }}
                  transition={{ duration: 1, delay: 0.1 * index }}
                  className="absolute h-full bg-[var(--color-primary)]"
                />
                <span className="absolute right-2 text-xs h-full flex items-center text-white font-medium">
                  {formatCurrency(category.userAmount, currency)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs w-14 text-[var(--text)]/60">Average</span>
              <div className="relative w-full h-6 bg-[var(--bgSecondary)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${avgPercentage}%` }}
                  transition={{ duration: 1, delay: 0.1 * index + 0.2 }}
                  className="absolute h-full bg-[var(--color-secondary)]"
                />
                <span className="absolute right-2 text-xs h-full flex items-center text-white font-medium">
                  {formatCurrency(category.averageAmount, currency)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 mb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`px-4 py-2 rounded-[var(--border-radius)] font-medium transition-colors ${
            activeTab === 'spending'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--bgSecondary)] text-[var(--text)] hover:bg-[var(--color-secondary)]/20'
          }`}
          onClick={() => setActiveTab('spending')}
        >
          Categories You Overspend ({positiveCategories.length})
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`px-4 py-2 rounded-[var(--border-radius)] font-medium transition-colors ${
            activeTab === 'savings'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--bgSecondary)] text-[var(--text)] hover:bg-[var(--color-secondary)]/20'
          }`}
          onClick={() => setActiveTab('savings')}
        >
          Categories You Save ({negativeCategories.length})
        </motion.button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md"
        whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-6">
          {activeTab === 'spending' 
            ? 'Categories Where You Spend More' 
            : 'Categories Where You Spend Less'}
        </h3>
        
        {activeTab === 'spending' ? (
          positiveCategories.length > 0 ? (
            renderComparisonBars(positiveCategories)
          ) : (
            <p className="text-center py-4 text-[var(--text)]/60">
              Great job! You don&apos;t overspend in any category.
            </p>
          )
        ) : (
          negativeCategories.length > 0 ? (
            renderComparisonBars(negativeCategories)
          ) : (
            <p className="text-center py-4 text-[var(--text)]/60">
              No data available for categories where you spend less than average.
            </p>
          )
        )}
      </motion.div>
    </div>
  );
};