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
      rows = 3,
      required = false,
      readOnly = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label
            htmlFor={name}
            className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 select-none"
          >
            {label}
            {required && <span className="text-rose-500 font-extrabold ml-1">*</span>}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          ref={ref}
          rows={rows}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled || readOnly}
          className={cn(
            "w-full rounded-xl border px-3 py-2 text-xs font-bold text-slate-900 outline-none transition bg-slate-50/40 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/70 placeholder:text-slate-400 placeholder:font-normal resize-y",
            error
              ? "border-rose-400 bg-rose-50/30 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              : "border-slate-300"
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[10px] font-extrabold text-rose-600 flex items-center gap-1">
            <span>•</span>
            <span>{typeof error === "string" ? error : error.message}</span>
          </p>
        )}
      </div>
    );
  }
);

TextareaInput.displayName = "TextareaInput";

export default TextareaInput;
