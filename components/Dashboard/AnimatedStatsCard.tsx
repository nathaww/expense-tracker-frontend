'use client';

import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { useState } from 'react';

interface AnimatedStatsCardProps {
  title: string;
  value: string;
  icon: IconType;
  delay: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient: string;
  illustration?: React.ReactNode;
}

export default function AnimatedStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  delay,
  trend,
  gradient,
  illustration
}: AnimatedStatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}     
       whileHover={{ 
        scale: 1.05,
        rotateY: "5deg",
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Background with gradient */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{ background: gradient }}
      />
      
      {/* Main card */}
      <div className="relative p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] backdrop-blur-sm overflow-hidden">
        
        {/* Floating animation elements */}
        <div className="absolute top-2 right-2 opacity-10">
          {illustration && (
            <motion.div
              animate={isHovered ? { scale: 1.1 } : { scale: 1}}
              transition={{ duration: 0.3 }}
            >
              {illustration}
            </motion.div>
          )}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              transition={{ duration: 0.6 }}
              className="p-3 rounded-xl"
              style={{ background: gradient }}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="text-sm font-medium text-[var(--text)]/70 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend.isPositive 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              {Math.abs(trend.value)}%
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="mb-2"
        >
          <p className="text-3xl font-bold text-[var(--text)] mb-1">
            {value}
          </p>        </motion.div>
      </div>
    </motion.div>
  );
}
