"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useFloating, 
  autoUpdate, 
  offset, 
  flip, 
  shift, 
  arrow, 
  useHover, 
  useFocus, 
  useDismiss, 
  useRole, 
  useInteractions,
  Placement 
} from '@floating-ui/react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: Placement;
  delay?: number;
  maxWidth?: number;
  className?: string;
}

export const StyledTooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  maxWidth = 300,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const arrowRef = useRef(null);
  
  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Setup floating tooltip with automatic positioning
  const { x, y, strategy, refs, middlewareData, placement, context } = useFloating({
    placement: position,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8),  // Space between trigger and tooltip
      flip(),     // Flip to opposite side if needed
      shift({padding: 5}),  // Shift to stay in viewport
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,  // Update position on scroll/resize
  });
  // Interaction hooks
  const hover = useHover(context, {
    delay: {
      open: delay,
      close: 200, // Increased delay for hover out to prevent flicker
    },
    restMs: 40, // Small delay to prevent flickering on mouseover
    // Don't use hover on touch devices
    enabled: !isTouchDevice,
  });
  
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  
  // Merge all interactions
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);
  
  // Handle touch on mobile devices
  const handleTouch = () => {
    if (isTouchDevice) {
      setIsOpen(!isOpen);
      
      // Auto-hide after 3 seconds on mobile
      if (!isOpen) {
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    }
  };

  // Add touch handlers to reference props
  const referenceProps = getReferenceProps({
    onClick: handleTouch,
    ...(!isTouchDevice ? {} : { onMouseEnter: undefined, onMouseLeave: undefined }),
  });
  return (
    <div className={`inline-block ${className}`} ref={refs.setReference} {...referenceProps}>
      {children}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={refs.setFloating}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: 9999,
              maxWidth: maxWidth,
              width: 'max-content',
              maxHeight: '80vh',
              overflowY: 'auto',
              pointerEvents: 'auto',
            }}
            {...getFloatingProps({
              className: "z-50",
              "aria-live": "polite",
              role: "tooltip",
            })}
          >            <div className="bg-[var(--bg-tooltip,#2c2c2c)] text-white text-xs sm:text-sm rounded-lg py-1 px-2 sm:py-2 sm:px-3 shadow-lg relative">
              <div className="overflow-hidden">{content}</div>
              
              {/* Arrow pointing to the target */}              {/* Only show arrow on larger screens */}
              {typeof window !== 'undefined' && window.innerWidth >= 640 && (
                <div 
                  ref={arrowRef}
                  className="absolute w-2 h-2 bg-[var(--bg-tooltip,#2c2c2c)] rotate-45 transform"
                  style={{
                    top: middlewareData.arrow?.y ?? '',
                    left: middlewareData.arrow?.x ?? '',
                    [placement.includes('top') ? 'bottom' : placement.includes('bottom') ? 'top' : 
                     placement.includes('left') ? 'right' : 'left']: '-4px',
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StyledTooltip;
