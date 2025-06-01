"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "../login/_requests";
import { AuthResponse } from "../login/_model";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/providers/AuthProvider";
import AuthLayout from "@/components/Layout/AuthLayout";

const verifyCodeSchema = Yup.object().shape({
  code: Yup.string().required("Verification code is required"),
});

export default function VerifyCodePage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const { mutate: verifyCode, isPending } = useMutation({
    mutationFn: authRequests.verifyEmailCode,
    onSuccess: (response: AuthResponse) => {
      const { accessToken, refreshToken, user } = response;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Email verified successfully! Welcome!");
      router.replace("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Verification failed");
    },
  });

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the code sent to your email"
    >
      <div className="space-y-6">
        <div className="text-center bg-[var(--color-primary)]/10 p-4 rounded-lg border border-[var(--color-primary)]/20">
          <p className="text-sm text-[var(--text)]/75 leading-relaxed">
            Please enter the verification code sent to your email address to
            complete your account setup.
          </p>
        </div>

        <Formik
          initialValues={{ code: "" }}
          validationSchema={verifyCodeSchema}
          onSubmit={(values) => verifyCode(values.code)}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  name="code"
                  type="text"
                  className="input py-3 text-center font-mono text-lg tracking-wider"
                  placeholder="Enter verification code"
                  autoComplete="one-time-code"
                />
                {errors.code && touched.code && (
                  <p className="text-red-500 text-xs mt-2">{errors.code}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary)]/90 hover:to-[var(--color-secondary)]/90 text-white font-medium transition-all duration-300"
              >
                {isPending ? "Verifying..." : "Verify Email"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center pt-4 border-t border-[var(--border-color)]">
          <a
            href="/verify-email"
            className="text-sm text-[var(--text)]/70 hover:text-[var(--color-primary)] transition-colors"
          >
            Didn&apos;t receive a code? Request again
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
