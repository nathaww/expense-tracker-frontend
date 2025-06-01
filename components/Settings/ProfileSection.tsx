"use client";

import { Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { toast } from "sonner";
import * as Yup from "yup";
import { AxiosError } from "axios";

import { UpdateProfileInput, UserProfile, userRequests } from "@/app/settings/_requests";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { RiProfileFill } from "react-icons/ri";

const profileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

interface ProfileSectionProps {
  profile: UserProfile;
}

export const ProfileSection = ({ profile }: ProfileSectionProps) => {
  const { user, setUser } = useAuth(); const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: userRequests.updateProfile,
    onSuccess: (data) => {
      setUser({
        ...user!,
        name: data?.name,
        email: data?.email,
      });
      toast.success("Profile updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Profile update error:", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile"
      );
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-6 text-[var(--text)]">Profile</h2>

      <div className="flex flex-col md:flex-row items-start gap-8">

        <div className="flex-1">
          <Formik
            initialValues={{
              name: profile?.name,
              email: profile?.email,
            }}
            validationSchema={profileSchema}
            onSubmit={(values) => {
              const updates: UpdateProfileInput = {};
              if (values.name !== profile?.name) updates.name = values.name;
              if (values.email !== profile?.email) updates.email = values.email;

              if (Object.keys(updates).length > 0) {
                updateProfile(updates);
              } else {
                toast.info("No changes detected");
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-[var(--text)] mb-2">Name</label>
                  <Field
                    name="name"
                    className="input w-full"
                    placeholder="Your name"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--text)] mb-2">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className="input w-full"
                    placeholder="Your email"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                  )}
                </div>                <div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn inline-flex items-center gap-1"
                  >
                    <RiProfileFill/>
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </motion.div>
  );
};