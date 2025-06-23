"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseRequests } from "./_requests";
import { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { FaPlus, FaSearch, FaTrash, FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import { DeleteConfirmationModal } from "@/components/UI/DeleteConfirmationModal";
import { UpdateExpenseModal } from "@/components/Expenses/UpdateExpenseModal";
import { ExpensesPageSkeleton } from "@/components/UI/SkeletonLoaders";
import debounce from "lodash/debounce";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { FilterToolbar, type BaseFilterParams } from "@/components/UI/FilterToolbar";
import { Pagination } from "@/components/UI/Pagination";
import { motion } from "framer-motion";

export default function ExpensesPage() {
  const { preferredCurrency } = useAppSettings();
  const queryClient = useQueryClient(); const [searchInput, setSearchInput] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  // Filter state
  const [filterParams, setFilterParams] = useState<BaseFilterParams>({
    page: 1,
    pageSize: 10,
    search: ""
  });
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => {
      setFilterParams((prev: BaseFilterParams) => ({ ...prev, search: value, page: 1 }));
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
  };  // Handler for filter changes from FilterToolbar
  const handleFilterChange = useCallback((newFilters: BaseFilterParams) => {
    setFilterParams((prev: BaseFilterParams) => ({ ...prev, ...newFilters }));
  }, []);

  // Handler for pagination
  const handlePageChange = useCallback((page: number) => {
    setFilterParams((prev: BaseFilterParams) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilterParams((prev: BaseFilterParams) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const { data: expensesResponse, isLoading } = useQuery({
    queryKey: ["expenses", filterParams],
    queryFn: () => expenseRequests.getExpenses(filterParams),
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

  const { mutate: bulkDeleteExpenses, isPending: isBulkDeleting } = useMutation({
    mutationFn: expenseRequests.bulkDeleteExpenses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success(`${selectedExpenseIds.length} expenses deleted successfully`);
      setIsBulkDeleteModalOpen(false);
      setSelectedExpenseIds([]);
    },
    onError: () => {
      toast.error("Failed to delete expenses");
    },
  });
  const handleDelete = (id: string) => {
    setSelectedExpenseId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenseIds(prev =>
      prev.includes(expenseId)
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExpenseIds.length === expensesResponse?.data.length) {
      setSelectedExpenseIds([]);
    } else {
      setSelectedExpenseIds(expensesResponse?.data.map(expense => expense.id) || []);
    }
  };

  const handleBulkDelete = () => {
    if (selectedExpenseIds.length > 0) {
      setIsBulkDeleteModalOpen(true);
    }
  };

  const confirmBulkDelete = () => {
    if (selectedExpenseIds.length > 0) {
      bulkDeleteExpenses(selectedExpenseIds);
    }
  };
  if (isLoading) {
    return <ExpensesPageSkeleton />;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4 sm:gap-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)]">
          Expenses
        </h1>

        <Link href="/expenses/add">
          <button
            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-[var(--border-radius)] cursor-pointer flex items-center gap-2 transition-all w-full sm:w-auto justify-center sm:justify-start hover:shadow-lg"
          >
            <FaPlus size={14} />
            Add Expense
          </button>
        </Link>
      </div>

      <div className="bg-[var(--bg)] rounded-[var(--border-radius)] border border-[var(--border-color)] overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[var(--border-color)] ">
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
        {/* Filter toolbar */}        
        <FilterToolbar
          onFilterChange={handleFilterChange}
          sortOptions={[
            { label: 'Date', value: 'date' },
            { label: 'Amount', value: 'amount' },
            { label: 'Category', value: 'category.name' },
            { label: 'Money Source', value: 'moneySource.name' },
            { label: 'Created At', value: 'createdAt' }
          ]}
        />{/* Desktop view - Table */}
        <div className="hidden md:block overflow-x-auto">
          {/* Bulk Actions Bar */}
          {selectedExpenseIds.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-[var(--border-color)] px-6 py-3 flex items-center justify-between">
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {selectedExpenseIds.length} expense{selectedExpenseIds.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FaTrash size={12} />
                Delete Selected
              </button>
            </div>
          )}

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bgSecondary)] transition-colors">
                <th className="w-[5%] px-6 py-4 text-left text-sm font-semibold text-[var(--text)] border-b border-[var(--border-color)]">
                  <input
                    type="checkbox"
                    checked={selectedExpenseIds.length === expensesResponse?.data.length && expensesResponse?.data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
            </thead>            <tbody>              {expensesResponse?.data.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-[var(--border-color)] hover:bg-[var(--bgSecondary)] transition-colors"
                >
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedExpenseIds.includes(expense.id)}
                      onChange={() => handleSelectExpense(expense.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text)]">
                    <div className="transition-all hover:translate-x-1">
                      {format(new Date(expense.date), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                      <span className="text-xl">{expense.category.icon}</span>
                      <span className="text-[var(--text)]">
                        {expense.category.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text)]">
                    <div className="line-clamp-2 hover:line-clamp-none">
                      {expense.notes}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col hover:scale-105 transition-transform">
                      <span className="text-[var(--text)] font-medium">
                        {expense.amount} {expense.moneySource.currency}
                      </span>
                      <span className="text-xs opacity-60">
                        {expense.amountInPreferredCurrency && expense.amountInPreferredCurrency.toFixed(2) + " " + preferredCurrency}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="hover:scale-105 transition-transform text-[var(--text)]">
                      {expense.moneySource.name}
                    </div>
                  </td>                    <td className="px-6 py-4 text-sm">
                    <div className="flex justify-center gap-2">
                      <UpdateExpenseModal expense={expense} />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-all cursor-pointer"
                        title="Edit Expense"
                      >
                        <FaTrashAlt className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}              {expensesResponse?.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-[var(--text)] opacity-70">No expenses found</p>
                      <Link href="/expenses/add">
                        <button
                          className="text-sm px-4 py-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/80 transition-colors cursor-pointer"
                        >
                          Add your first expense
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>        {/* Mobile view - Cards */}
        <div className="md:hidden">
          {/* Mobile Bulk Actions Bar */}
          {selectedExpenseIds.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {selectedExpenseIds.length} expense{selectedExpenseIds.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
              >
                <FaTrash size={10} />
                Delete
              </button>
            </div>
          )}

          {/* Mobile Select All */}
          {expensesResponse?.data && expensesResponse.data.length > 0 && (
            <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bgSecondary)]">
              <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={selectedExpenseIds.length === expensesResponse?.data.length && expensesResponse?.data.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Select all expenses
              </label>
            </div>
          )}          {expensesResponse?.data.map((expense) => (
            <div
              key={expense.id}
              className="border-b border-[var(--border-color)] p-4 hover:bg-[var(--bgSecondary)] transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedExpenseIds.includes(expense.id)}
                    onChange={() => handleSelectExpense(expense.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <span className="text-xl">{expense.category.icon}</span>
                  <span className="text-[var(--text)] font-medium">{expense.category.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="p-2 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <FaTrash size={14} />
                </button>
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
            </div>
          ))}

          {expensesResponse?.data.length === 0 && (<div className="px-6 py-8 text-center">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-[var(--text)] opacity-70">No expenses found</p>
              <Link href="/expenses/add">
                <button
                  className="text-sm px-4 py-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/80 transition-colors cursor-pointer"
                >
                  Add your first expense
                </button>
              </Link>
            </div>
          </div>
          )}
        </div>

        {expensesResponse && expensesResponse.totalPages > 1 && (
          <div
            className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bgSecondary)] gap-3"
          >
            <div className="flex items-center gap-2 text-center sm:text-left w-full sm:w-auto">
              <span className="text-sm text-[var(--text)]">
                Page {filterParams.page} of {expensesResponse.totalPages}
              </span>
              <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">
                ({expensesResponse.data.length} of {expensesResponse.totalCount} expenses)
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">              <button
              onClick={() => handlePageChange(Math.max(1, (filterParams.page || 1) - 1))}
              disabled={(filterParams.page || 1) === 1}
              className="px-4 py-2 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)] border border-[var(--border-color)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            >
              Previous
            </button>              <button
              onClick={() => handlePageChange((filterParams.page || 1) + 1)}
              disabled={(filterParams.page || 1) >= (expensesResponse?.totalPages || 1)}
              className="px-4 py-2 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bgSecondary)] text-[var(--text)] rounded-[var(--border-radius)] border border-[var(--border-color)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {expensesResponse && (
        <div className="mt-4">
          <Pagination
            currentPage={filterParams.page || 1}
            totalPages={expensesResponse.totalPages || 1}
            onPageChange={handlePageChange}
            totalItems={expensesResponse.totalCount || 0}
            pageSize={filterParams.pageSize || 10}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedExpenseId && deleteExpense(selectedExpenseId)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        isDeleting={isDeleting}
      />

      <DeleteConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Multiple Expenses"
        message={`Are you sure you want to delete ${selectedExpenseIds.length} expense${selectedExpenseIds.length !== 1 ? 's' : ''}? This action cannot be undone.`}
        isDeleting={isBulkDeleting}
      />
    </div>
  );
}
