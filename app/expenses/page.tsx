"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { expenseRequests } from "./_requests";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import { DeleteConfirmationModal } from "@/components/UI/DeleteConfirmationModal";
import debounce from "lodash/debounce";
import { useAppSettings } from "@/providers/AppSettingsProvider";

export default function ExpensesPage() {
  const {preferredCurrency} = useAppSettings();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const { data: expensesResponse, isLoading } = useQuery({
    queryKey: ["expenses", page, search],
    queryFn: () => expenseRequests.getExpenses(page, search),
  });

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: expenseRequests.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedExpenseId(null);
    },
    onError: () => {
      toast.error("Failed to delete expense");
    },
  });

  const handleDelete = (id: string) => {
    setSelectedExpenseId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4 sm:gap-0">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-[var(--text)]"
        >
          Expenses
        </motion.h1>

        <Link href="/expenses/add">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-[var(--border-radius)] cursor-pointer flex items-center gap-2 transition-all w-full sm:w-auto justify-center sm:justify-start"
          >
            <FaPlus size={14} />
            Add Expense
          </motion.button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg)] rounded-[var(--border-radius)] border border-[var(--border-color)] overflow-hidden shadow-lg"
      >
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bgSecondary)]">
          <div className="relative max-w-full sm:max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search expenses..."
              className="input w-full pr-4 transition-all duration-200 focus:shadow-lg"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* Desktop view - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bgSecondary)] transition-colors">
                <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-[var(--text)] border-b border-[var(--border-color)]">
                  Date
                </th>
                <th className="w-[20%] px-6 py-4 text-left text-sm font-semibold text-[var(--text)] border-b border-[var(--border-color)]">
                  Category
                </th>
                <th className="w-[25%] px-6 py-4 text-left text-sm font-semibold text-[var(--text)] border-b border-[var(--border-color)]">
                  Notes
                </th>
                <th className="w-[20%] px-6 py-4 text-left text-sm font-semibold text-[var(--text)] border-b border-[var(--border-color)]">
                  Amount
                </th>
                <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-[var(--text)] border-b border-[var(--border-color)]">
                  Money Source
                </th>
                <th className="w-[5%] px-6 py-4 text-center text-sm font-semibold text-[var(--text)] border-b border-[var(--border-color)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {expensesResponse?.data.map((expense) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ backgroundColor: "var(--bgSecondary)" }}
                    className="border-b border-[var(--border-color)] transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-[var(--text)]">
                      <motion.div whileHover={{ x: 5 }} className="transition-all">
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </motion.div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-xl">{expense.category.icon}</span>
                        <span className="text-[var(--text)]">
                          {expense.category.name}
                        </span>
                      </motion.div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text)]">
                      <motion.div
                        className="line-clamp-2"
                        whileHover={{ lineClamp: 'none' }}
                      >
                        {expense.notes}
                      </motion.div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.div
                        className="flex flex-col"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-[var(--text)] font-medium">
                          {expense.amount} {expense.moneySource.currency}
                        </span>
                        <span className="text-xs opacity-60">
                          {expense.amountInPreferredCurrency && expense.amountInPreferredCurrency.toFixed(2) + " " + preferredCurrency}
                        </span>
                      </motion.div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-[var(--text)]"
                      >
                        {expense.moneySource.name}
                      </motion.div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgb(239 68 68 / 0.2)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 text-red-500 rounded-full transition-colors"
                        >
                          <FaTrash size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
                      <span className="text-[var(--text)] opacity-70">Loading expenses...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && expensesResponse?.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-[var(--text)] opacity-70">No expenses found</p>
                      <Link href="/expenses/add">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm px-4 py-2 bg-[var(--color-primary)] text-white rounded-full"
                        >
                          Add your first expense
                        </motion.button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view - Cards */}
        <div className="md:hidden">
          <AnimatePresence mode="popLayout">
            {expensesResponse?.data.map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border-b border-[var(--border-color)] p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{expense.category.icon}</span>
                    <span className="text-[var(--text)] font-medium">{expense.category.name}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-500 rounded-full"
                  >
                    <FaTrash size={14} />
                  </motion.button>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[var(--text)] text-sm opacity-70">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </span>
                  <div className="text-right">
                    <div className="text-[var(--text)] font-medium">
                      {expense.amount} {expense.moneySource.currency}
                    </div>
                    {expense.amountInPreferredCurrency && (
                      <div className="text-xs opacity-60">
                        {expense.amountInPreferredCurrency.toFixed(2)} {preferredCurrency}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[var(--text)] text-sm">Source:</span>
                  <span className="text-[var(--text)]">{expense.moneySource.name}</span>
                </div>
                
                {expense.notes && (
                  <div className="text-[var(--text)] text-sm mt-2 py-2 border-t border-[var(--border-color)] opacity-80">
                    {expense.notes}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="px-6 py-8 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
                <span className="text-[var(--text)] opacity-70">Loading expenses...</span>
              </div>
            </div>
          )}
          
          {!isLoading && expensesResponse?.data.length === 0 && (
            <div className="px-6 py-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-[var(--text)] opacity-70">No expenses found</p>
                <Link href="/expenses/add">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm px-4 py-2 bg-[var(--color-primary)] text-white rounded-full"
                  >
                    Add your first expense
                  </motion.button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {expensesResponse && expensesResponse.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bgSecondary)] gap-3"
          >
            <div className="flex items-center gap-2 text-center sm:text-left w-full sm:w-auto">
              <span className="text-sm text-[var(--text)]">
                Page {page} of {expensesResponse.totalPages}
              </span>
              <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">
                ({expensesResponse.data.length} of {expensesResponse.totalCount} expenses)
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)] border border-[var(--border-color)] hover:bg-[var(--bg)] transition-colors"
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (expensesResponse?.totalPages || 1)}
                className="px-4 py-2 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)] border border-[var(--border-color)] hover:bg-[var(--bg)] transition-colors"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedExpenseId && deleteExpense(selectedExpenseId)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
