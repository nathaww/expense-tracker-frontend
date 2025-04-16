"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "./_requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/providers/AuthProvider";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 p-8 bg-[var(--bg)] text-[var(--text)] rounded-[var(--border-radius)] shadow-xl border border-[var(--color-primary)]">
        <h2 className="text-center text-3xl font-extrabold">
          Sign in to your account
        </h2>

        <a
          href="/register"
          className="block text-center text-sm underline text-[var(--color-primary)] hover:opacity-80"
        >
          Sign up
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
                className="block w-full px-3 py-2 border border-[var(--color-secondary)] bg-transparent rounded-[var(--border-radius)] placeholder-gray-400 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-sm"
                placeholder="Email address"
                autoComplete="email"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <Field
                name="password"
                type="password"
                className="block w-full px-3 py-2 border border-[var(--color-secondary)] bg-transparent rounded-[var(--border-radius)] placeholder-gray-400 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-sm"
                placeholder="Password"
                autoComplete="current-password"
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-[var(--border-radius)] text-white bg-[var(--color-primary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] disabled:opacity-50 transition active:scale-95"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
