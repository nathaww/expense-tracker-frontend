"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "../login/_requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { FaMoneyBillWave } from "react-icons/fa";

const verifyCodeSchema = Yup.object().shape({
  code: Yup.string().required("Verification code is required"),
});

export default function VerifyCodePage() {
  const router = useRouter();

  const { mutate: verifyCode, isPending } = useMutation({
    mutationFn: authRequests.verifyEmailCode,
    onSuccess: () => {
      toast.success("Email verified successfully!");
      router.replace("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Verification failed");
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <div className="max-w-lg w-full space-y-8 p-8 bg-[var(--bg)] text-[var(--text)] border border-[var(--border-color)] shadow-xl rounded-[var(--border-radius)]">
        <h1 className="inline-flex justify-center w-full items-center gap-2 text-center md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-6">
          <FaMoneyBillWave className="w-8 h-8" />
          Expense tracker
        </h1>
        <h2 className="text-center text-2xl md:text-4xl font-extrabold">
          Verify Your Email
        </h2>

        <p className="text-center text-sm text-[var(--text)]">
          Please enter the verification code sent to your email.
        </p>

        <Formik
          initialValues={{ code: "" }}
          validationSchema={verifyCodeSchema}
          onSubmit={(values) => verifyCode(values.code)}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <Field
                name="code"
                type="text"
                className="input"
                placeholder="Verification Code"
              />
              {errors.code && touched.code && (
                <p className="text-red-500 text-xs mt-1">{errors.code}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 px-4 text-sm md:text-lg font-medium rounded-[var(--border-radius)] text-white bg-[var(--color-secondary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] disabled:opacity-50 transition active:scale-95"
              >
                {isPending ? "Verifying..." : "Verify Email"}
              </button>
            </Form>
          )}
        </Formik>

        <a
          href="/verify-email"
          className="block text-center text-sm underline text-[var(--color-primary)] hover:opacity-80"
        >
          Didn&apos;t receive a code? Request again
        </a>
      </div>
    </div>
  );
}