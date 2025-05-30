"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authRequests } from "../login/_requests";
import { RegisterResponse } from "../login/_model";
import { FaMoneyBillWave } from "react-icons/fa";
import Stars from "@/components/UI/Stars";
import { PasswordInput } from "@/components/UI/PasswordInput";

const registerSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("E-mail is Required"),
  name: Yup.string().required("Name is Required"),
  password: Yup.string().min(6, "Too Short!").required("Password is Required"),
});

export default function RegisterPage() {
  const router = useRouter();

  const { mutate: register, isPending } = useMutation({
    mutationFn: authRequests.register,
    onSuccess: async (response: RegisterResponse) => {

      await authRequests.requestEmailVerification(response.email);
      router.replace("/verify-code");
      toast.success("Registration successful! Please verify your email.");

    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-6">
      <div className="max-w-lg w-full space-y-6 sm:space-y-8 p-4 sm:p-8 bg-[var(--bgSecondary)] rounded-[var(--border-radius)] shadow-lg z-10 relative">
        <h1 className="inline-flex justify-center w-full items-center gap-2 text-center text-lg md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-4 sm:mb-6">
          <FaMoneyBillWave className="w-6 h-6 sm:w-8 sm:h-8" />
          Expense tracker
        </h1>
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-extrabold text-[var(--text)]">
          Sign up
        </h2>
        <a
          href="/login"
          className="block text-center text-xs sm:text-sm underline text-[var(--text)] hover:opacity-80"
        >
          Already have an account? Sign in
        </a>

        <Formik
          initialValues={{ email: "", name: "", password: "" }}
          validationSchema={registerSchema}
          onSubmit={(values) => register(values)}
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

              <Field
                name="name"
                type="text"
                className="input py-2 sm:py-3"
                placeholder="Full Name"
                autoComplete="full-name"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}              <PasswordInput
                name="password"
                placeholder="Password"
                autoComplete="new-password"
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

              <button type="submit" disabled={isPending} className="btn w-full py-2 sm:py-3">
                {isPending ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
        <a
          href="/verify-email"
          className="block text-center text-xs sm:text-sm underline text-[var(--text)] hover:opacity-80"
        >
          Verify email
        </a>
      </div>
      <Stars />
    </div>
  );
}
