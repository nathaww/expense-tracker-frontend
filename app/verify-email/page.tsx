"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "../login/_requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import AuthLayout from "@/components/Layout/AuthLayout";

const requestEmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function RequestEmailPage() {
  const router = useRouter();

  const { mutate: requestCode, isPending } = useMutation({
    mutationFn: authRequests.requestEmailVerification,
    onSuccess: () => {
      toast.success("Verification email sent!");
      router.replace("/verify-code");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    },
  });

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="We'll send you a verification code"
    >
      <div className="space-y-6">
        <div className="text-center bg-[var(--color-primary)]/10 p-4 rounded-lg border border-[var(--color-primary)]/20">
          <p className="text-sm text-[var(--text)]/75 leading-relaxed">
            Enter your email address to receive a verification code that will
            confirm your account.
          </p>
        </div>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={requestEmailSchema}
          onSubmit={(values) => requestCode(values.email)}
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
                {isPending ? "Sending Email..." : "Send Verification Email"}
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
