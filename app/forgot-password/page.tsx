"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "../login/_requests";
import { ApiError } from "../login/_model";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaMoneyBillWave } from "react-icons/fa";
import Stars from "@/components/UI/Stars";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 px-4 py-6">
      <div className="max-w-lg w-full space-y-6 sm:space-y-8 p-4 sm:p-8 bg-[var(--bgSecondary)] text-[var(--text)] shadow-xl rounded-[var(--border-radius)] z-10 relative">
        <h1 className="inline-flex justify-center w-full items-center gap-2 text-center text-lg md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-4 sm:mb-6">
          <FaMoneyBillWave className="w-6 h-6 sm:w-8 sm:h-8" />
          Expense tracker
        </h1>
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-extrabold">
          Forgot Password
        </h2>

        <p className="text-center text-sm text-[var(--text)]/75">
          Enter your email address and we&lsquo;ll send you instructions to reset your password.
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={(values) => requestReset(values.email)}
        >
          {({ errors, touched }) => (
            <Form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              <Field
                name="email"
                type="email"
                className="input py-2 sm:py-3"
                placeholder="Email address"
                autoComplete="email"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <button type="submit" disabled={isPending} className="btn w-full py-2 sm:py-3">
                {isPending ? "Sending..." : "Send Reset Instructions"}
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
