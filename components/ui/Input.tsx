"use client";
import React, { useState } from "react";
import type { InputHTMLAttributes } from "react";

type InputFieldProps = {
  label?: string;
  id?: string;
  error?: string;
  isPassword?: boolean;
  labelColor?: string;
  icon?: React.ReactNode; // Left side icon
  passwordToggleIcons?: {
    show: React.ReactNode;
    hide: React.ReactNode;
  };
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  labelColor,
  id,
  error,
  className = "",
  isPassword = false,
  icon,
  passwordToggleIcons,
  type,
  ...inputProps
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const paddingLeftClass = icon ? "pl-10" : "pl-3";
  const paddingRightClass = isPassword ? "pr-10" : "pr-3";

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className={`block font-medium mb-1 ${labelColor}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {/* Left icon */}
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}

        <input
          id={id}
          type={inputType}
          className={`w-full border rounded py-2 ${paddingLeftClass} ${paddingRightClass} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
          {...inputProps}
        />

        {/* Right password toggle */}
        {isPassword && passwordToggleIcons && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? passwordToggleIcons.hide : passwordToggleIcons.show}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
