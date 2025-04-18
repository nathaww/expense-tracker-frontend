'use client';

import React from 'react';
import Overview from '@/components/Dashboard/Overview';
import Trends from '@/components/Dashboard/Trends';

export default function DashboardPage() {
  return (
    <div className="container min-h-screen mx-auto px-4 py-8 bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-secondary)]">Dashboard</h1>
      <Overview />
      <Trends />
    </div>
  );
}