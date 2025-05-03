"use client";

import React from "react";
import { Formik, Form, Field, useField, FormikProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { expenseRequests } from "../_requests";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface AnimatedFieldProps extends React.HTMLAttributes<HTMLElement> {
  shouldAnimate: boolean;
  as?: "textarea" | "select" | undefined;
  type?: string;
  id: string;
  name: string;
  className?: string;
  placeholder?: string;
  rows?: number;
  children?: React.ReactNode;
}

const AnimatedField = ({ shouldAnimate, ...props }: AnimatedFieldProps) => {
  const [field] = useField(props);

  return (
    <div
      className={
        shouldAnimate
          ? "animate-pulse-long bg-[var(--color-primary)] bg-opacity-5 rounded-[var(--border-radius)]"
          : ""
      }
    >
      {props.as === "textarea" ? (
        <textarea {...field} {...props} className={props.className} />
      ) : props.as === "select" ? (
        <select {...field} {...props} className={props.className}>
          {props.children}
        </select>
      ) : (
        <input {...field} {...props} className={props.className} />
      )}
    </div>
  );
};

interface ExpenseFormValues {
  amount: number;
  date: string;
  notes: string;
  categoryId: string;
  moneySourceId: string;
}

const expenseSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  date: Yup.date().required("Date is required"),
  notes: Yup.string().required("Notes are required"),
  categoryId: Yup.string().required("Category is required"),
  moneySourceId: Yup.string().required("Money source is required"),
});

const textExpenseSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

export default function AddExpensePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [animateFields, setAnimateFields] = React.useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: expenseRequests.getCategories,
  });

  const { data: moneySources, isLoading: moneySourcesLoading } = useQuery({
    queryKey: ["moneySources"],
    queryFn: expenseRequests.getMoneySources,
  });

  const { mutate: createExpense, isPending: isCreating } = useMutation({
    mutationFn: expenseRequests.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense created successfully");
      router.push('/expenses');
    },
    onError: () => {
      toast.error("Failed to create expense");
    },
  });

  const { mutate: createFromText, isPending: isCreatingFromText } = useMutation(
    {
      mutationFn: expenseRequests.createFromText,
      onSuccess: (data) => {
        if (regularFormRef.current) {
          regularFormRef.current.setValues({
            amount: data.amount,
            date: new Date(data.date).toISOString().split("T")[0],
            notes: data.notes,
            categoryId: data.categoryId,
            moneySourceId: data.moneySourceId,
          });
          setAnimateFields(true);

          setTimeout(() => {
            setAnimateFields(false);
          }, 6000);
        }
        toast.success("Text processed successfully");
      },
      onError: () => {
        toast.error("Failed to process text");
      },
    }
  );

  const regularFormRef = React.useRef<FormikProps<ExpenseFormValues>>(null);

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/expenses"
          className="p-2 hover:bg-[var(--bgSecondary)] rounded-full transition-colors"
        >
          <FaArrowLeft className="w-5 h-5 text-[var(--text)]" />
        </Link>
        <h1 className="text-3xl font-bold text-[var(--text)]">
          Add Expense
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text-based Form */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">
            From Text
          </h2>
          <div className="bg-[var(--bgSecondary)] p-6 rounded-[var(--border-radius)] border border-[var(--border-color)]">
            <Formik
              initialValues={{ text: "" }}
              validationSchema={textExpenseSchema}
              onSubmit={(values, { resetForm }) => {
                createFromText(values.text);
                resetForm();
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="text"
                      className="block text-[var(--text)] mb-2"
                    >
                      Enter expense details
                    </label>
                    <Field
                      as="textarea"
                      id="text"
                      name="text"
                      rows={4}
                      className="input w-full resize-none"
                      placeholder="Example: Choafan Rice with Chicken 320 cash"
                    />
                    {errors.text && touched.text && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.text}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingFromText}
                    className="btn w-full"
                  >
                    {isCreatingFromText ? "Processing..." : "Process Text"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Regular Form */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[var(--text)]">
            Manual Entry
          </h2>
          <div className="bg-[var(--bgSecondary)] p-6 rounded-[var(--border-radius)] border border-[var(--border-color)]">
            <Formik
              innerRef={regularFormRef}
              initialValues={{
                amount: 0,
                date: new Date().toISOString().split("T")[0],
                notes: "",
                categoryId: "",
                moneySourceId: "",
              }}
              validationSchema={expenseSchema}
              onSubmit={(values, { resetForm }) => {
                createExpense(values);
                resetForm();
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-[var(--text)] mb-2"
                    >
                      Amount
                    </label>
                    <AnimatedField
                      type="number"
                      id="amount"
                      name="amount"
                      className="input w-full"
                      placeholder="Enter amount"
                      shouldAnimate={animateFields}
                    />
                    {errors.amount && touched.amount && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.amount}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-[var(--text)] mb-2"
                    >
                      Date
                    </label>
                    <AnimatedField
                      type="date"
                      id="date"
                      name="date"
                      className="input w-full"
                      shouldAnimate={animateFields}
                    />
                    {errors.date && touched.date && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.date}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="categoryId"
                      className="block text-[var(--text)] mb-2"
                    >
                      Category
                    </label>
                    <AnimatedField
                      as="select"
                      id="categoryId"
                      name="categoryId"
                      className="input w-full appearance-none bg-[var(--bg)] text-[var(--text)]"
                      shouldAnimate={animateFields}
                    >
                      <option
                        value=""
                        className="bg-[var(--bg)] text-[var(--text)]"
                      >
                        {categoriesLoading ? "Loading..." : "Select Category"}
                      </option>
                      {categories?.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                          className="bg-[var(--bg)] text-[var(--text)]"
                        >
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </AnimatedField>
                    {errors.categoryId && touched.categoryId && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.categoryId}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="moneySourceId"
                      className="block text-[var(--text)] mb-2"
                    >
                      Money Source
                    </label>
                    <AnimatedField
                      as="select"
                      id="moneySourceId"
                      name="moneySourceId"
                      className="input w-full appearance-none bg-[var(--bg)] text-[var(--text)]"
                      shouldAnimate={animateFields}
                    >
                      <option
                        value=""
                        className="bg-[var(--bg)] text-[var(--text)]"
                      >
                        {moneySourcesLoading
                          ? "Loading..."
                          : "Select a money source"}
                      </option>
                      {moneySources?.data?.map((source) => (
                        <option
                          key={source.id}
                          value={source.id}
                          className="bg-[var(--bg)] text-[var(--text)]"
                        >
                          {source.name} ({source.currency})
                        </option>
                      ))}
                    </AnimatedField>
                    {errors.moneySourceId && touched.moneySourceId && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.moneySourceId}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-[var(--text)] mb-2"
                    >
                      Notes
                    </label>
                    <AnimatedField
                      as="textarea"
                      id="notes"
                      name="notes"
                      rows={4}
                      className="input w-full resize-none"
                      placeholder="Enter notes"
                      shouldAnimate={animateFields}
                    />
                    {errors.notes && touched.notes && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.notes}
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={isCreating} className="btn w-full">
                    {isCreating ? "Creating..." : "Create Expense"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}