"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { loginUser } from "./_requests";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { VscLoading } from "react-icons/vsc";

const validationSchema = Yup.object({
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
      toast.success("Login successful!");
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed!");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <div className="bg-bg p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-text font-semibold mb-6">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border text-bg border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border text-bg border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 bg-primary text-bg rounded-md ${
              loginMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? <VscLoading className="animate-spin mx-auto"/> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
