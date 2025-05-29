"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { moneySourceRequests, MoneySource, CardStyle } from "@/app/money-sources/_requests";
import { FaPencilAlt, FaTimes, FaCreditCard } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "axios";

const CardStylePreview = ({ style, formValues }: {
  style: CardStyle;
  formValues: {
    name?: string;
    currency?: string;
  }
}) => {
  // Handle style.background that could be a stringified JSON object
  let backgroundStyle = {};
  if (style.background) {
    try {
      // If it's a JSON string that was already stringified, parse it
      if (typeof style.background === 'string' &&
        (style.background.startsWith('{') || style.background.includes('gradient'))) {
        const parsedBackground = JSON.parse(style.background);
        backgroundStyle = parsedBackground;
      }
      // If it's already an object
      else if (typeof style.background === 'object') {
        backgroundStyle = style.background;
      }
      // If it's a plain color string
      else if (typeof style.background === 'string') {
        backgroundStyle = { backgroundColor: style.background };
      }
    } catch (e) {
      console.error("Error parsing background style:", e);
      if (typeof style.background === 'string') {
        backgroundStyle = { backgroundColor: style.background };
      }
    }
  }

  const shadowStyle = style.shadow ?
    { boxShadow: typeof style.shadow === 'string' ? style.shadow : 'none' } :
    {};

  const borderStyle = style.border ?
    { border: style.border } :
    { border: 'none' };

  return (
    <div
      className="relative w-full aspect-[1.58/1] rounded-xl overflow-hidden transition-all duration-300"
      style={{
        ...backgroundStyle,
        ...shadowStyle,
        ...borderStyle,
      }}
    >
      {style.showBgImage && (
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="currentColor" d="M42.7,-62.9C53.9,-54.7,61.1,-40.6,65.7,-26.5C70.3,-12.4,72.2,1.6,69.8,15.3C67.3,29,60.5,42.3,49.9,50.3C39.3,58.2,24.9,60.8,10.5,63.5C-3.9,66.3,-18.3,69.2,-31.2,65.1C-44.1,61.1,-55.6,50.1,-63.2,37.1C-70.8,24.1,-74.5,9.1,-72.8,-4.8C-71,-18.6,-63.7,-31.4,-53.6,-40.3C-43.5,-49.3,-30.6,-54.4,-17.9,-61.6C-5.3,-68.8,7.1,-78.2,20,-77.4C32.9,-76.6,46.2,-65.5,54.4,-52.9Z" />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div style={{ color: style.textColor || '#ffffff', fontWeight: 'bold' }}>
            {formValues.name || "Card Name"}
          </div>
          <div>
            {style.hasChip && (
              <div style={{
                width: '2rem',
                height: '1.25rem',
                borderRadius: '0.25rem',
                backgroundColor: style.chipColor || '#facc15'
              }}></div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div style={{
            color: style.textColor || '#ffffff',
            fontSize: '1.125rem',
            letterSpacing: '0.05em',
            fontFamily: style.cardNumberFont || 'inherit'
          }}>
            •••• •••• •••• ••••
          </div>
          <div className="flex justify-between items-center">
            <div style={{ color: style.textColor || '#ffffff', fontSize: '0.875rem', opacity: 0.8 }}>
              {formValues.currency || "USD"}
            </div>
            <FaCreditCard style={{ color: style.textColor || '#ffffff' }} size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const updateMoneySourceSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  balance: Yup.number().required("Balance is required"),
  currency: Yup.string().required("Currency is required"),
  icon: Yup.string().required("Icon is required"),
  budget: Yup.number().required("Budget is required"),
  cardStyle: Yup.string().required("Card style is required"),
  isDefault: Yup.boolean(),
});

interface UpdateMoneySourceModalProps {
  moneySource: MoneySource;
}

export const UpdateMoneySourceModal = ({ moneySource }: UpdateMoneySourceModalProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: cardStyles, isLoading: cardStylesLoading } = useQuery({
    queryKey: ["card-styles"],
    queryFn: async () => {
      const styles = await moneySourceRequests.getCardStyles();
      return styles;
    }
  });
  // Extract styleId from the stored cardStyle
  const getCurrentStyleId = () => {
    if (!moneySource.cardStyle) return "futuristic-holographic";
    
    try {
      // If cardStyle is a JSON string, parse it and extract styleId
      if (typeof moneySource.cardStyle === 'string') {
        const parsedStyle = JSON.parse(moneySource.cardStyle);
        return parsedStyle.styleId || "futuristic-holographic";
      }      // If it's already an object, extract styleId
      else if (typeof moneySource.cardStyle === 'object' && moneySource.cardStyle !== null) {
        return (moneySource.cardStyle as { styleId?: string }).styleId || "futuristic-holographic";
      }
    } catch (e) {
      console.error("Error parsing cardStyle:", e);
    }
    
    return "futuristic-holographic";
  };

  const { mutate: updateMoneySource, isPending } = useMutation({
    mutationFn: (values: Partial<MoneySource>) => {
      // Find the selected card style and store the full style object as JSON
      const selectedStyle = cardStyles?.find(style => style.styleId === values.cardStyle);
      const updateData = {
        ...values,
        balanceInPreferredCurrency: values.balance,
        budgetInPreferredCurrency: values.budget,
        cardStyle: selectedStyle ? JSON.stringify(selectedStyle) : values.cardStyle,
      };
      
      return moneySourceRequests.updateMoneySource(moneySource.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["money-sources"] });
      toast.success("Money source updated successfully");
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
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95 cursor-pointer"
        >
          <FaPencilAlt className="w-4 h-4 text-white" />
        </motion.button>
      </Dialog.Trigger>      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-4xl bg-[var(--bg)] rounded-[var(--border-radius)] shadow-xl p-4 sm:p-8 z-20 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <Dialog.Title className="text-2xl font-bold text-[var(--text)]">
              Update Money Source
            </Dialog.Title>
            <Dialog.Close className="text-[var(--text)] hover:opacity-70">
              <FaTimes />
            </Dialog.Close>
          </div>          <Formik
            initialValues={{
              name: moneySource.name,
              balance: moneySource.balance,
              currency: moneySource.currency,
              icon: moneySource.icon,
              budget: moneySource.budget,
              cardStyle: getCurrentStyleId(),
              isDefault: moneySource.isDefault,
            }}
            validationSchema={updateMoneySourceSchema}
            onSubmit={(values) => {
              updateMoneySource(values);
            }}
          >
            {({ errors, touched, values, setFieldValue }) => (
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
                </div>                <div>
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

                {/* Card Style Selection */}
                <div>
                  <label htmlFor="cardStyle" className="block text-[var(--text)] mb-2">
                    Card Style
                  </label>
                  {cardStylesLoading ? (
                    <div className="animate-pulse bg-[var(--bgSecondary)] h-40 rounded-lg"></div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {cardStyles?.map((style) => (
                        <div
                          key={style.styleId}
                          className={`cursor-pointer rounded-lg transition-all duration-300 ${values.cardStyle === style.styleId ? "ring-2 ring-[var(--color-primary)]" : "hover:ring-1 hover:ring-[var(--color-primary)]"
                            }`}
                          onClick={() => {
                            setFieldValue("cardStyle", style.styleId);
                          }}
                        >
                          <CardStylePreview style={style} formValues={values} />
                          <div className="text-center text-xs py-1">{style.name}</div>
                        </div>
                      ))}
                    </div>                  )}
                  {errors.cardStyle && touched.cardStyle && (
                    <div className="text-red-500 text-sm mt-1">{String(errors.cardStyle)}</div>
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
                    {isPending ? "Updating..." : "Update Money Source"}
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