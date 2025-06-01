'use client';

import AuthPattern from '@/components/UI/AuthPattern';
import { FaMoneyBillWave } from 'react-icons/fa';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* Left side - Pattern */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <AuthPattern />
        
        {/* Brand overlay on pattern */}
        <div className="absolute inset-0 flex flex-col justify-center items-center z-30 bg-gradient-to-r from-transparent via-[var(--bg)]/10 to-transparent">
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl shadow-2xl">
                <FaMoneyBillWave className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-4">
              Expense Tracker
            </h1>
            <p className="text-xl text-[var(--text)]/80 max-w-md mx-auto leading-relaxed">
              Take control of your finances with intelligent tracking and insightful analytics
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-[var(--bg)]">
        {/* Mobile brand header */}
        <div className="lg:hidden mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl">
              <FaMoneyBillWave className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Expense Tracker
            </h1>
          </div>
        </div>

        {/* Auth content */}
        <div className="w-full max-w-md space-y-8">
          {/* Title section */}
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text)] mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[var(--text)]/60">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form content - no card styling, blends with background */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
