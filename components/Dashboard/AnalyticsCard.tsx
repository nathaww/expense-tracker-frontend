'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BiTrendingDown, BiTrendingUp } from 'react-icons/bi';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  data: number[];
  delay: number;
  illustration?: React.ReactNode;
}

export default function AnalyticsCard({ 
  title, 
  value, 
  change, 
  data, 
  delay,
  illustration 
}: AnalyticsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Create mini chart data points
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const normalizedData = data.map(val => ((val - minValue) / (maxValue - minValue)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
        change.isPositive ? 'bg-green-400' : 'bg-red-400'
      }`} />
      
      {/* Main card */}
      <div className="relative p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] backdrop-blur-sm overflow-hidden">
        
        {/* Background illustration */}
        <div className="absolute -top-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
          {illustration && (
            <motion.div
              animate={isHovered ? { rotate: "5deg", scale: 1.1 } : { rotate: "0deg", scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-32 h-32"
            >
              {illustration}
            </motion.div>
          )}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[var(--text)]/70 uppercase tracking-wide">
            {title}
          </h3>
          
          <motion.div
            animate={isHovered ? { scale: 1.2, rotate: "10deg" } : { scale: 1, rotate: "0deg" }}
            className={`p-2 rounded-lg ${
              change.isPositive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
            }`}
          >
            {change.isPositive ? 
              <BiTrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" /> :
              <BiTrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
            }
          </motion.div>
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="mb-4"
        >
          <p className="text-3xl font-bold text-[var(--text)] mb-2">
            {value}
          </p>
          
          <div className={`flex items-center gap-2 text-sm font-medium ${
            change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <span>{change.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(change.value)}% {change.period}</span>
          </div>
        </motion.div>

        {/* Mini chart */}
        <div className="relative h-16 mb-4">
          <motion.svg
            className="w-full h-full"
            viewBox="0 0 200 60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
          >
            {/* Chart line */}
            <motion.path
              d={`M 0,${60 - normalizedData[0] * 0.6} ${normalizedData.map((point, index) => 
                `L ${(index / (normalizedData.length - 1)) * 200},${60 - point * 0.6}`
              ).join(' ')}`}
              fill="none"
              stroke={change.isPositive ? '#10b981' : '#ef4444'}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: delay + 0.5 }}
            />
            
            {/* Chart area */}
            <motion.path
              d={`M 0,60 L 0,${60 - normalizedData[0] * 0.6} ${normalizedData.map((point, index) => 
                `L ${(index / (normalizedData.length - 1)) * 200},${60 - point * 0.6}`
              ).join(' ')} L 200,60 Z`}
              fill={`url(#gradient-${change.isPositive ? 'green' : 'red'})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.3 : 0.1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gradient-green" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Animated dots on hover */}
          {isHovered && normalizedData.map((point, index) => (
            <motion.div
              key={index}
              className={`absolute w-2 h-2 rounded-full ${
                change.isPositive ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{
                left: `${(index / (normalizedData.length - 1)) * 100}%`,
                top: `${100 - point * 0.6}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>

        {/* Progress indicators */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 rounded-full flex-1 ${
                i < 3 ? (change.isPositive ? 'bg-green-400' : 'bg-red-400') : 'bg-[var(--bgSecondary)]'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: delay + 0.6 + (i * 0.1) }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
