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
      console.log(error);
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <div className="max-w-lg w-full space-y-8 p-8 bg-[var(--bg)] border border-[var(--text)] text-[var(--text)] shadow-xl rounded-[var(--border-radius)]">
        <h1 className="inline-flex justify-center w-full items-center gap-2 text-center md:text-xl uppercase text-[var(--color-secondary)] font-extrabold mb-6">
          <FaMoneyBillWave className="w-8 h-8" />
          Expense tracker
        </h1>
        <h2 className="text-center text-2xl md:text-4xl font-extrabold">
          Sign in
        </h2>

        <a
          href="/register"
          className="block text-center text-sm underline text-[var(--color-primary)] hover:opacity-80"
        >
          Don&lsquo;t have an account? Sign up
        </a>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values) => login(values)}
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
                name="password"
                type="password"
                className="input"
                placeholder="Password"
                autoComplete="current-password"
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 px-4 text-sm md:text-lg font-medium rounded-[var(--border-radius)] text-white bg-[var(--color-secondary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] disabled:opacity-50 transition active:scale-95"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="inline-flex items-center justify-center gap-10 w-full">
          <a
            href="/forgot-password"
            className="block text-center underline text-sm text-[var(--color-primary)] hover:opacity-80"
          >
            Forgot password?
          </a>
          <a
            href="/verify-email"
            className="block text-center text-sm text-[var(--color-primary)] hover:opacity-80"
          >
            Verify email
          </a>
        </div>
      </div>
    </div>
  );
}
