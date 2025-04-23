"use client";

import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { toast } from "sonner";
import Image from "next/image";
import { UserProfile, UpdateProfileInput } from "@/app/settings/_requests";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { userRequests } from "@/app/settings/_requests";
import { useRef } from "react";

const profileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

interface ProfileSectionProps {
  profile: UserProfile;
  onDeleteAccount: () => void;
}

export const ProfileSection = ({ profile, onDeleteAccount }: ProfileSectionProps) => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: userRequests.updateProfile,
    onSuccess: (data) => {
      setUser({
        ...user!,
        name: data.name,
        email: data.email,
      });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      updateProfile({ profilePicture: file });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-[var(--border-radius)] p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-6 text-[var(--text)]">Profile</h2>
      
      <div className="flex items-start gap-8">
        <div className="relative">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[var(--color-secondary)]">
            {profile.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt={profile.name}
                fill
                className="object-cover"
              />
            ) : (
              <FaUserCircle className="w-full h-full text-[var(--color-primary)]" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-[var(--color-primary)] text-white rounded-full hover:opacity-90 transition-opacity"
          >
            <FaCamera size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex-1">
          <Formik
            initialValues={{
              name: profile.name,
              email: profile.email,
            }}
            validationSchema={profileSchema}
            onSubmit={(values) => {
              const updates: UpdateProfileInput = {};
              if (values.name !== profile.name) updates.name = values.name;
              if (values.email !== profile.email) updates.email = values.email;
              if (Object.keys(updates).length > 0) {
                updateProfile(updates);
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
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn"
                  >
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={onDeleteAccount}
                    className="btn"
                  >
                    Delete Account
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