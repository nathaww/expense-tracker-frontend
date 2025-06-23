"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardRequests, TrendData } from "@/app/dashboard/_requests";
import { exchangeRatesRequests } from "@/app/exchange-rates/_requests";
import { motion } from "framer-motion";
import { formatCurrency, formatCompactCurrency } from "../utils/formatCurrency";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  BarChart,
  Bar,
} from "recharts";
import { format, parseISO } from "date-fns";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { FaInfoCircle, FaChartArea, FaChartBar, FaExpandArrowsAlt } from 'react-icons/fa';
import StyledTooltip from '@/components/UI/StyledTooltip';
import { useState } from 'react';
import { Currency } from '@/app/exchange-rates/_requests';

type ChartType = 'area' | 'bar' | '3d';

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
  hideAmount,
  availableCurrencies
}: TooltipProps<ValueType, NameType> & { 
  currencyType: string; 
  hideAmount: boolean;
  availableCurrencies?: Currency[];
}) => {
  if (active && payload && payload.length) {
    try {
      const formattedDate = format(parseISO(label as string), "MMM d, yyyy");
      return (
        <div className="bg-[var(--bg)] p-4 rounded-[var(--border-radius)] border border-[var(--color-secondary)] text-[var(--text)] shadow-lg">
          <p className="text-sm font-semibold">{formattedDate}</p>
          <p className="text-[var(--color-primary)] text-lg font-bold">
            {formatCurrency(payload[0].value as number, currencyType, hideAmount, false, availableCurrencies)}
          </p>
          <p className="text-xs text-[var(--text)]/60">
            Compact: {formatCompactCurrency(payload[0].value as number, currencyType, hideAmount, availableCurrencies)}
          </p>
        </div>
      );
    } catch {
      return null;
    }
  }
  return null;
};

// 3D-style Bar Component
interface BarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

const ThreeDBar = ({ x, y, width, height, fill }: BarProps) => {
  const depth = 8;
  const topPoints = `${x},${y} ${x + width},${y} ${x + width + depth},${y - depth} ${x + depth},${y - depth}`;
  const sidePoints = `${x + width},${y} ${x + width},${y + height} ${x + width + depth},${y + height - depth} ${x + width + depth},${y - depth}`;
  
  return (
    <g>
      {/* Main face */}
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      {/* Top face */}
      <polygon points={topPoints} fill={fill} opacity={0.8} />
      {/* Side face */}
      <polygon points={sidePoints} fill={fill} opacity={0.6} />
    </g>
  );
};

const TrendChart = ({ 
  data, 
  title,
  currencyType,
  hideAmount,
  availableCurrencies
}: { 
  data: TrendData[]; 
  title: string;
  currencyType: string;
  hideAmount: boolean;
  availableCurrencies?: Currency[];
}) => {
  const [chartType, setChartType] = useState<ChartType>('area');
  
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (chartType) {      case 'bar':
        return (
          <BarChart {...commonProps}>
            <defs>
              <linearGradient id={`barGradient${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate} 
              stroke="var(--text)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatCompactCurrency(value, currencyType, hideAmount, availableCurrencies)}
              stroke="var(--text)"
              fontSize={12}
              width={60}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} currencyType={currencyType} hideAmount={hideAmount} availableCurrencies={availableCurrencies} />} />
            <Bar 
              dataKey="amount" 
              fill={`url(#barGradient${title})`}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
        case '3d':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate} 
              stroke="var(--text)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatCompactCurrency(value, currencyType, hideAmount, availableCurrencies)}
              stroke="var(--text)"
              fontSize={12}
              width={60}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} currencyType={currencyType} hideAmount={hideAmount} availableCurrencies={availableCurrencies} />} />
            <Bar 
              dataKey="amount" 
              fill="var(--color-secondary)"
              shape={(props: unknown) => <ThreeDBar {...(props as BarProps)} />}
            />
          </BarChart>
        );
        default: // area chart
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate} 
              stroke="var(--text)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatCompactCurrency(value, currencyType, hideAmount, availableCurrencies)}
              stroke="var(--text)"
              fontSize={12}
              width={60}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} currencyType={currencyType} hideAmount={hideAmount} availableCurrencies={availableCurrencies} />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-secondary)"
              fillOpacity={1}
              fill={`url(#gradient${title})`}
              strokeWidth={2}
            />
          </AreaChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          {title}
          <StyledTooltip 
            content="Visualizes your spending patterns over time. Switch between different chart types for better visualization of large amounts."
            position="top-start"
            maxWidth={300}
          >
            <FaInfoCircle className="w-4 h-4 text-[var(--text)]/50 cursor-pointer" />
          </StyledTooltip>
        </h3>
        
        {/* Chart Type Switcher */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('area')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'area' 
                ? 'bg-[var(--color-secondary)] text-[var(--bg)]' 
                : 'bg-[var(--bgSecondary)] text-[var(--text)]/60 hover:text-[var(--text)]'
            }`}
            title="Area Chart"
          >
            <FaChartArea className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'bar' 
                ? 'bg-[var(--color-secondary)] text-[var(--bg)]' 
                : 'bg-[var(--bgSecondary)] text-[var(--text)]/60 hover:text-[var(--text)]'
            }`}
            title="Bar Chart"
          >
            <FaChartBar className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('3d')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === '3d' 
                ? 'bg-[var(--color-secondary)] text-[var(--bg)]' 
                : 'bg-[var(--bgSecondary)] text-[var(--text)]/60 hover:text-[var(--text)]'
            }`}
            title="3D Chart"
          >
            <FaExpandArrowsAlt className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      {/* Chart Info */}
      <div className="mt-4 text-xs text-[var(--text)]/60 flex justify-between">
        <span>Chart Type: {chartType.toUpperCase()}</span>
        <span>Compact notation for large amounts</span>
      </div>
    </motion.div>
  );
};

export default function Trends({ currencyType, hideAmount }: TrendsProps & { hideAmount: boolean }) {
  const {
    data: trends,
    isError,
  } = useQuery({
    queryKey: ["dashboard-trends"],
    queryFn: dashboardRequests.getTrends,
  });

  // Fetch available currencies for proper formatting
  const { data: exchangeRatesData } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: exchangeRatesRequests.getExchangeRates,
  });
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
        availableCurrencies={exchangeRatesData?.currencies}
      />
      <TrendChart 
        data={trends.monthlyTrends} 
        title="Monthly Expenses"
        currencyType={currencyType}
        hideAmount={hideAmount}
        availableCurrencies={exchangeRatesData?.currencies}
      />
    </div>
  );
}
