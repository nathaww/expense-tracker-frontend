"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "./_requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { PasswordInput } from "@/components/UI/PasswordInput";
import AuthLayout from "@/components/Layout/AuthLayout";

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
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account to continue"
    >
      <div className="space-y-6">
        <div className="text-center">
          <a
            href="/register"
            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium transition-colors"
          >
            Don&lsquo;t have an account? <span className="underline">Sign up</span>
          </a>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values) => login(values)}
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

              <div>
                <PasswordInput
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isPending} 
                className="btn w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary)]/90 hover:to-[var(--color-secondary)]/90 text-white font-medium transition-all duration-300"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-8 w-full space-y-3 sm:space-y-0 pt-4 border-t border-[var(--border-color)]">
          <a
            href="/forgot-password"
            className="text-sm text-[var(--text)]/70 hover:text-[var(--color-primary)] transition-colors"
          >
            Forgot password?
          </a>
          <a
            href="/verify-email"
            className="text-sm text-[var(--text)]/70 hover:text-[var(--color-primary)] transition-colors"
          >
            Verify email
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
