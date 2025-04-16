"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { authRequests } from "../login/_requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const requestEmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function RequestEmailPage() {
  const router = useRouter();

  const { mutate: requestCode, isPending } = useMutation({
    mutationFn: authRequests.requestEmailVerification,
    onSuccess: () => {
      toast.success("Verification email sent!");
      router.replace("/verify-code");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Request Email Verification
        </h2>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={requestEmailSchema}
          onSubmit={(values) => requestCode(values.email)}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <Field
                name="email"
                type="email"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email Address"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isPending ? "Sending Email..." : "Send Verification Email"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
