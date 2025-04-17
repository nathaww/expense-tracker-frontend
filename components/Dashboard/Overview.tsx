'use client';

import { motion } from 'framer-motion';
import { FaWallet, FaPiggyBank, FaChartLine, FaPercentage } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { dashboardRequests } from '@/app/dashboard/_requests';
import { formatCurrency } from '@/components/utils/formatCurrency';
import { IconType } from 'react-icons';

const OverviewCard = ({ 
  title, 
  value, 
  icon: Icon, 
  delay 
}: { 
  title: string; 
  value: string; 
  icon: IconType;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-[var(--border-radius)] bg-[var(--bgSecondary)] shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
        <Icon className="w-6 h-6 text-[var(--color-secondary)]" />
      </div>
      <p className="text-2xl font-bold text-[var(--color-primary)]">{value}</p>
    </motion.div>
  );
};

export default function Overview() {
  const { data: overview, isLoading, isError } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardRequests.getOverview,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse p-6 rounded-[var(--border-radius)] bg-[var(--bgSecondary)] h-32" />
        ))}
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="p-6 rounded-[var(--border-radius)] bg-[var(--bgSecondary)]">
        <p className="text-[var(--text)]">Failed to load overview data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <OverviewCard
        title="Total Balance"
        value={formatCurrency(overview.totalBalance)}
        icon={FaWallet}
        delay={0}
      />
      <OverviewCard
        title="Total Budget"
        value={formatCurrency(overview.totalBudget)}
        icon={FaPiggyBank}
        delay={0.1}
      />
      <OverviewCard
        title="Total Expenses"
        value={formatCurrency(overview.totalExpenses)}
        icon={FaChartLine}
        delay={0.2}
      />
      <OverviewCard
        title="Budget Utilization"
        value={`${overview.budgetUtilization}%`}
        icon={FaPercentage}
        delay={0.3}
      />
    </div>
  );
}