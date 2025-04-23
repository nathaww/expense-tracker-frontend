"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaWallet, FaUniversity, FaCreditCard, FaTrash } from "react-icons/fa";
import { moneySourceRequests, MoneySource } from "./_requests";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import Loader from "@/components/UI/Loader";
import { AddMoneySourceModal } from "@/components/UI/AddMoneySourceModal";
import { UpdateMoneySourceModal } from "@/components/UI/UpdateMoneySourceModal";
import { DeleteConfirmationModal } from "@/components/UI/DeleteConfirmationModal";
import { toast } from "sonner";

const getIconComponent = (icon: string) => {
  const icons = {
    wallet: FaWallet,
    bank: FaUniversity,
    "credit-card": FaCreditCard
  };
  return icons[icon as keyof typeof icons] || FaCreditCard;
};

const Card = ({ source, index }: { source: MoneySource; index: number }) => {
  const Icon = getIconComponent(source.icon);
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { mutate: deleteMoneySource, isPending: isDeleting } = useMutation({
    mutationFn: () => moneySourceRequests.deleteMoneySource(source.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["money-sources"] });
      toast.success("Money source deleted successfully");
      setIsDeleteOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete money source");
    },
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative w-full p-6 h-auto rounded-[var(--border-radius)] overflow-hidden group bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"
      >
        <motion.div 
          className="absolute inset-0 bg-black/10"
          initial={false}
          animate={{ opacity: isHovered ? 0.2 : 0.1 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <motion.div
              animate={{ 
                rotate: isHovered ? [0, -10, 10, 0] : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-white/10 rounded-full"
            >
              <Icon className="text-white text-2xl" />
            </motion.div>

            <div className="flex items-center gap-2">
              <UpdateMoneySourceModal moneySource={source} />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                onClick={() => setIsDeleteOpen(true)}
              >
                <FaTrash className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>

          <div className="mb-6">
            <motion.h3 
              className="text-white text-xl font-bold mb-2"
              animate={{ x: isHovered ? 10 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {source.name}
              {source.isDefault && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Default
                </motion.span>
              )}
            </motion.h3>
            <p className="text-white/75 text-sm">
              Created {new Date(source.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <p className="text-white/75 text-sm mb-1">Balance</p>
              <p className="font-mono text-lg text-white">
                {source.balance} {source.currency}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <p className="text-white/75 text-sm mb-1">Budget</p>
              <p className="font-mono text-lg text-white">
                {source.budget} {source.currency}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMoneySource()}
        title="Delete Money Source"
        message={`Are you sure you want to delete "${source.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
};

const MoneySourcesPage = () => {
  const { data: moneySourcesResponse, isLoading } = useQuery({
    queryKey: ["money-sources"],
    queryFn: moneySourceRequests.getMoneySources,
  });

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <Loader />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-[var(--bgSecondary)] h-64 rounded-[var(--border-radius)]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[var(--text)]"
        >
          Money Sources
        </motion.h1>

        <AddMoneySourceModal />
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {moneySourcesResponse?.data?.map((source, index) => (
          <Card key={source.id} source={source} index={index} />
        ))}
      </motion.div>

      {moneySourcesResponse && moneySourcesResponse.totalCount > 0 && (
        <div className="mt-6 text-center text-[var(--text-secondary)]">
          Showing {moneySourcesResponse.data.length} of {moneySourcesResponse.totalCount} money sources
        </div>
      )}
    </div>
  );
};

export default MoneySourcesPage;