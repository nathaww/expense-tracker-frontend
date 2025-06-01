"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "../login/_requests";
import { ApiError } from "../login/_model";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/Layout/AuthLayout";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("E-mail is Required"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { mutate: requestReset, isPending } = useMutation({
    mutationFn: (email: string) => authRequests.requestPasswordReset(email),
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
      router.push("/reset-password");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to send reset email"
      );
    },
  });

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive reset instructions"
    >
      <div className="space-y-6">
        <div className="text-center bg-[var(--color-primary)]/10 p-4 rounded-lg border border-[var(--color-primary)]/20">
          <p className="text-sm text-[var(--text)]/75 leading-relaxed">
            Enter your email address and we&lsquo;ll send you instructions to reset your password.
          </p>
        </div>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={(values) => requestReset(values.email)}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  name="email"
                  type="email"
                  className="input py-3"
                  placeholder="Email address"
                  autoComplete="email"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isPending} 
                className="btn w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary)]/90 hover:to-[var(--color-secondary)]/90 text-white font-medium transition-all duration-300"
              >
                {isPending ? "Sending..." : "Send Reset Instructions"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center pt-4 border-t border-[var(--border-color)]">
          <a
            href="/login"
            className="text-sm text-[var(--text)]/70 hover:text-[var(--color-primary)] transition-colors"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}

