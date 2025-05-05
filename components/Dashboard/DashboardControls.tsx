"use client";

import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface DashboardControlsProps {
  hideAmounts: boolean;
  refetch: () => Promise<void>;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({ hideAmounts: initialHideAmounts, refetch }) => {
  // Use local state instead of API call
  const [hideAmounts, setHideAmounts] = useState(() => {
    // Initialize from localStorage or use the prop value
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem('hideAmounts');
      return savedValue !== null ? savedValue === 'true' : initialHideAmounts;
    }
    return initialHideAmounts;
  });

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('hideAmounts', hideAmounts.toString());
  }, [hideAmounts]);

  const toggleHideAmounts = () => {
    setHideAmounts(prevValue => !prevValue);
    // Still call refetch to update any components that depend on this value
    refetch();
  };

  return (
    <div className="flex items-center justify-end gap-2 mb-4">
      <button
        onClick={toggleHideAmounts}
        className="flex items-center justify-center transition-all cursor-pointer active:scale-95 hover:scale-105 w-9 h-9 rounded-full bg-[var(--bg)] border border-[var(--border-color)] hover:bg-[var(--bgSecondary)]"
        title={hideAmounts ? "Show amounts" : "Hide amounts"}
      >
        {hideAmounts ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </button>
    </div>
  );
};

export default DashboardControls;