'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import './InsightsMarkdown.css';

export const InsightsCard = ({ insights }: { insights: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Set RGB CSS variables for more advanced styling
  React.useEffect(() => {
    const convertHexToRgb = (hex: string) => {
      // Remove the # if it exists
      hex = hex.replace('#', '');
      
      // Convert 3-digit hex to 6-digit hex
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      // Parse the values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    };
    
    // Get CSS variables
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary').trim();
    const secondaryColor = getComputedStyle(root).getPropertyValue('--color-secondary').trim();
    const bgColor = getComputedStyle(root).getPropertyValue('--bg').trim();
    const bgSecondaryColor = getComputedStyle(root).getPropertyValue('--bgSecondary').trim();
    
    // Set RGB values
    if (primaryColor) {
      root.style.setProperty('--color-primary-rgb', convertHexToRgb(primaryColor));
    }
    if (secondaryColor) {
      root.style.setProperty('--color-secondary-rgb', convertHexToRgb(secondaryColor));
    }
    if (bgColor) {
      root.style.setProperty('--bg-rgb', convertHexToRgb(bgColor));
    }
    if (bgSecondaryColor) {
      root.style.setProperty('--bgSecondary-rgb', convertHexToRgb(bgSecondaryColor));
    }
    
    // Set shadow color based on theme
    const isDark = bgColor && 
      (bgColor.includes('#0') || bgColor.includes('#1') || bgColor.includes('#2') || bgColor.includes('#3'));
    root.style.setProperty('--shadow-rgb', isDark ? '0,0,0' : '100,100,100');
  }, []);
  
  // Parse and format the markdown content
  const formattedInsights = React.useMemo(() => {
    try {
      // Remove code block markers and parse JSON escape sequences
      const cleanedContent = insights.replace(/```\n|```/g, '').replace(/\\n/g, '\n').replace(/\\"/g, '"');
      
      // Add special styling to emoji prefixes before parsing
      const styledContent = cleanedContent
        .replace(/^(💸.*)/gm, '<div class="emoji-heading">$1</div>') // Use custom styled headings
        .replace(/^(🕰.*)/gm, '<div class="emoji-heading">$1</div>')
        .replace(/^(⚠️.*)/gm, '<div class="warning-note">$1</div>')
        .replace(/^(👍.*)/gm, '<div class="positive-note">$1</div>')
        .replace(/^(📝.*)/gm, '<div class="advice-note">$1</div>');
        
      // Configure marked options
      marked.use({
        breaks: true,
        gfm: true
      });
      
      // Parse markdown to HTML
      return marked.parse(styledContent);
    } catch (error) {
      console.error("Error parsing insights:", error);
      return insights;
    }
  }, [insights]);

  return (
    <motion.div 
      className="relative p-6 md:p-8 rounded-[var(--border-radius)] border-2 border-[var(--color-secondary)] bg-[var(--bg)] shadow-lg overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        boxShadow: "0 15px 30px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.1)",
        borderColor: "var(--color-primary)"
      }}
      style={{
        backgroundImage: "linear-gradient(135deg, var(--bg) 0%, rgba(var(--color-primary-rgb), 0.03) 100%)"
      }}
    >
      {/* Card Decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M42.7,-62.9C53.9,-54.7,61.1,-40.6,65.7,-26.5C70.3,-12.4,72.2,1.6,69.8,15.3C67.3,29,60.5,42.3,49.9,50.3C39.3,58.2,24.9,60.8,10.5,63.5C-3.9,66.3,-18.3,69.2,-31.2,65.1C-44.1,61.1,-55.6,50.1,-63.2,37.1C-70.8,24.1,-74.5,9.1,-72.8,-4.8C-71,-18.6,-63.7,-31.4,-53.6,-40.3C-43.5,-49.3,-30.6,-54.4,-17.9,-61.6C-5.3,-68.8,7.1,-78.2,20,-77.4C32.9,-76.6,46.2,-65.5,54.4,-52.9Z" />
        </svg>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="relative flex items-center font-bold text-xl md:text-2xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
          <span className="mr-2">✨</span>
          Personalized Insights
        </h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
        >
          {isExpanded ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span>Collapse</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>Expand</span>
            </>
          )}
        </button>
      </div>

      <motion.div 
        className="prose prose-sm max-w-none dark:prose-invert markdown-content relative"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          height: isExpanded ? 'auto' : '400px' 
        }}
        transition={{ 
          opacity: { delay: 0.2, duration: 0.5 },
          height: { duration: 0.5 }
        }}
        style={{ 
          overflow: isExpanded ? 'visible' : 'hidden'
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: formattedInsights }} />
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
        )}
      </motion.div>
    </motion.div>
  );
};