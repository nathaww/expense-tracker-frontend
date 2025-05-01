'use client';

import React from 'react';
import Overview from '@/components/Dashboard/Overview';
import Trends from '@/components/Dashboard/Trends';
import BudgetComparison from '@/components/Dashboard/BudgetComparison';
import ExpenseComposition from '@/components/Dashboard/ExpenseComposition';

export default function DashboardPage() {
  return (
    <div className="container min-h-screen mx-auto px-4 py-8 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 space-y-8">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-secondary)]">Dashboard</h1>
      
      <Overview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BudgetComparison />
        <ExpenseComposition />
      </div>
      
      <Trends />
    </div>
  );
}