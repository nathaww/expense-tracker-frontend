"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { themes, saveCustomTheme } from "@/theme/theme";
import { useTheme } from "@/theme/ThemeProvider";

const addThemeSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  primary: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").required(),
  secondary: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").required(),
  tertiary: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").required(),
  background: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").required(),
  backgroundSecondary: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").required(),
  text: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").required(),
  borderColor: Yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").required(),
  borderRadius: Yup.string().required(),
  font: Yup.string().required(),
});

export const AddThemeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme } = useTheme();

  const handleSubmit = (values: typeof themes.light) => {
    saveCustomTheme(values);
    setTheme('custom');
    setIsOpen(false);
    toast.success("Custom theme created and applied successfully");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="px-2 md:px-4 py-2 bg-[var(--color-primary)] text-white text-sm md:text-lg rounded-[var(--border-radius)] flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <FaPlus size={14} />
          Add Theme
        </motion.button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-h-[90vh] overflow-y-auto max-w-lg md:max-w-2xl bg-[var(--bg)] rounded-[var(--border-radius)] shadow-xl p-4 md:p-6 z-20">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <Dialog.Title className="text-xl md:text-2xl font-bold text-[var(--text)]">
              Create Custom Theme
            </Dialog.Title>
            <Dialog.Close className="text-[var(--text)] hover:opacity-70">
              <FaTimes />
            </Dialog.Close>
          </div>

          <Formik
            initialValues={{
              name: "",
              primary: "#6366f1",
              secondary: "#a5b4fc",
              tertiary: "#e0e7ff",
              background: "#f9fafb",
              backgroundSecondary: "#e5e7eb",
              text: "#111827",
              borderColor: "#cbd5e1",
              borderRadius: "0.5rem",
              font: "Arial, sans-serif",
            }}
            validationSchema={addThemeSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div className="lg:col-span-3 sm:col-span-2">
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Theme Name</label>
                    <Field name="name" type="text" className="input w-full" placeholder="Enter theme name" />
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Primary Color</label>
                    <Field name="primary" type="color" className="w-full h-8 md:h-10 rounded-[var(--border-radius)]" />
                    {errors.primary && touched.primary && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.primary}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Secondary Color</label>
                    <Field name="secondary" type="color" className="w-full h-8 md:h-10 rounded-[var(--border-radius)]" />
                    {errors.secondary && touched.secondary && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.secondary}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Tertiary Color</label>
                    <Field name="tertiary" type="color" className="w-full h-8 md:h-10 rounded-[var(--border-radius)]" />
                    {errors.tertiary && touched.tertiary && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.tertiary}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Background</label>
                    <Field name="background" type="color" className="w-full h-8 md:h-10 rounded-[var(--border-radius)]" />
                    {errors.background && touched.background && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.background}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Secondary Background</label>
                    <Field name="backgroundSecondary" type="color" className="w-full h-8 md:h-10 rounded-[var(--border-radius)]" />
                    {errors.backgroundSecondary && touched.backgroundSecondary && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.backgroundSecondary}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Text Color</label>
                    <Field name="text" type="color" className="w-full h-8 md:h-10 rounded-[var(--border-radius)]" />
                    {errors.text && touched.text && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.text}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Border Color</label>
                    <Field name="borderColor" type="color" className="w-full h-8 md:h-10 rounded-[var(--border-radius)]" />
                    {errors.borderColor && touched.borderColor && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.borderColor}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Border Radius</label>
                    <Field name="borderRadius" as="select" className="input w-full text-sm md:text-base">
                      <option value="0">None</option>
                      <option value="0.25rem">Small</option>
                      <option value="0.5rem">Medium</option>
                      <option value="0.75rem">Large</option>
                      <option value="1rem">Extra Large</option>
                    </Field>
                    {errors.borderRadius && touched.borderRadius && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.borderRadius}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[var(--text)] mb-2 text-sm md:text-base">Font Family</label>
                    <Field name="font" as="select" className="input w-full text-sm md:text-base">
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="'Times New Roman', serif">Times New Roman</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                      <option value="'Segoe UI', sans-serif">Segoe UI</option>
                    </Field>
                    {errors.font && touched.font && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{errors.font}</div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4 pt-4">
                  <button type="submit" className="btn flex-1 text-sm md:text-base">
                    Create Theme
                  </button>
                  <Dialog.Close className="btnTransparent text-sm md:text-base">
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
