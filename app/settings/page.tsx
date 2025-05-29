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

const Settings = () => {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
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
      </motion.h1>      <ProfileSection 
        profile={profile} 
      />
      
      <CurrencySection settings={settings} />
      
      <ThemeSection />

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