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
      try {
        await authRequests.requestEmailVerification(response.email);
        router.replace("/verify-email");
        toast.success("Registration successful! Please verify your email.");
      } catch {
        toast.error("Failed to send email verification.");
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="max-w-lg w-full space-y-8 p-8 bg-[var(--bg)] rounded-[var(--border-radius)] border border-[var(--border-color)] shadow-lg">
        <h1 className="inline-flex justify-center w-full items-center gap-2 text-center md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-6">
          <FaMoneyBillWave className="w-8 h-8" />
          Expense tracker
        </h1>
        <h2 className="text-center text-2xl md:text-4xl font-extrabold text-[var(--text)]">
          Sign up
        </h2>
        <a
          href="/login"
          className="block text-center text-sm underline text-[var(--color-primary)] hover:opacity-80"
        >
          Already have an account? Sign in
        </a>

        <Formik
          initialValues={{ email: "", name: "", password: "" }}
          validationSchema={registerSchema}
          onSubmit={(values) => register(values)}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <Field
                name="email"
                type="email"
                className="input"
                placeholder="Email address"
                autoComplete="email"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <Field
                name="name"
                type="text"
                className="input"
                placeholder="Full Name"
                autoComplete="full-name"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}

              <Field
                name="password"
                type="password"
                className="input"
                placeholder="Password"
                autoComplete="new-password"
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 px-4 text-sm md:text-lg font-medium rounded-[var(--border-radius)] text-white bg-[var(--color-secondary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] disabled:opacity-50 transition active:scale-95"
              >
                {isPending ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
        <a
          href="/verify-email"
          className="block text-center text-sm underline text-[var(--color-primary)] hover:opacity-80"
        >
          Verify email
        </a>
      </div>
    </div>
  );
}
