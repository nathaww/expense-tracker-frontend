"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaWallet, FaUniversity, FaCreditCard, FaTrash } from "react-icons/fa";
import { formatCurrency } from "@/components/utils/formatCurrency";
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
        className="relative w-full p-6 h-64 rounded-[var(--border-radius)] overflow-hidden group"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
          backgroundSize: '200% 100%',
          backgroundPosition: 'left bottom',
          transition: 'background-position 0.5s ease-in-out',
        }}
        whileHover={{
          backgroundPosition: ['left bottom', 'right bottom']
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-[0.03]" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <Icon className="text-white text-3xl" />
            <div className="flex items-center gap-2">
              <UpdateMoneySourceModal moneySource={source} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
                onClick={() => setIsDeleteOpen(true)}
              >
                <FaTrash className="w-4 h-4 text-white" />
              </motion.button>
              {source.isDefault && (
                <span className="text-white font-mono ml-2">DEFAULT</span>
              )}
            </div>
          </div>

          <h3 className="text-white text-xl font-bold mb-4">{source.name}</h3>
        
          <div className="grid grid-cols-2 gap-4 text-white/90">
            <div>
              <p className="text-sm opacity-75">Balance</p>
              <p className="font-mono text-lg">
                {formatCurrency(source.balance)} {source.currency}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-75">Budget</p>
              <p className="font-mono text-lg">
                {formatCurrency(source.budget)} {source.currency}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-white/75">
              In preferred currency:
              <span className="ml-2 font-mono">
                {formatCurrency(source.balanceInPreferredCurrency)} USD
              </span>
            </p>
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