"use client";

import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export interface ToastManagerProps {
  successMessage?: string | null;
  errorMessage?: string | null;
  setSuccessMessage?: (msg: string | null) => void;
  setErrorMessage?: (msg: string | null) => void;
}

export default function ToastManager({
  successMessage,
  errorMessage,
  setSuccessMessage,
  setErrorMessage,
}: ToastManagerProps) {
  useEffect(() => {
    if (successMessage) {
      toast.success(String(successMessage), {
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: "#0f172a",
          color: "#fff",
          fontSize: "12px",
          fontWeight: "700",
        },
      });
      if (typeof setSuccessMessage === "function") {
        setSuccessMessage(null);
      }
    }
  }, [successMessage, setSuccessMessage]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(String(errorMessage), {
        duration: 5000,
        style: {
          borderRadius: "12px",
          background: "#0f172a",
          color: "#fff",
          fontSize: "12px",
          fontWeight: "700",
        },
      });
      if (typeof setErrorMessage === "function") {
        setErrorMessage(null);
      }
    }
  }, [errorMessage, setErrorMessage]);

  return <Toaster position="top-right" reverseOrder={false} />;
}
