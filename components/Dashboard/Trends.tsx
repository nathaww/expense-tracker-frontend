"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardRequests, TrendData } from "@/app/dashboard/_requests";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/formatCurrency";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { FaInfoCircle } from 'react-icons/fa';
import StyledTooltip from '@/components/UI/StyledTooltip';

interface TrendsProps {
  currencyType: string;
  hideAmount: boolean;
}

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), "MMM d");
  } catch {
    return dateString;
  }
};

const CustomTooltip = ({
  active,
  payload,
  label,
  currencyType,
  hideAmount
}: TooltipProps<ValueType, NameType> & { currencyType: string, hideAmount: boolean }) => {
  if (active && payload && payload.length) {
    try {
      const formattedDate = format(parseISO(label as string), "MMM d, yyyy");
      return (
        <div className="bg-[var(--bg)] p-4 rounded-[var(--border-radius)] border border-[var(--color-secondary)] text-[var(--text)]">
          <p className="text-sm font-semibold">{formattedDate}</p>
          <p className="text-[var(--color-primary)]">
            {formatCurrency(payload[0].value as number, currencyType, hideAmount, true)}
          </p>
        </div>
      );
    } catch {
      return null;
    }
  }
  return null;
};

const TrendChart = ({ 
  data, 
  title,
  currencyType,
  hideAmount
}: { 
  data: TrendData[]; 
  title: string;
  currencyType: string;
  hideAmount: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md"    >
      <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
        {title}        <StyledTooltip 
          content="Visualizes your spending patterns over time. See how your expenses change weekly and monthly to identify spending patterns."
          position="top-start"
          maxWidth={300}
        >
          <FaInfoCircle className="w-4 h-4 text-[var(--text)]/50 cursor-pointer" />
        </StyledTooltip>
      </h3>
      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`gradient${title}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
              stroke="var(--border-color)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="var(--text)"
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value, currencyType, hideAmount, true)}
              stroke="var(--text)"
            />
            <Tooltip content={(props) => <CustomTooltip {...props} currencyType={currencyType} hideAmount={hideAmount} />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--text)"
              fillOpacity={1}
              fill={`var(--color-secondary)`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default function Trends({ currencyType, hideAmount }: TrendsProps & { hideAmount: boolean }) {
  const {
    data: trends,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard-trends"],
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
      <div className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bgSecondary)]">
        <p className="text-[var(--text)]">Failed to load trends data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TrendChart 
        data={trends.weeklyTrends} 
        title="Weekly Expenses"
        currencyType={currencyType}
        hideAmount={hideAmount}
      />
      <TrendChart 
        data={trends.monthlyTrends} 
        title="Monthly Expenses"
        currencyType={currencyType}
        hideAmount={hideAmount}
      />
    </div>
  );
}
