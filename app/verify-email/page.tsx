"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "../login/_requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { FaMoneyBillWave } from "react-icons/fa";
import Stars from "@/components/UI/Stars";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <div className="max-w-lg w-full space-y-8 p-8 bg-[var(--bgSecondary)] text-[var(--text)] shadow-xl rounded-[var(--border-radius)] z-10 relative">
        <h1 className="inline-flex justify-center w-full items-center gap-2 text-center md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-6">
          <FaMoneyBillWave className="w-8 h-8" />
          Expense tracker
        </h1>
        <h2 className="text-center text-2xl md:text-4xl font-extrabold">
          Request Email Verification
        </h2>

        <a
          href="/login"
          className="block text-center text-sm underline text-[var(--color-primary)] hover:opacity-80"
        >
          Back to login
        </a>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={requestEmailSchema}
          onSubmit={(values) => requestCode(values.email)}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <Field
                name="email"
                type="email"
                className="input"
                placeholder="Email Address"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <button type="submit" disabled={isPending} className="btn w-full">
                {isPending ? "Sending Email..." : "Send Verification Email"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <Stars />
    </div>
  );
}
