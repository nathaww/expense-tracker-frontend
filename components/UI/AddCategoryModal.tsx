"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryRequests } from "@/app/categories/_requests";
import { FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { AxiosError } from "axios";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const addCategorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().required("Icon is required"),
  isDefault: Yup.boolean(),
  color: Yup.string()
    .nullable()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color code"),
});

export const AddCategoryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: (values: { name: string; icon: string; isDefault: boolean; color: string | null }) => 
      categoryRequests.createCategory({
        ...values,
        userId: user?.id || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      setIsOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
      );
    },
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 text-sm md:text-base bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-[var(--border-radius)] flex items-center justify-center sm:justify-start gap-2 hover:opacity-90 transition-opacity"
        >
          <FaPlus size={14} />
          Add Category
        </motion.button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-md bg-[var(--bg)] rounded-[var(--border-radius)] shadow-xl p-4 sm:p-6 z-20 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <Dialog.Title className="text-xl sm:text-2xl font-bold text-[var(--text)]">
              Add Category
            </Dialog.Title>
            <Dialog.Close className="text-[var(--text)] hover:opacity-70 p-1">
              <FaTimes size={16} />
            </Dialog.Close>
          </div>

          <Formik
            initialValues={{
              name: "",
              icon: "",
              isDefault: false,
              color: "#000000",
            }}
            validationSchema={addCategorySchema}
            onSubmit={(values) => {
              createCategory(values);
            }}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[var(--text)] mb-1 sm:mb-2 text-sm sm:text-base">
                    Name
                  </label>
                  <Field
                    name="name"
                    className="input w-full py-2 sm:py-3"
                    placeholder="Category name"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="icon" className="block text-[var(--text)] mb-1 sm:mb-2 text-sm sm:text-base">
                    Icon (emoji)
                  </label>
                  <div className="relative">
                    <div 
                      className="input w-full cursor-pointer flex items-center py-2 sm:py-3"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      {values.icon || "Click to select emoji"}
                    </div>
                    {showEmojiPicker && (
                      <div className="absolute z-50 mt-1 left-0 right-0 sm:left-auto sm:right-auto">
                        <EmojiPicker
                          onEmojiClick={(emojiData: EmojiClickData) => {
                            setFieldValue("icon", emojiData.emoji);
                            setShowEmojiPicker(false);
                          }}
                          width={window.innerWidth < 640 ? window.innerWidth * 0.9 : 300}
                          height={350}
                        />
                      </div>
                    )}
                  </div>
                  {errors.icon && touched.icon && (
                    <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.icon}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="color" className="block text-[var(--text)] mb-1 sm:mb-2 text-sm sm:text-base">
                    Color (optional)
                  </label>
                  <Field
                    name="color"
                    type="color"
                    className="input w-full h-8 sm:h-10"
                  />
                  {errors.color && touched.color && (
                    <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.color}</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="isDefault"
                    className="w-4 h-4 text-[var(--color-primary)]"
                  />
                  <label htmlFor="isDefault" className="text-[var(--text)] text-sm sm:text-base">
                    Set as default category
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn flex-1 py-2 sm:py-3"
                  >
                    {isPending ? "Adding..." : "Add Category"}
                  </button>
                  <Dialog.Close className="btnTransparent py-2 sm:py-3">
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