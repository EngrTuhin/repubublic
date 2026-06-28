import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const TextareaInput = forwardRef(
  (
    {
      label,
      name,
      error,
      className,
      placeholder,
      rows = 4,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label
            htmlFor={name}
            className="block text-xs font-bold text-slate-700 mb-1 select-none"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          ref={ref}
          rows={rows === 4 ? 2 : rows} // Default to 2 rows instead of 4 to save vertical space
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border px-2.5 py-1.5 text-xs text-gray-900 outline-none transition bg-white",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-600">{error.message || error}</p>
        )}
      </div>
    );
  }
);

TextareaInput.displayName = "TextareaInput";

export default TextareaInput;
