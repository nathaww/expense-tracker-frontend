"use client";

import { useState } from "react";
import { Field } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  name: string;
  placeholder: string;
  autoComplete?: string;
  className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  placeholder,
  autoComplete = "current-password",
  className = "input py-2 sm:py-3",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        className={`${className} pr-10`}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text)]/60 hover:text-[var(--text)] transition-colors cursor-pointer"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <FaEyeSlash className="h-4 w-4" />
        ) : (
          <FaEye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
