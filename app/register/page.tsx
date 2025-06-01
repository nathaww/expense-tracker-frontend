"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authRequests } from "../login/_requests";
import { PasswordInput } from "@/components/UI/PasswordInput";
import AuthLayout from "@/components/Layout/AuthLayout";

const registerSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("E-mail is Required"),
  name: Yup.string().required("Name is Required"),
  password: Yup.string().min(6, "Too Short!").required("Password is Required"),
});

export default function RegisterPage() {
  const router = useRouter();

  const { mutate: register, isPending } = useMutation({
    mutationFn: authRequests.register,
    onSuccess: () => {
      router.replace("/verify-code");
      toast.success("Registration successful! Please verify your email.");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join thousands of users managing their finances"
    >
      <div className="space-y-6">
        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium transition-colors"
          >
            Already have an account? <span className="underline">Sign in</span>
          </a>
        </div>

        <Formik
          initialValues={{ email: "", name: "", password: "" }}
          validationSchema={registerSchema}
          onSubmit={(values) => register(values)}
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
                <Field
                  name="name"
                  type="text"
                  className="input py-3"
                  placeholder="Full Name"
                  autoComplete="full-name"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-xs mt-2">{errors.name}</p>
                )}
              </div>

              <div>
                <PasswordInput
                  name="password"
                  placeholder="Password"
                  autoComplete="new-password"
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
                {isPending ? "Creating Account..." : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center pt-4 border-t border-[var(--border-color)]">
          <a
            href="/verify-email"
            className="text-sm text-[var(--text)]/70 hover:text-[var(--color-primary)] transition-colors"
          >
            Need to verify your email?
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
