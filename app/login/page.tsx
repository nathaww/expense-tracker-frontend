"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { loginUser } from "./_requests";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useMutation(loginUser, {
    onSuccess: () => {
      router.replace("/dashboard");
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed!");
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-primary">
      <div className="bg-bg p-8 rounded-[var(--borderRadius)] shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-text font-semibold mb-6">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            loginMutation.mutate(values);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <label className="text-text" htmlFor="email">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`${
                    errors.email && touched.email ? "border-red-500" : ""
                  } w-full p-2 border text-bg border-gray-300 rounded-md`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-text" htmlFor="password">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={`${
                    errors.password && touched.password ? "border-red-500" : ""
                  } w-full p-2 border text-bg border-gray-300 rounded-md`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <button
                type="submit"
                className={`w-full p-2 bg-primary text-bg rounded-md ${
                  loginMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading
                  ? "Logging in..."
                  : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
