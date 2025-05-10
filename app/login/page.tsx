"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "./_requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { FaMoneyBillWave } from "react-icons/fa";
import Stars from "@/components/UI/Stars";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("E-mail is Required"),
  password: Yup.string().min(6, "Too Short!").required("Password is Required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const { mutate: login, isPending } = useMutation({
    mutationFn: authRequests.login,
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast.success("Login successful!");
      router.replace("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Login failed"
      );
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 px-4 py-6">
      <div className="max-w-lg w-full space-y-6 sm:space-y-8 p-4 sm:p-8 bg-[var(--bgSecondary)]  text-[var(--text)] shadow-xl rounded-[var(--border-radius)] z-10 relative">
        <h1 className="inline-flex justify-center w-full items-center gap-2 text-center text-lg md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-4 sm:mb-6">
          <FaMoneyBillWave className="w-6 h-6 sm:w-8 sm:h-8" />
          Expense tracker
        </h1>
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-extrabold">
          Sign in
        </h2>

        <a
          href="/register"
          className="block text-center text-xs sm:text-sm underline text-[var(--text)] hover:opacity-80"
        >
          Don&lsquo;t have an account? Sign up
        </a>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values) => login(values)}
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
                name="password"
                type="password"
                className="input py-2 sm:py-3"
                placeholder="Password"
                autoComplete="current-password"
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

              <button type="submit" disabled={isPending} className="btn w-full py-2 sm:py-3">
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="inline-flex flex-col sm:flex-row items-center justify-center sm:gap-10 w-full space-y-2 sm:space-y-0">
          <a
            href="/forgot-password"
            className="block text-center underline text-xs sm:text-sm text-[var(--text)] hover:opacity-80"
          >
            Forgot password?
          </a>
          <a
            href="/verify-email"
            className="block text-center text-xs sm:text-sm text-[var(--text)] hover:opacity-80"
          >
            Verify email
          </a>
        </div>
      </div>
      <Stars />
    </div>
  );
}
