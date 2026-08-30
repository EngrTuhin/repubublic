"use client";

import React, { useMemo } from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export interface TablePaginationProps {
  page?: number;
  setPage?: (page: number | ((p: number) => number)) => void;
  perPage?: number;
  setPerPage?: (perPage: number) => void;
  totalItems?: number;
  totalPages?: number;
  apiResponse?: any;
  displayCount?: number;
  loading?: boolean;
  refetch?: () => void;
  syncWithUrl?: boolean;
  pageParamName?: string;
  perPageParamName?: string;
}

export default function TablePagination({
  page: passedPage = 1,
  setPage,
  perPage: passedPerPage = 20,
  setPerPage,
  totalItems: passedTotalItems,
  totalPages: passedTotalPages,
  apiResponse,
  displayCount = 0,
  loading = false,
  refetch,
  syncWithUrl = true,
  pageParamName = "page",
  perPageParamName = "perpage",
}: TablePaginationProps) {
  // Resolve Total Items from apiResponse payload, passed prop, or fallback display count
  const resolvedTotalItems = useMemo(() => {
    const fromMeta =
      apiResponse?.meta?.total ??
      apiResponse?.data?.meta?.total ??
      apiResponse?.data?.total ??
      apiResponse?.total ??
      passedTotalItems;
    return typeof fromMeta === "number" ? fromMeta : displayCount;
  }, [apiResponse, passedTotalItems, displayCount]);

  // Resolve Per Page from apiResponse payload or passed prop
  const perPage = useMemo(() => {
    const fromMeta =
      apiResponse?.meta?.per_page ??
      apiResponse?.data?.meta?.per_page ??
      apiResponse?.data?.per_page ??
      apiResponse?.per_page ??
      passedPerPage;
    return typeof fromMeta === "number" && fromMeta > 0 ? fromMeta : 10;
  }, [apiResponse, passedPerPage]);

  // Resolve Total Pages from apiResponse payload or compute from total items & per page
  const resolvedTotalPages = useMemo(() => {
    const fromMeta =
      apiResponse?.meta?.last_page ??
      apiResponse?.data?.meta?.last_page ??
      apiResponse?.data?.last_page ??
      apiResponse?.last_page ??
      passedTotalPages;
    if (typeof fromMeta === "number" && fromMeta > 0) return fromMeta;
    return Math.max(1, Math.ceil(resolvedTotalItems / perPage));
  }, [apiResponse, passedTotalPages, resolvedTotalItems, perPage]);

  // Resolve Current Page: prioritize passedPage state so user clicks instantly move to target page
  const currentPage = useMemo(() => {
    if (typeof passedPage === "number" && passedPage > 0) return passedPage;
    const fromMeta =
      apiResponse?.meta?.current_page ??
      apiResponse?.data?.meta?.current_page ??
      apiResponse?.data?.current_page ??
      apiResponse?.current_page;
    return typeof fromMeta === "number" && fromMeta > 0 ? fromMeta : 1;
  }, [passedPage, apiResponse]);

  const startRecord = Math.min((currentPage - 1) * perPage + 1, resolvedTotalItems);
  const endRecord = Math.min(currentPage * perPage, resolvedTotalItems);

  const updateUrl = (newPage: number, newPerPage: number) => {
    if (!syncWithUrl || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set(pageParamName, String(newPage));
    url.searchParams.set(perPageParamName, String(newPerPage));
    window.history.pushState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (!setPage) return;
    const targetPage = Math.max(1, Math.min(resolvedTotalPages || 1, newPage));
    setPage(targetPage);
    updateUrl(targetPage, perPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (setPerPage) setPerPage(newPerPage);
    if (setPage) setPage(1);
    updateUrl(1, newPerPage);
  };

  // Generate page sequence: 1, 2, 3, 4, 5, 6 ... N
  const getPageItems = () => {
    const items: Array<{ type: "page" | "ellipsis"; value: number; label: string }> = [];
    const maxVisible = 7;

    if (resolvedTotalPages <= maxVisible) {
      for (let i = 1; i <= resolvedTotalPages; i++) {
        items.push({ type: "page", value: i, label: String(i) });
      }
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 6; i++) {
        items.push({ type: "page", value: i, label: String(i) });
      }
      items.push({ type: "ellipsis", value: 7, label: "..." });
      items.push({ type: "page", value: resolvedTotalPages, label: String(resolvedTotalPages) });
    } else if (currentPage >= resolvedTotalPages - 3) {
      items.push({ type: "page", value: 1, label: "1" });
      items.push({ type: "ellipsis", value: resolvedTotalPages - 6, label: "..." });
      for (let i = resolvedTotalPages - 5; i <= resolvedTotalPages; i++) {
        items.push({ type: "page", value: i, label: String(i) });
      }
    } else {
      items.push({ type: "page", value: 1, label: "1" });
      items.push({ type: "ellipsis", value: Math.max(1, currentPage - 4), label: "..." });
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        items.push({ type: "page", value: i, label: String(i) });
      }
      items.push({ type: "ellipsis", value: Math.min(resolvedTotalPages, currentPage + 4), label: "..." });
      items.push({ type: "page", value: resolvedTotalPages, label: String(resolvedTotalPages) });
    }

    return items;
  };

  return (
    <div className="bg-slate-100/90 px-3.5 py-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      <div className="flex items-center gap-3">
        <span className="font-bold text-slate-700 text-[11px]">
          Showing <span className="font-extrabold text-slate-900">{resolvedTotalItems > 0 ? startRecord : 0}</span> to{" "}
          <span className="font-extrabold text-slate-900">{endRecord}</span> of{" "}
          <span className="font-extrabold text-blue-700">{resolvedTotalItems}</span> entries
        </span>

        {setPerPage && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-600">Rows:</span>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[11px] font-extrabold text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* First & Prev Page */}
        <button
          disabled={currentPage <= 1 || loading}
          onClick={() => handlePageChange(1)}
          className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer text-slate-800"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          disabled={currentPage <= 1 || loading}
          onClick={() => handlePageChange(currentPage - 1)}
          className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer text-slate-800"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Dynamic Page Buttons: 1, 2, 3, 4, 5, 6 ... N */}
        <div className="flex items-center gap-1 px-1">
          {getPageItems().map((item, idx) =>
            item.type === "page" ? (
              <button
                key={idx}
                onClick={() => handlePageChange(item.value)}
                className={`min-w-[26px] h-6 px-2 text-[11px] font-extrabold rounded border transition-all cursor-pointer ${
                  currentPage === item.value
                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs scale-105"
                    : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ) : (
              <button
                key={idx}
                onClick={() => handlePageChange(item.value)}
                className="px-1.5 h-6 text-[11px] font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                title={`Jump to page ${item.value}`}
              >
                {item.label}
              </button>
            )
          )}
        </div>

        {/* Next & Last Page */}
        <button
          disabled={currentPage >= resolvedTotalPages || loading}
          onClick={() => handlePageChange(currentPage + 1)}
          className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer text-slate-800"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          disabled={currentPage >= resolvedTotalPages || loading}
          onClick={() => handlePageChange(resolvedTotalPages)}
          className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer text-slate-800"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
