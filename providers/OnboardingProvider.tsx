"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

interface OnboardingContextType {
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  markOnboardingCompleted: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'expense-tracker-onboarding-completed';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    const completedUsers = JSON.parse(localStorage.getItem(ONBOARDING_STORAGE_KEY) || '[]');
    const hasCompleted = completedUsers.includes(user.id);
    
    setHasCompletedOnboarding(hasCompleted);
    setIsNewUser(!hasCompleted);
  }, [user, isAuthenticated]);

  const markOnboardingCompleted = () => {
    if (!user) return;
    
    const completedUsers = JSON.parse(localStorage.getItem(ONBOARDING_STORAGE_KEY) || '[]');
    if (!completedUsers.includes(user.id)) {
      completedUsers.push(user.id);
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(completedUsers));
    }
    
    setHasCompletedOnboarding(true);
    setIsNewUser(false);
  };

  const resetOnboarding = () => {
    if (!user) return;
    
    const completedUsers = JSON.parse(localStorage.getItem(ONBOARDING_STORAGE_KEY) || '[]');
    const filteredUsers = completedUsers.filter((id: string) => id !== user.id);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(filteredUsers));
    
    setHasCompletedOnboarding(false);
    setIsNewUser(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isNewUser,
        hasCompletedOnboarding,
        markOnboardingCompleted,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
