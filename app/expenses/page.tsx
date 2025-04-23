"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { expenseRequests } from "./_requests";
import { formatCurrency } from "@/components/utils/formatCurrency";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import { DeleteConfirmationModal } from "@/components/UI/DeleteConfirmationModal";
import debounce from "lodash/debounce";

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Create a memoized debounced function
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  // Cleanup the debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  // Handle search input changes
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
    <div className="container mx-auto p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)]">Expenses</h1>

        <Link href="/expenses/add">
          <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--border-radius)] hover:opacity-90 cursor-pointer flex items-center gap-2 transition-all active:scale-95">
            <FaPlus size={14} />
            Add Expense
          </button>
        </Link>
      </div>

      <div className="bg-[var(--bg)] rounded-[var(--border-radius)] border border-[var(--border-color)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-50" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search expenses..."
              className="input pl-10 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--bgSecondary)]">
              <tr>
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
                <th className="w-[5%] px-6 py-4 text-left text-sm font-semibold text-[var(--text)] border-b border-[var(--border-color)]">
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
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bgSecondary)] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-[var(--text)]">
                      {format(new Date(expense.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{expense.category.icon}</span>
                        <span className="text-[var(--text)]">
                          {expense.category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text)]">
                      <div className="line-clamp-2">{expense.notes}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-[var(--text)] font-medium">
                          {formatCurrency(expense.amount)} {expense.moneySource.currency}
                        </span>
                        <span className="text-xs opacity-60">
                          {formatCurrency(expense.amountInPreferredCurrency)} USD
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text)]">
                      {expense.moneySource.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-all active:scale-95 cursor-pointer"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && expensesResponse?.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-[var(--text)]">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {expensesResponse && expensesResponse.totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--text)]">
                Page {page} of {expensesResponse.totalPages}
              </span>
              <span className="text-sm text-[var(--text)]">
                ({expensesResponse.data.length} of {expensesResponse.totalCount} expenses)
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)]"
              >
                Previous
              </button>
              {page > 2 && (
                <button
                  onClick={() => setPage(1)}
                  className="px-4 py-2 bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)]"
                >
                  1
                </button>
              )}
              {page > 3 && <span className="px-2 py-2 text-[var(--text)]">...</span>}
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)]"
                >
                  {page - 1}
                </button>
              )}
              <button
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--border-radius)]"
              >
                {page}
              </button>
              {page < expensesResponse.totalPages && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)]"
                >
                  {page + 1}
                </button>
              )}
              {page < expensesResponse.totalPages - 2 && <span className="px-2 py-2 text-[var(--text)]">...</span>}
              {page < expensesResponse.totalPages - 1 && (
                <button
                  onClick={() => setPage(expensesResponse.totalPages)}
                  className="px-4 py-2 bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)]"
                >
                  {expensesResponse.totalPages}
                </button>
              )}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= expensesResponse.totalPages}
                className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

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
