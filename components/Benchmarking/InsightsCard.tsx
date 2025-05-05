'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const InsightsCard = ({ insights }: { insights: string }) => {
  // Parse the escaped markdown content in the string
  const cleanInsights = () => {
    try {
      // Remove the code block markers and parse JSON escape sequences
      const cleanedContent = insights.replace(/```\n|```/g, '').replace(/\\n/g, '\n').replace(/\\"/g, '"');
      return cleanedContent;
    } catch (error) {
      console.error("Error parsing insights:", error);
      return insights;
    }
  };

  const insightsText = cleanInsights();

  // Process different sections of the text for styling
  const processedInsights = insightsText.split('\n\n').map((paragraph, index) => {
    if (paragraph.startsWith('💸') || paragraph.startsWith('🕰')) {
      // Headline or conclusion styling
      return (
        <motion.h3 
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          className="text-xl font-bold mb-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent"
        >
          {paragraph}
        </motion.h3>
      );
    } else if (paragraph.startsWith('⚠️')) {
      // Warning styling
      return (
        <motion.p 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + (0.1 * index) }}
          className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-[var(--border-radius)] text-amber-700 dark:text-amber-300"
        >
          {paragraph}
        </motion.p>
      );
    } else if (paragraph.startsWith('👍')) {
      // Positive feedback styling
      return (
        <motion.p 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + (0.1 * index) }}
          className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-[var(--border-radius)] text-green-700 dark:text-green-300"
        >
          {paragraph}
        </motion.p>
      );
    } else if (paragraph.startsWith('📝')) {
      // Advice styling
      return (
        <motion.p 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + (0.1 * index) }}
          className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-[var(--border-radius)] text-blue-700 dark:text-blue-300"
        >
          {paragraph}
        </motion.p>
      );
    } else {
      // Default paragraph styling
      return (
        <motion.p 
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + (0.1 * index) }}
          className="mb-4 text-[var(--text)]"
        >
          {paragraph}
        </motion.p>
      );
    }
  });

  return (
    <motion.div 
      className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md h-full overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
    >
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
        <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          Personalized Insights
        </span>
      </h3>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {processedInsights}
      </div>
    </motion.div>
  );
};