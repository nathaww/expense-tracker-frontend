"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "../login/_requests";
import { ApiError } from "../login/_model";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { FaMoneyBillWave } from "react-icons/fa";
import Stars from "@/components/UI/Stars";

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setIsValidatingToken(false);
    }
  }, [searchParams]);  const validateToken = async (token: string) => {
    try {
      setIsValidatingToken(true);
      await authRequests.validatePasswordResetToken(token);
      setIsValidToken(true);
    } catch {
      toast.error("Invalid or expired reset token");
      setIsValidToken(false);
    } finally {
      setIsValidatingToken(false);
    }
  };
  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: (values: { password: string }) => {
      if (!token) throw new Error("Reset token is missing");
      return authRequests.resetPassword(token, values.password);
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to reset password"
      );
    },
  });

  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 px-4 py-6">
        <div className="max-w-lg w-full p-8 bg-[var(--bgSecondary)] text-[var(--text)] shadow-xl rounded-[var(--border-radius)] z-10 relative">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-secondary)]"></div>
          </div>
          <p className="text-center mt-4">Validating reset token...</p>
        </div>
        <Stars />
      </div>
    );
  }

  if (!token || !isValidToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 px-4 py-6">
        <div className="max-w-lg w-full p-8 bg-[var(--bgSecondary)] text-[var(--text)] shadow-xl rounded-[var(--border-radius)] z-10 relative">
          <h1 className="inline-flex justify-center w-full items-center gap-2 text-center text-lg md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-6">
            <FaMoneyBillWave className="w-6 h-6 sm:w-8 sm:h-8" />
            Expense tracker
          </h1>
          <h2 className="text-center text-xl font-bold mb-4">Invalid Reset Link</h2>
          <p className="text-center mb-6">
            The password reset link is invalid or has expired. Please request a new password reset.
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="btn w-full py-2"
          >
            Request New Reset Link
          </button>
        </div>
        <Stars />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 px-4 py-6">
      <div className="max-w-lg w-full space-y-6 sm:space-y-8 p-4 sm:p-8 bg-[var(--bgSecondary)] text-[var(--text)] shadow-xl rounded-[var(--border-radius)] z-10 relative">
        <h1 className="inline-flex justify-center w-full items-center gap-2 text-center text-lg md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-4 sm:mb-6">
          <FaMoneyBillWave className="w-6 h-6 sm:w-8 sm:h-8" />
          Expense tracker
        </h1>
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-extrabold">
          Reset Password
        </h2>

        <p className="text-center text-sm text-[var(--text)]/75">
          Enter your new password below
        </p>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={resetPasswordSchema}
          onSubmit={(values) => resetPassword({ password: values.password })}
        >
          {({ errors, touched }) => (
            <Form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              <div>
                <Field
                  name="password"
                  type="password"
                  className="input py-2 sm:py-3"
                  placeholder="New password"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="input py-2 sm:py-3"
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button type="submit" disabled={isPending} className="btn w-full py-2 sm:py-3">
                {isPending ? "Resetting..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <a
            href="/login"
            className="text-center text-xs sm:text-sm underline text-[var(--text)] hover:opacity-80"
          >
            Back to Login
          </a>
        </div>
      </div>
      <Stars />
    </div>
  );
}
