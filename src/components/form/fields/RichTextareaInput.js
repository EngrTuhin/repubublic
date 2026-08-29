"use client";

import React, { forwardRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to prevent SSR window/document mismatch errors
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-44 w-full bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium animate-pulse">
      Loading Rich Text Editor...
    </div>
  ),
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "color",
  "background",
  "script",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
];

const RichTextareaInput = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      error,
      className,
      placeholder = "Enter feature description with rich formatting...",
      required = false,
      readOnly = false,
    },
    ref
  ) => {
    const [editorValue, setEditorValue] = useState(value || "");

    useEffect(() => {
      setEditorValue(value || "");
    }, [value]);

    const handleChange = (content) => {
      setEditorValue(content);
      if (typeof onChange === "function") {
        onChange(content);
      }
    };

    return (
      <div className={cn("w-full space-y-1.5", className)}>
        {label && (
          <label
            htmlFor={name}
            className="block text-xs font-bold text-slate-700 select-none"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <ReactQuill
            theme="snow"
            value={editorValue}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder={placeholder}
            modules={modules}
            formats={formats}
            className="quill-rich-editor"
          />
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-600">{error.message || error}</p>
        )}

        <style jsx global>{`
          .quill-rich-editor .ql-toolbar.ql-snow {
            border: none !important;
            border-bottom: 1px solid #e2e8f0 !important;
            background-color: #f8fafc !important;
            padding: 8px 12px !important;
            border-top-left-radius: 0.75rem !important;
            border-top-right-radius: 0.75rem !important;
          }
          .quill-rich-editor .ql-container.ql-snow {
            border: none !important;
            min-height: 160px !important;
            font-size: 13px !important;
            font-family: inherit !important;
          }
          .quill-rich-editor .ql-editor {
            min-height: 160px !important;
            padding: 12px 16px !important;
          }
          .quill-rich-editor .ql-editor.ql-blank::before {
            color: #94a3b8 !important;
            font-style: normal !important;
            font-size: 13px !important;
          }
        `}</style>
      </div>
    );
  }
);

RichTextareaInput.displayName = "RichTextareaInput";

export default RichTextareaInput;
