"use client";

import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { appSettingsRequests } from '@/app/settings/_requests';

interface DashboardControlsProps {
  hideAmounts: boolean;
  refetch: () => Promise<void>;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({ hideAmounts, refetch }) => {

  const { mutate: updateAppSettings } = useMutation({
    mutationFn: appSettingsRequests.updateAppSettings,
    onSuccess: () => {
      refetch();
    },
  });

  const toggleHideAmounts = () => {
    updateAppSettings({
      hideAmounts: !hideAmounts
    });
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