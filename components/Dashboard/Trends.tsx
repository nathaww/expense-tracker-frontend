'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardRequests, TrendData } from '@/app/dashboard/_requests';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@/theme/ThemeProvider';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({ 
  active, 
  payload, 
  label 
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg)] p-4 rounded-[var(--border-radius)] shadow-lg border border-[var(--color-secondary)] text-[var(--text)]">
        <p className="text-sm font-semibold">{format(new Date(label), 'MMM d, yyyy')}</p>
        <p className="text-[var(--color-primary)]">
          {formatCurrency(payload[0].value as number)}
        </p>
      </div>
    );
  }
  return null;
};

const TrendChart = ({ data, title }: { data: TrendData[]; title: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-[var(--border-radius)] bg-[var(--bgSecondary)] shadow-lg"
    >
      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`gradient${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-secondary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-secondary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              stroke="var(--text)"
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              stroke="var(--text)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-secondary)"
              fillOpacity={1}
              fill={`url(#gradient${title})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default function Trends() {
  const { data: trends, isLoading, isError } = useQuery({
    queryKey: ['dashboard-trends'],
    queryFn: dashboardRequests.getTrends,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse p-6 rounded-[var(--border-radius)] bg-[var(--bgSecondary)] h-[400px]"
          />
        ))}
      </div>
    );
  }

  if (isError || !trends) {
    return (
      <div className="p-6 rounded-[var(--border-radius)] bg-[var(--bgSecondary)]">
        <p className="text-[var(--text)]">Failed to load trends data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TrendChart data={trends.weeklyTrends} title="Weekly Expenses" />
      <TrendChart data={trends.monthlyTrends} title="Monthly Expenses" />
    </div>
  );
}