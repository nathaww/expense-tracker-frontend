"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moneySourceRequests } from "@/app/money-sources/_requests";
import { FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "axios";

const addMoneySourceSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  balance: Yup.number().required("Balance is required"),
  currency: Yup.string().required("Currency is required"),
  icon: Yup.string().required("Icon is required"),
  budget: Yup.number().required("Budget is required"),
  isDefault: Yup.boolean(),
});

export const AddMoneySourceModal = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createMoneySource, isPending } = useMutation({
    mutationFn: (values: { 
      name: string;
      balance: number;
      currency: string;
      icon: string;
      budget: number;
      isDefault: boolean;
    }) => moneySourceRequests.createMoneySource({
      ...values,
      balanceInPreferredCurrency: values.balance,
      budgetInPreferredCurrency: values.budget,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["money-sources"] });
      toast.success("Money source added successfully");
      setIsOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Login failed"
      );
    },
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-2 md:px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-[var(--border-radius)] cursor-pointer flex items-center gap-2 transition-all active:scale-95"
        >
          <FaPlus size={14} />
          Add Money Source
        </motion.button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[var(--bg)] rounded-[var(--border-radius)] shadow-xl p-8 z-20">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold text-[var(--text)]">
              Add Money Source
            </Dialog.Title>
            <Dialog.Close className="text-[var(--text)] hover:opacity-70">
              <FaTimes />
            </Dialog.Close>
          </div>

          <Formik
            initialValues={{
              name: "",
              balance: 0,
              currency: "USD",
              icon: "wallet",
              budget: 0,
              isDefault: false,
            }}
            validationSchema={addMoneySourceSchema}
            onSubmit={(values) => {
              createMoneySource(values);
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[var(--text)] mb-2">
                    Name
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className="input w-full"
                    placeholder="Enter source name"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="icon" className="block text-[var(--text)] mb-2">
                    Icon
                  </label>
                  <Field
                    as="select"
                    name="icon"
                    className="input w-full appearance-none"
                  >
                    <option value="wallet">Wallet</option>
                    <option value="bank">Bank</option>
                    <option value="credit-card">Credit Card</option>
                  </Field>
                  {errors.icon && touched.icon && (
                    <div className="text-red-500 text-sm mt-1">{errors.icon}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="balance" className="block text-[var(--text)] mb-2">
                      Balance
                    </label>
                    <Field
                      name="balance"
                      type="number"
                      className="input w-full"
                      placeholder="0.00"
                    />
                    {errors.balance && touched.balance && (
                      <div className="text-red-500 text-sm mt-1">{errors.balance}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-[var(--text)] mb-2">
                      Currency
                    </label>
                    <Field
                      as="select"
                      name="currency"
                      className="input w-full appearance-none"
                    >
                      <option value="USD">USD</option>
                      <option value="ETB">ETB</option>
                      <option value="EUR">EUR</option>
                    </Field>
                    {errors.currency && touched.currency && (
                      <div className="text-red-500 text-sm mt-1">{errors.currency}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-[var(--text)] mb-2">
                    Budget
                  </label>
                  <Field
                    name="budget"
                    type="number"
                    className="input w-full"
                    placeholder="0.00"
                  />
                  {errors.budget && touched.budget && (
                    <div className="text-red-500 text-sm mt-1">{errors.budget}</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="isDefault"
                    className="w-4 h-4 text-[var(--color-primary)]"
                  />
                  <label htmlFor="isDefault" className="text-[var(--text)]">
                    Set as default money source
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn flex-1"
                  >
                    {isPending ? "Adding..." : "Add Money Source"}
                  </button>
                  <Dialog.Close className="btnTransparent">
                    Cancel
                  </Dialog.Close>
                </div>
              </Form>
            )}
          </Formik>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};