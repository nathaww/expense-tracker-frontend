"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authRequests } from "../login/_requests";
import { RegisterResponse } from "../login/_model";

const registerSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  name: Yup.string().required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>

        <Formik
          initialValues={{ email: "", name:"", password: "" }}
          validationSchema={registerSchema}
          onSubmit={(values) => register(values)}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <Field
                name="email"
                type="email"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                autoComplete="email"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <Field
                name="name"
                type="text"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                autoComplete="full-name"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}

              <Field
                name="password"
                type="password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                autoComplete="new-password"
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isPending ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
