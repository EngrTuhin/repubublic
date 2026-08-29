"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
      responseKey,
      valueKey = "id",
      labelKey = "name",
      isSearchable = false,
      isMultiple = false,
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
    const [selectedOptionObj, setSelectedOptionObj] = useState(null);
    const [mounted, setMounted] = useState(false);

    const containerRef = useRef(null);
    const panelRef = useRef(null);
    const hiddenSelectRef = useRef(null);
    const lastTriggeredValueRef = useRef(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUpward: false });

    useEffect(() => {
      setMounted(true);
    }, []);

    // Combine static and async options
    const allOptions = endpoint ? asyncOptions : options;

    // Sync external value changes using react-hook-form useWatch hook for reliable subscription
    const watchedValue = useWatch({
      name,
      control,
    });

    useEffect(() => {
      if (watchedValue !== undefined && watchedValue !== null && watchedValue !== "") {
        setSelectedValue(watchedValue);
      } else if (value !== undefined && value !== null && value !== "") {
        setSelectedValue(value);
      } else if (hiddenSelectRef.current && hiddenSelectRef.current.value) {
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
      // Fetch options whenever endpoint is provided so edit mode populates labels immediately
      const shouldFetch = Boolean(currentEndpoint);

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

            const activeSearch = isSearchable && searchTerm ? searchTerm : "";
            const url = activeSearch
              ? `${baseUrl}${currentEndpoint}${currentEndpoint.includes("?") ? "&" : "?"}search=${encodeURIComponent(activeSearch)}`
              : `${baseUrl}${currentEndpoint}`;

            const res = await fetch(url, { headers });
            if (res.ok) {
              const data = await res.json();
              let items = [];
              if (responseKey && data?.[responseKey]) {
                items = data[responseKey];
              } else if (responseKey && data?.data?.[responseKey]) {
                items = data.data[responseKey];
              } else if (Array.isArray(data)) {
                items = data;
              } else {
                items = data.data || [];
              }
              if (!Array.isArray(items) && items && Array.isArray(items.data)) {
                items = items.data;
              }

              // Resolve mapping template
              let resolvedTemplateFn = null;
              if (typeof mappingTemplate === "function") {
                resolvedTemplateFn = mappingTemplate;
              } else if (typeof mappingTemplate === "string" && selectTemplates[mappingTemplate]) {
                resolvedTemplateFn = selectTemplates[mappingTemplate];
              } else if (!mappingTemplate) {
                resolvedTemplateFn = selectTemplates.commonSelectTemplate;
              }

              const mapped = resolvedTemplateFn
                ? resolvedTemplateFn(items, labelKey, valueKey, responseKey)
                : items.map((item) => ({
                  value: String(item[valueKey] || item.id || item.value || ""),
                  label: String(item[labelKey] || item.label || item.name || item.title || ""),
                  raw: item,
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
        setAsyncOptions([]);
      }
    }, [
      endpoint,
      watch,
      isOpen,
      valueKey,
      labelKey,
      name,
      searchTerm,
      isSearchable,
      mappingTemplate,
      responseKey,
    ]);

    const handleToggleOpen = () => {
      if (disabled) return;
      if (!isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      setIsOpen((prev) => !prev);
    };

    // Calculate dynamic portal viewport coordinates (always opens downward below button)
    useEffect(() => {
      if (!isOpen) return;

      const updateCoords = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setCoords({
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
            width: rect.width,
          });
        }
      };

      updateCoords();

      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);

      return () => {
        window.removeEventListener("scroll", updateCoords, true);
        window.removeEventListener("resize", updateCoords);
      };
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target) &&
          panelRef.current &&
          !panelRef.current.contains(event.target)
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
      if (opt.value === undefined || opt.value === null) return false;
      const valStr = String(opt.value).trim().toLowerCase();
      const selStr = String(selectedValue).trim().toLowerCase();
      if (valStr === selStr) return true;

      // Match by raw database fields for resilience when backend maps differently
      if (opt.raw) {
        const rawId =
          opt.raw.id !== undefined
            ? String(opt.raw.id).trim().toLowerCase()
            : null;
        const rawValue =
          opt.raw.value !== undefined
            ? String(opt.raw.value).trim().toLowerCase()
            : null;
        const rawLabel =
          opt.raw.label !== undefined
            ? String(opt.raw.label).trim().toLowerCase()
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
        if (rawValue && rawValue === selStr) return true;
        if (rawLabel && rawLabel === selStr) return true;
        if (rawIdno && rawIdno === selStr) return true;
        if (rawBrCode && rawBrCode === selStr) return true;
      }
      return false;
    });

    const displayLabel = selectedOption
      ? selectedOption.label
      : selectedOptionObj && String(selectedOptionObj.value).trim() === String(selectedValue).trim()
        ? selectedOptionObj.label
        : "";

    const handleSelectOption = (optValue, optObject) => {
      const opt =
        optObject ||
        allOptions.find(
          (o) => String(o.value).trim() === String(optValue).trim(),
        );

      setSelectedValue(optValue);
      if (opt) setSelectedOptionObj(opt);
      setIsOpen(false);
      setSearchTerm("");

      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = optValue;
      }

      const event = {
        target: {
          name: name,
          value: optValue,
        },
        type: "change",
      };

      if (onChange) {
        onChange(event);
      }

      if (onOptionSelect && opt) {
        lastTriggeredValueRef.current = optValue;
        onOptionSelect(opt);
      }
    };

    const dropdownContent = (
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          width: `${coords.width}px`,
        }}
        className="z-[99999] bg-white border border-slate-200/90 shadow-2xl rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-100 select-none"
      >
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
                  onClick={() => handleSelectOption(opt.value, opt)}
                  className={cn(
                    "w-full min-w-0 text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-between gap-2",
                    isSelected
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                  )}
                  title={opt.label}
                >
                  <span className="truncate min-w-0 flex-1">{opt.label}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    );

    return (
      <div className={cn("w-full relative", className)} ref={containerRef}>
        {label && (
          <label
            htmlFor={name}
            className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        {/* Hidden select for fallback native form submissions */}
        <select
          ref={(e) => {
            hiddenSelectRef.current = e;
            if (typeof ref === "function") ref(e);
            else if (ref) ref.current = e;
          }}
          name={name}
          id={name}
          value={selectedValue}
          onChange={(e) => handleSelectOption(e.target.value)}
          className="hidden"
          disabled={disabled}
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
          onClick={handleToggleOpen}
          disabled={disabled}
          className={cn(
            "w-full min-w-0 flex items-center justify-between rounded-xl border px-3 py-2 text-xs text-left outline-none transition-all cursor-pointer font-bold bg-slate-50/40 hover:bg-white focus:bg-white",
            disabled
              ? "bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed"
              : "text-slate-900 border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100/70",
            error &&
            "border-rose-400 bg-rose-50/30 focus:border-rose-600 focus:ring-4 focus:ring-rose-100",
          )}
          title={displayLabel || placeholder}
        >
          <span
            className={cn(
              "truncate min-w-0 flex-1 pr-2",
              displayLabel ? "font-bold text-slate-900" : "text-slate-400 font-medium",
            )}
          >
            {displayLabel || (isLoading ? "Loading..." : placeholder)}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-500 transition-transform shrink-0",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown panel via React Portal into document.body */}
        {isOpen && mounted && typeof document !== "undefined"
          ? createPortal(dropdownContent, document.body)
          : null}

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
