"use client";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loader from "@/components/UI/Loader";
import { DeleteConfirmationModal } from "@/components/UI/DeleteConfirmationModal";
import { userRequests, appSettingsRequests } from "./_requests";
import { toast } from "sonner";
import { ProfileSection } from "@/components/Settings/ProfileSection";
import { ThemeSection } from "@/components/Settings/ThemeSection";
import { CurrencySection } from "@/components/Settings/CurrencySection";
import { DangerZone } from "@/components/Settings/DangerZone";
import { useOnboarding } from "@/providers/OnboardingProvider";

const Settings = () => {
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();
  const { logout, isAuthenticated } = useAuth();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: userRequests.getProfile,
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: appSettingsRequests.getAppSettings,
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: userRequests.deleteAccount,
    onSuccess: () => {
      logout();
      toast.success("Account deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !profile || !settings || isLoadingSettings) {
    return <Loader />;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-[var(--text)]"
      >
        Settings
      </motion.h1>
      
      <ProfileSection
        profile={profile}
      />

      <CurrencySection settings={settings} />

      <ThemeSection />

      {/* Onboarding Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--bg)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">
          App Tour & Help
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-[var(--text)]/70 text-sm mb-3">
              Need a refresher on how to use the app? Restart the interactive tour to walk through all features again.
            </p>
            <button
              onClick={() => {
                resetOnboarding();
                router.push('/dashboard');
                toast.success('Tour reset! Redirecting to dashboard...');
              }}
              className="btn"
            >
              <span>🎯</span>
              Restart App Tour
            </button>
          </div>
        </div>
      </motion.div>

      <DangerZone onDeleteAccount={() => setIsDeleteOpen(true)} />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={deleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Settings;