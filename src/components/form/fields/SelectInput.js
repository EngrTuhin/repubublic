"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
import { getSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";
import * as selectTemplates from "@/global-config/selectTemplates";

const SelectInput = forwardRef(
  (
    {
      label,
      name,
      options = [],
      endpoint,
      valueKey = "id",
      labelKey = "name",
      isSearchable = false,
      mappingTemplate,
      error,
      className,
      placeholder = "Select an option",
      required = false,
      disabled,
      onChange,
      onBlur,
      value,
      onOptionSelect,
      watch,
      control,
      ...props
    },
    ref,
  ) => {
    const [asyncOptions, setAsyncOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState("");

    const containerRef = useRef(null);
    const hiddenSelectRef = useRef(null);
    const lastTriggeredValueRef = useRef(null);

    // Combine static and async options
    const allOptions = endpoint ? asyncOptions : options;

    // Sync external value changes using react-hook-form useWatch hook for reliable subscription
    const watchedValue = useWatch({
      name,
      control,
    });

    useEffect(() => {
      if (watchedValue !== undefined && watchedValue !== null) {
        setSelectedValue(watchedValue);
      } else if (value !== undefined) {
        setSelectedValue(value);
      } else if (hiddenSelectRef.current) {
        setSelectedValue(hiddenSelectRef.current.value);
      }
    }, [value, watchedValue]);

    // Auto-trigger onOptionSelect when async options finish fetching in edit/default mode
    useEffect(() => {
      if (allOptions.length > 0 && selectedValue) {
        const matched = allOptions.find((opt) => {
          const valStr = String(opt.value).trim().toLowerCase();
          const selStr = String(selectedValue).trim().toLowerCase();
          if (valStr === selStr) return true;

          if (opt.raw) {
            const rawId =
              opt.raw.id !== undefined
                ? String(opt.raw.id).trim().toLowerCase()
                : null;
            const rawIdno =
              opt.raw.idno !== undefined
                ? String(opt.raw.idno).trim().toLowerCase()
                : null;
            const rawBrCode =
              opt.raw.bank_br_code !== undefined
                ? String(opt.raw.bank_br_code).trim().toLowerCase()
                : null;

            if (rawId && rawId === selStr) return true;
            if (rawIdno && rawIdno === selStr) return true;
            if (rawBrCode && rawBrCode === selStr) return true;
          }
          return false;
        });

        if (matched && lastTriggeredValueRef.current !== selectedValue) {
          lastTriggeredValueRef.current = selectedValue;
          if (onOptionSelect) {
            onOptionSelect(matched);
          }
        }
      }
    }, [allOptions, selectedValue, onOptionSelect]);

    // Fetch async options if endpoint is provided
    useEffect(() => {
      const currentEndpoint =
        typeof endpoint === "function" && watch ? endpoint(watch) : endpoint;
      // Lazy fetch: only query when dropdown is open, OR if there is already a selected value (e.g. edit mode)
      const shouldFetch = currentEndpoint && (isOpen || selectedValue);

      if (shouldFetch) {
        setIsLoading(true);
        const fetchOptions = async () => {
          try {
            const session = await getSession();
            const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
            const headers = {
              Accept: "application/json",
            };
            if (session?.accessToken) {
              headers["Authorization"] = `Bearer ${session.accessToken}`;
            }

            const activeSearch = isOpen ? searchTerm : selectedValue || "";
            const url = activeSearch
              ? `${baseUrl}${currentEndpoint}${currentEndpoint.includes("?") ? "&" : "?"}search=${encodeURIComponent(activeSearch)}`
              : `${baseUrl}${currentEndpoint}`;

            const res = await fetch(url, { headers });
            if (res.ok) {
              const data = await res.json();
              let items = Array.isArray(data) ? data : data.data || [];
              if (!Array.isArray(items) && items && Array.isArray(items.data)) {
                items = items.data;
              }

              // Resolve mapping template
              let resolvedTemplateFn = null;
              if (typeof mappingTemplate === "function") {
                resolvedTemplateFn = mappingTemplate;
              } else if (typeof mappingTemplate === "string") {
                resolvedTemplateFn = selectTemplates[mappingTemplate];
              }

              const mapped = resolvedTemplateFn
                ? resolvedTemplateFn(items)
                : items.map((item) => ({
                    value: String(item[valueKey] || ""),
                    label: String(item[labelKey] || ""),
                  }));

              setAsyncOptions(mapped);
            }
          } catch (err) {
            console.error(
              "Failed to fetch async options for select " + name,
              err,
            );
          } finally {
            setIsLoading(false);
          }
        };

        const delayDebounce = setTimeout(
          () => {
            fetchOptions();
          },
          isSearchable && searchTerm ? 300 : 0,
        );

        return () => clearTimeout(delayDebounce);
      } else if (!currentEndpoint) {
        // Clear async options if endpoint is removed
        setAsyncOptions([]);
      }
    }, [
      endpoint,
      watch,
      isOpen,
      selectedValue,
      valueKey,
      labelKey,
      name,
      searchTerm,
      isSearchable,
      mappingTemplate,
    ]);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    // Filter list locally if searching
    const filteredOptions =
      isSearchable && searchTerm
        ? allOptions.filter((opt) =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : allOptions;

    // Get current label to display in the selector button
    const selectedOption = allOptions.find((opt) => {
      const valStr = String(opt.value).trim().toLowerCase();
      const selStr = String(selectedValue).trim().toLowerCase();
      if (valStr === selStr) return true;

      // Match by raw database fields for resilience when backend maps differently
      if (opt.raw) {
        const rawId =
          opt.raw.id !== undefined
            ? String(opt.raw.id).trim().toLowerCase()
            : null;
        const rawIdno =
          opt.raw.idno !== undefined
            ? String(opt.raw.idno).trim().toLowerCase()
            : null;
        const rawBrCode =
          opt.raw.bank_br_code !== undefined
            ? String(opt.raw.bank_br_code).trim().toLowerCase()
            : null;

        if (rawId && rawId === selStr) return true;
        if (rawIdno && rawIdno === selStr) return true;
        if (rawBrCode && rawBrCode === selStr) return true;
      }
      return false;
    });
    const displayLabel = selectedOption ? selectedOption.label : "";

    const handleSelectOption = (optValue) => {
      setSelectedValue(optValue);
      setIsOpen(false);
      setSearchTerm("");

      const opt = allOptions.find(
        (o) => String(o.value).trim() === String(optValue).trim(),
      );

      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = optValue;
        const event = {
          target: {
            name: name,
            value: optValue,
          },
        };
        if (onChange) onChange(event);
      }

      if (onOptionSelect && opt) {
        lastTriggeredValueRef.current = optValue;
        onOptionSelect(opt);
      }
    };

    return (
      <div className={cn("w-full relative", className)} ref={containerRef}>
        {label && (
          <label
            htmlFor={name}
            className="block text-xs font-bold text-slate-700 mb-1 select-none"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Hidden select for compatibility with react-hook-form */}
        <select
          name={name}
          id={name}
          ref={(e) => {
            hiddenSelectRef.current = e;
            if (ref) {
              if (typeof ref === "function") ref(e);
              else ref.current = e;
            }
          }}
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
            if (onChange) onChange(e);
          }}
          onBlur={onBlur}
          className="hidden"
          {...props}
        >
          <option value="">{placeholder}</option>
          {allOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Selector Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs text-left bg-white outline-none transition-all cursor-pointer",
            disabled
              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
              : "text-slate-800 border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            error &&
              "border-rose-500 focus:border-rose-500 focus:ring-rose-100",
          )}
        >
          <span className={displayLabel ? "font-medium" : "text-slate-400"}>
            {displayLabel || (isLoading ? "Loading..." : placeholder)}
          </span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-slate-400 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-xl p-2 animate-in fade-in duration-100">
            {/* Search Input Bar */}
            {isSearchable && (
              <div className="relative flex items-center border border-slate-200 rounded-lg px-2 py-1 mb-1.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full text-xs bg-transparent outline-none border-none text-slate-800 placeholder-slate-400 p-0 focus:ring-0"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="p-0.5 hover:bg-slate-100 rounded-full"
                  >
                    <X className="w-2.5 h-2.5 text-slate-400" />
                  </button>
                )}
              </div>
            )}

            {/* List options container */}
            <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
              {isLoading ? (
                <div className="py-4 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Searching database...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500 font-medium">
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected =
                    String(opt.value).trim() === String(selectedValue).trim();
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(opt.value)}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-between",
                        isSelected
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span className="w-1.2 h-1.2 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-1.5 text-xs text-rose-600 font-semibold">
            {error.message || error}
          </p>
        )}
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
