'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import './InsightsMarkdown.css';

interface InsightsCardProps {
  insights: string;
}

export const InsightsCard = ({ insights }: InsightsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formattedContent = React.useMemo(() => {
    try {
      // Clean up the content first (remove code block markers and parse JSON escape sequences)
      const cleanedContent = insights.replace(/```\n|```/g, '').replace(/\\n/g, '\n').replace(/\\"/g, '"');
      
      // Process special emoji paragraphs with HTML classes for styling
      let processedContent = cleanedContent;
      
      // Add classes to emoji-prefixed paragraphs for styling
      processedContent = processedContent
        .replace(/^(💸.*$)/gm, '<div class="emoji-heading">$1</div>')
        .replace(/^(🕰.*$)/gm, '<div class="emoji-heading">$1</div>')
        .replace(/^(⚠️.*$)/gm, '<div class="warning-note">$1</div>')
        .replace(/^(👍.*$)/gm, '<div class="positive-note">$1</div>')
        .replace(/^(📝.*$)/gm, '<div class="advice-note">$1</div>');      // Configure marked options with proper styling
      marked.use({
        breaks: true, // Enable line breaks
        gfm: true     // Enable GitHub Flavored Markdown
      });
      return marked.parse(processedContent);
    } catch (error) {
      console.error("Error parsing insights:", error);
      return insights;
    }
  }, [insights]);

  return (
    <motion.div 
      className={`p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md ${isExpanded ? 'h-auto' : 'h-full'} overflow-auto`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
    >      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            Personalized Insights
          </span>
        </h3>        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-xs px-3 py-1 rounded-md bg-[var(--bgSecondary)] text-[var(--text)] hover:bg-[var(--bgSecondary)]/80 transition-colors flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Collapse
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Expand
            </>
          )}
        </button>
      </div>      <motion.div 
        className="prose prose-sm max-w-none dark:prose-invert markdown-content overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          height: isExpanded ? 'auto' : '400px' 
        }}
        transition={{ 
          opacity: { delay: 0.2, duration: 0.5 },
          height: { duration: 0.5 }
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
        )}
      </motion.div>
    </motion.div>
  );
};
