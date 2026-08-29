"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";

export interface TableSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  debounceMs?: number;
  syncWithUrl?: boolean;
  paramName?: string;
  refetch?: () => void;
  loading?: boolean;
}

export default function TableSearch({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "relative w-48 sm:w-64",
  inputClassName = "",
  debounceMs = 300,
  syncWithUrl = true,
  paramName = "search",
  refetch,
  loading = false,
}: TableSearchProps) {
  // Read initial search value from URL if syncWithUrl is enabled and initial value is empty
  const getInitialValue = () => {
    if (value) return value;
    if (syncWithUrl && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get(paramName) || "";
    }
    return "";
  };

  const [localValue, setLocalValue] = useState(getInitialValue);
  const isFirstRender = useRef(true);

  // Keep latest reference of callbacks without triggering useEffect
  const onChangeRef = useRef(onChange);
  const refetchRef = useRef(refetch);

  useEffect(() => {
    onChangeRef.current = onChange;
    refetchRef.current = refetch;
  }, [onChange, refetch]);

  // Sync internal state if external value prop changes explicitly
  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Debounce logic & URL synchronization - ONLY runs when localValue changes
  useEffect(() => {
    // Avoid running on first render if initialized from URL/prop
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (onChangeRef.current) {
        onChangeRef.current(localValue);
      }

      if (syncWithUrl && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (localValue.trim()) {
          url.searchParams.set(paramName, localValue.trim());
        } else {
          url.searchParams.delete(paramName);
        }
        const searchString = url.searchParams.toString();
        const newUrl = searchString ? `${url.pathname}?${searchString}` : url.pathname;
        window.history.pushState({}, "", newUrl);
      }

      if (refetchRef.current) {
        refetchRef.current();
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localValue, debounceMs, syncWithUrl, paramName]);

  const handleClear = () => {
    setLocalValue("");
  };

  return (
    <div className={className}>
      {loading ? (
        <Loader2 className="absolute left-2.5 top-2 w-3.5 h-3.5 text-blue-600 animate-spin" />
      ) : (
        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className={`w-full pl-8 pr-7 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50/50 focus:bg-white ${inputClassName}`}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-200 transition-colors"
          title="Clear Search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
