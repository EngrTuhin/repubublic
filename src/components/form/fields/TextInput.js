import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const TextInput = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      error,
      className,
      inputClassName,
      align = type === "number" ? "right" : "left",
      placeholder,
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
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border px-2.5 py-1.5 text-xs text-gray-900 outline-none transition bg-white",
            align === "right" && "text-right",
            align === "left" && "text-left",
            align === "center" && "text-center",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            inputClassName
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-650">{error.message || error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
