'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { dashboardRequests } from '@/app/dashboard/_requests';
import { formatCurrency } from '@/components/utils/formatCurrency';
import AnimatedStatsCard from './AnimatedStatsCard';
import { FaWallet, FaPiggyBank, FaChartLine, FaPercentage } from 'react-icons/fa';

interface EnhancedOverviewProps {
  currencyType: string;
  hideAmount: boolean;
}

const StatIllustration = ({ type }: { type: string }) => {
  const illustrations = {
    wallet: (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <motion.rect
          x="15" y="25" width="50" height="30" rx="6"
          fill="currentColor" opacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.rect
          x="20" y="30" width="40" height="20" rx="3"
          fill="currentColor" opacity="0.3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        <motion.circle
          cx="50" cy="40" r="5"
          fill="currentColor" opacity="0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </svg>
    ),
    savings: (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <motion.ellipse
          cx="40" cy="45" rx="20" ry="15"
          fill="currentColor" opacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx="35" cy="40" r="1.5"
          fill="currentColor" opacity="0.6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <motion.rect
          x="38" y="28" width="3" height="6" rx="1.5"
          fill="currentColor" opacity="0.4"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      </svg>
    ),
    expenses: (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {[...Array(4)].map((_, i) => (
          <motion.rect
            key={i}
            x={20 + i * 8} y={50 - i * 5} width="6" height={15 + i * 5} rx="3"
            fill="currentColor" opacity={0.3 + i * 0.1}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
      </svg>
    ),
    budget: (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <motion.circle
          cx="40" cy="40" r="25"
          fill="none" stroke="currentColor" strokeWidth="4" opacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.circle
          cx="40" cy="40" r="25"
          fill="none" stroke="currentColor" strokeWidth="4" opacity="0.6"
          strokeDasharray="100 157"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 0.7 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </svg>
    )
  };

  return illustrations[type as keyof typeof illustrations] || null;
};

export default function EnhancedOverview({ currencyType, hideAmount }: EnhancedOverviewProps) {
  const { data: overview, isLoading, isError } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardRequests.getOverview,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="h-40 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] p-6"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-[var(--bgSecondary)] rounded mb-4"></div>
              <div className="h-8 bg-[var(--bgSecondary)] rounded mb-2"></div>
              <div className="h-3 bg-[var(--bgSecondary)] rounded w-2/3"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-[var(--text)]/60"
      >
        <p>Unable to load overview data</p>
      </motion.div>
    );
  }

  const formatValue = (value: number) => {
    return hideAmount ? '****' : formatCurrency(value, currencyType);
  };

  const cards = [
    {
      title: 'Total Balance',
      value: formatValue(overview.totalBalance),
      icon: FaWallet,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: { value: 12.5, isPositive: true },
      illustration: <StatIllustration type="wallet" />
    },
    {
      title: 'Monthly Income',
      value: formatValue(overview.totalBalance),
      icon: FaPiggyBank,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: { value: 8.2, isPositive: true },
      illustration: <StatIllustration type="savings" />
    },
    {
      title: 'Monthly Expenses',
      value: formatValue(overview.totalExpenses),
      icon: FaChartLine,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      trend: { value: 3.1, isPositive: false },
      illustration: <StatIllustration type="expenses" />
    },
    {
      title: 'Budget Usage',
      value: `${Math.round((overview.totalExpenses / overview.totalBalance) * 100)}%`,
      icon: FaPercentage,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      trend: { value: 15.3, isPositive: false },
      illustration: <StatIllustration type="budget" />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <AnimatedStatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            delay={index * 0.1}
            trend={card.trend}
            gradient={card.gradient}
            illustration={card.illustration}
          />
        ))}
      </div>
    </motion.div>
  );
}
