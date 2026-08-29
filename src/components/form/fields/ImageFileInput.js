"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const ImageFileInput = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      error,
      className,
      required = false,
      disabled = false,
    },
    ref
  ) => {
    const [previewUrl, setPreviewUrl] = useState(value || "");

    useEffect(() => {
      setPreviewUrl(value || "");
    }, [value]);

    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPreviewUrl(base64);
        if (typeof onChange === "function") {
          onChange(base64);
        }
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className={cn("w-full space-y-1.5", className)}>
        {label && (
          <label
            htmlFor={name}
            className="block text-xs font-bold text-slate-700 select-none"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="flex items-center gap-3">
          {previewUrl && (
            <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          <input
            type="file"
            id={name}
            name={name}
            ref={ref}
            accept="image/*"
            disabled={disabled}
            onChange={handleFileChange}
            className={cn(
              "w-full text-xs font-bold text-slate-700 border rounded-xl px-3 py-1.5 bg-white cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all",
              error
                ? "border-rose-400 bg-rose-50/30"
                : "border-slate-300 focus:border-blue-600"
            )}
          />
        </div>

        {error && (
          <p className="mt-1 text-xs text-rose-600 font-semibold">
            {error.message || error}
          </p>
        )}
      </div>
    );
  }
);

ImageFileInput.displayName = "ImageFileInput";

export default ImageFileInput;
