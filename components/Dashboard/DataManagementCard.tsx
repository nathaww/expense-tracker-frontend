'use client';

import { motion } from 'framer-motion';
import { FaDownload, FaUpload, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { dashboardRequests } from '@/app/dashboard/_requests';
import { toast } from 'sonner';
import { useRef, useState } from 'react';

interface DataManagementCardProps {
  title: string;
  description: string;
  type: 'export' | 'import';
}

export default function DataManagementCard({ title, description, type }: DataManagementCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { mutate: exportData, isPending: isExporting } = useMutation({
    mutationFn: dashboardRequests.exportData,
    onSuccess: (data) => {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast.success('Data exported successfully!');
    },
    onError: () => {
      toast.error('Failed to export data');
    },
  });

  // Import data mutation
  const { mutate: importData, isPending: isImporting } = useMutation({
    mutationFn: dashboardRequests.importData,
    onSuccess: () => {
      toast.success('Data imported successfully! Please refresh the page to see changes.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error('Failed to import data');
    },
  });

  const handleExport = () => {
    exportData();
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast.error('Please select a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        if (!jsonData.user || !jsonData.expenses || !jsonData.categories || !jsonData.moneySources) {
          toast.error('Invalid file format. Please select a valid backup file.');
          return;
        }

        importData(jsonData);
      } catch {
        toast.error('Invalid JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);

    event.target.value = '';
  };

  const handleClick = () => {
    if (type === 'export') {
      handleExport();
    } else {
      handleImport();
    }
  };
  const isLoading = isExporting || isImporting;
  const Icon = type === 'export' ? FaUpload : FaDownload;
  const gradient = type === 'export'
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group cursor-pointer"
        onClick={handleClick}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          style={{ background: gradient }}
        />

        {/* Main card */}
        <div className="relative p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] backdrop-blur-sm overflow-hidden">

          {/* Floating illustration */}
          <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <motion.div
              transition={{ duration: 0.3 }}
              className="w-24 h-24"
            >
              <FaDatabase size={96} />
            </motion.div>
          </div>

          {/* Security badge */}
          <div className="absolute top-4 right-4">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium"
            >
              <FaShieldAlt size={10} />
              Secure
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                transition={{ duration: 0.6 }}
                className="p-4 rounded-xl"
                style={{ background: gradient }}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text)]/60">
                  {description}
                </p>
              </div>
            </div>

            {/* Action button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className="w-full px-4 py-3 cursor-pointer rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: gradient }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: "360deg" }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  {type === 'export' ? 'Exporting...' : 'Importing...'}
                </>
              ) : (
                <>
                  <Icon size={16} />
                  {type === 'export' ? 'Export Data' : 'Import Data'}
                </>
              )}
            </motion.button>
          </div>

          {/* Animated particles */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ background: gradient }}
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    scale: 0
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    y: [0, -20, -40]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Hidden file input for import */}
      {type === 'import' && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      )}
    </>
  );
}
