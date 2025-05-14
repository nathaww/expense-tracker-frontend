"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { categoryRequests, Category } from "./_requests";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/UI/Loader";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DeleteConfirmationModal } from "@/components/UI/DeleteConfirmationModal";
import { AddCategoryModal } from "@/components/Categories/AddCategoryModal";
import { AxiosError } from "axios";

const updateCategorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().required("Icon is required"),
  isDefault: Yup.boolean(),
});

const CategoryCard = ({
  category,
  index,
}: {
  category: Category;
  index: number;
}) => {
  const queryClient = useQueryClient();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: () => categoryRequests.deleteCategory(category.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
      setIsDeleteOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Login failed"
      );
    },
  });

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: (values: Partial<Category>) =>
      categoryRequests.updateCategory(category.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
      setIsUpdateOpen(false);
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-[var(--bg)] rounded-[var(--border-radius)] border border-[var(--border-color)] overflow-hidden"
      >
        <div 
          className="absolute inset-0 opacity-10 bg-[var(--bgSecondary)] transition-opacity duration-300 group-hover:opacity-20"
        />
        
        <div className="relative p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <motion.span 
              className="text-4xl sm:text-5xl"
              animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              {category.icon}
            </motion.span>
            <div className="flex items-center gap-1 sm:gap-2 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUpdateOpen(true)}
                className="p-1.5 sm:p-2 bg-[var(--color-secondary)] text-white rounded-full transition-all"
              >
                <FaPencilAlt className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDeleteOpen(true)}
                className="p-1.5 sm:p-2 bg-red-500 text-white rounded-full transition-all"
              >
                <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </div>

          <h3 className="text-[var(--text)] text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-1">
            {category.name}
          </h3>

          {category.isDefault && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-[var(--color-primary)] text-white text-xs sm:text-sm rounded-full"
            >
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white"></span>
              </span>
              Default
            </motion.div>
          )}
          
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-[var(--text)] opacity-70">
            Created {new Date(category.createdAt).toLocaleDateString()}
          </div>
        </div>
      </motion.div>

      <Dialog.Root open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-full max-w-md bg-[var(--bg)] rounded-[var(--border-radius)] shadow-xl p-4 sm:p-6 z-20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Dialog.Title className="text-xl sm:text-2xl font-bold text-[var(--text)]">
                Update Category
              </Dialog.Title>
              <Dialog.Close className="text-[var(--text)] hover:opacity-70 p-1">
                <FaTrash size={16} />
              </Dialog.Close>
            </div>

            <Formik
              initialValues={{
                name: category.name,
                icon: category.icon,
                isDefault: category.isDefault,
              }}
              validationSchema={updateCategorySchema}
              onSubmit={updateCategory}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[var(--text)] mb-1 sm:mb-2 text-sm sm:text-base"
                    >
                      Name
                    </label>
                    <Field
                      name="name"
                      className="input w-full py-2 sm:py-3"
                      placeholder="Category name"
                    />
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="icon"
                      className="block text-[var(--text)] mb-1 sm:mb-2 text-sm sm:text-base"
                    >
                      Icon (emoji)
                    </label>
                    <Field
                      name="icon"
                      className="input w-full py-2 sm:py-3"
                      placeholder="Category icon (emoji)"
                    />
                    {errors.icon && touched.icon && (
                      <div className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.icon}
                      </div>
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
                      disabled={isUpdating}
                      className="btn flex-1 py-2 sm:py-3"
                    >
                      {isUpdating ? "Updating..." : "Update Category"}
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

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteCategory()}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
};

const CategoriesPage = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryRequests.getCategories,
  });

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <Loader />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-[var(--bgSecondary)] h-32 sm:h-36 rounded-[var(--border-radius)]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:mb-8 sm:gap-0">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-[var(--text)]"
        >
          Categories
        </motion.h1>

        <AddCategoryModal />
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        {categories?.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </motion.div>
    </div>
  );
};

export default CategoriesPage;
