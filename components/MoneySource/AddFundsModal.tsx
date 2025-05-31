'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moneySourceRequests, MoneySource } from '@/app/money-sources/_requests';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes, FaDollarSign } from 'react-icons/fa';
import { toast } from 'sonner';
import * as Dialog from "@radix-ui/react-dialog";

interface AddFundsModalProps {
  moneySource: MoneySource;
}

export const AddFundsModal = ({ moneySource }: AddFundsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const queryClient = useQueryClient();

  const { mutate: addFunds, isPending } = useMutation({
    mutationFn: (amount: number) => moneySourceRequests.addFunds(moneySource.id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['money-sources'] });
      toast.success(`Successfully added ${amount} ${moneySource.currency} to ${moneySource.name}`);
      setIsOpen(false);
      setAmount('');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Failed to add funds');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    addFunds(numAmount);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
          title="Add Funds"
        >
          <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </motion.button>
      </Dialog.Trigger>      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-md bg-[var(--bg)] rounded-[var(--border-radius)] shadow-xl p-4 sm:p-6 z-20 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Dialog.Title className="text-xl sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <FaDollarSign className="text-[var(--color-primary)]" />
              Add Funds
            </Dialog.Title>
            <Dialog.Close className="text-[var(--text)] hover:opacity-70 p-1 cursor-pointer">
              <FaTimes className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div className="mb-4 p-4 bg-[var(--bgSecondary)] rounded-[var(--border-radius)]">
            <p className="text-sm text-[var(--text)]/70 mb-1">Money Source</p>
            <p className="font-semibold text-[var(--text)]">{moneySource.name}</p>
            <p className="text-sm text-[var(--text)]/70 mt-2">Current Balance</p>
            <p className="font-mono text-lg text-[var(--color-primary)]">
              {moneySource.balance} {moneySource.currency}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-[var(--text)] mb-2">
                Amount to Add ({moneySource.currency})
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="input w-full pl-8"
                  required
                  disabled={isPending}
                />
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text)]/50 w-3 h-3" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Dialog.Close className="flex-1 px-4 py-2 text-[var(--text)] border border-[var(--border-color)] rounded-[var(--border-radius)] hover:bg-[var(--bgSecondary)] transition-colors cursor-pointer">
                Cancel
              </Dialog.Close>
              <motion.button
                type="submit"
                disabled={isPending || !amount || parseFloat(amount) <= 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 btn flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus className="w-4 h-4" />
                    Add Funds
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
