"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { expenseRequests, type Expense, type PostCategory } from "@/app/expenses/_requests";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { FormikErrors, FormikTouched } from "formik";
import { AxiosError } from "axios";

const validationSchema = Yup.object({
  amount: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  date: Yup.date()
    .required("Date is required"),
  notes: Yup.string()
    .max(500, "Notes cannot exceed 500 characters"),
  categoryId: Yup.string()
    .required("Category is required"),
  moneySourceId: Yup.string()
    .required("Money source is required"),
});

interface EditExpenseModalProps {
  expense: Expense;
}

export const EditExpenseModal = ({ expense }: EditExpenseModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: expenseRequests.getCategories,
  });  
  
  const { data: moneySourcesResponse } = useQuery({
    queryKey: ["money-sources-for-expenses"],
    queryFn: expenseRequests.getMoneySources,
  });

  const moneySources = moneySourcesResponse?.data || [];
  const { mutate: updateExpense, isPending } = useMutation({
    mutationFn: (data: PostCategory) => expenseRequests.updateExpense(expense.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["money-sources"] }); // Also invalidate money sources to update balances
      toast.success("Expense updated successfully");
      setIsOpen(false);
    },
    onError: (error: AxiosError & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Failed to update expense");
    },
  });

  const handleSubmit = (values: PostCategory) => {
    updateExpense(values);
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const initialValues: PostCategory = {
    amount: expense.amount,
    date: formatDateForInput(expense.date),
    notes: expense.notes || "",
    categoryId: expense.categoryId,
    moneySourceId: expense.moneySourceId,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-all cursor-pointer"
          title="Edit Expense"
        >
          <FaPencilAlt className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
        </motion.button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-md bg-[var(--bg)] rounded-[var(--border-radius)] shadow-xl p-4 sm:p-6 z-50 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Dialog.Title className="text-xl sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <FaPencilAlt className="text-[var(--color-primary)]" />
              Edit Expense
            </Dialog.Title>
            <Dialog.Close className="text-[var(--text)] hover:opacity-70 p-1 cursor-pointer">
              <FaTimes className="w-4 h-4" />
            </Dialog.Close>
          </div>          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched }: { errors: FormikErrors<PostCategory>; touched: FormikTouched<PostCategory> }) => (
              <Form className="space-y-4">{/* Amount */}
                <div>                  <label htmlFor="amount" className="block text-[var(--text)] mb-2">
                    Amount *
                  </label><Field
                    type="number"
                    name="amount"
                    id="amount"
                    step="0.01"
                    min="0"
                    className="input w-full"
                    placeholder="0.00"
                  />
                  {errors.amount && touched.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                  )}
                </div>                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-[var(--text)] mb-2">
                    Date *
                  </label>
                  <Field
                    type="date"
                    name="date"
                    id="date"
                    className="input w-full"
                  />
                  {errors.date && touched.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="categoryId" className="block text-[var(--text)] mb-2">
                    Category *
                  </label>
                  <Field
                    as="select"
                    name="categoryId"
                    id="categoryId"
                    className="input w-full appearance-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </Field>
                  {errors.categoryId && touched.categoryId && (
                    <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
                  )}
                </div>

                {/* Money Source */}
                <div>
                  <label htmlFor="moneySourceId" className="block text-[var(--text)] mb-2">
                    Money Source *
                  </label>
                  <Field
                    as="select"
                    name="moneySourceId"
                    id="moneySourceId"
                    className="input w-full appearance-none"
                  >
                    <option value="">Select a money source</option>
                    {moneySources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name} ({source.balance} {source.currency})
                      </option>
                    ))}
                  </Field>
                  {errors.moneySourceId && touched.moneySourceId && (
                    <p className="text-red-500 text-xs mt-1">{errors.moneySourceId}</p>
                  )}
                </div>                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-[var(--text)] mb-2">
                    Notes
                  </label>                  <Field
                    as="textarea"
                    name="notes"
                    id="notes"
                    rows={3}
                    className="input w-full resize-none"
                    placeholder="Add any notes about this expense..."
                  />
                  {errors.notes && touched.notes && (
                    <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Dialog.Close className="flex-1 px-4 py-2 text-[var(--text)] border border-[var(--border-color)] rounded-[var(--border-radius)] hover:bg-[var(--bgSecondary)] transition-colors cursor-pointer">
                    Cancel
                  </Dialog.Close>
                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 btn flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaPencilAlt className="w-4 h-4" />
                        Update Expense
                      </>
                    )}
                  </motion.button>
                </div>
              </Form>
            )}
          </Formik>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
