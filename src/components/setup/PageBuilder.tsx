"use client";

import React, { useMemo } from "react";
import {
  RotateCcw,
  Plus,
} from "lucide-react";
import { TableConfig, TableColumn } from "@/global-config/types/tableConfig";
import TablePagination from "@/components/ui/TablePagination";
import TableSearch from "@/components/ui/TableSearch";
import FormModal from "@/components/setup/FormModal";
import ToastManager from "@/components/setup/ToastManager";

export interface PageBuilderProps {
  tableConfig: TableConfig;
  formConfig?: any;
  formFieldsConfig?: any;
  responseKey?: string;
  state?: any;
  hook?: any;
  [key: string]: any;
}

export default function PageBuilder(props: PageBuilderProps) {
  const tableConfig = props.tableConfig;
  const formConfig = props.formConfig;
  const formFieldsConfig =
    props.formFieldsConfig ||
    formConfig?.fields ||
    (Array.isArray(formConfig) ? formConfig : []);
  const formModalWidth =
    formConfig?.modalWidth ||
    tableConfig?.modalWidth;
  const responseKey = props.responseKey || tableConfig.responseKey;

  // Resolve state source (supports state={...}, hook={...}, or spread props {...state})
  const ctx = props.state || props.hook || props;

  const {
    apiResponse,
    loading = false,
    searchTerm = "",
    setSearchTerm,
    page = 1,
    setPage,
    perPage = 10,
    setPerPage,
    isModalOpen = false,
    editingItem = ctx.editingBand || ctx.editingItem,
    successMessage = null,
    errorMessage = null,
    openCreateModal,
    openEditModal,
    closeModal,
    refetch,
    handleInputChange = ctx.handleInputChange,
    handleSubmit = ctx.handleSubmit,
    handleDelete = ctx.handleDelete,
    handleResetFilters = ctx.handleResetFilters,
  } = ctx;

  const [activeActionSubmit, setActiveActionSubmit] = React.useState<any>(null);

  const renderHelpers = useMemo(
    () => ({
      ...ctx,
      setActiveActionSubmit,
    }),
    [ctx]
  );

  // Top Add Button click handler: uses tableConfig.onClick if specified, otherwise defaults to openCreateModal
  const handleAddClick = () => {
    setActiveActionSubmit(null);
    if (typeof tableConfig.onClick === "function") {
      tableConfig.onClick(ctx);
      return;
    }
    if (typeof tableConfig.onClick === "string" && tableConfig.onClick.trim() !== "") {
      const fnName = tableConfig.onClick.trim();
      if (typeof ctx[fnName] === "function") {
        ctx[fnName]();
        return;
      }
    }

    if (openCreateModal) {
      openCreateModal();
    }
  };

  // Modal Form submit handler: uses active action onSubmit or tableConfig.onSubmit if specified, otherwise defaults to handleSubmit
  const resolvedSubmit = useMemo(() => {
    const targetSubmit = activeActionSubmit || tableConfig.onSubmit;

    if (typeof targetSubmit === "function") {
      return targetSubmit;
    }
    if (
      typeof targetSubmit === "string" &&
      targetSubmit.trim() !== "" &&
      typeof ctx[targetSubmit.trim()] === "function"
    ) {
      return ctx[targetSubmit.trim()];
    }
    return handleSubmit;
  }, [activeActionSubmit, tableConfig.onSubmit, handleSubmit, ctx]);

  // Resolve Add Button visibility (defaults to true unless explicitly set to false)
  const isAddButtonVisible = useMemo(() => {
    if (tableConfig.addButtonVisibility === false) return false;
    if (typeof tableConfig.addButtonVisibility === "function") {
      return Boolean(tableConfig.addButtonVisibility(ctx));
    }
    if (tableConfig.addButtonVisibility === true) return true;

    if (tableConfig.visibility === false) return false;
    if (typeof tableConfig.visibility === "function") {
      return Boolean(tableConfig.visibility(ctx));
    }
    if (typeof tableConfig.visibility === "object" && tableConfig.visibility !== null) {
      if (tableConfig.visibility.addButton === false) return false;
      if (tableConfig.visibility.addButton === true) return true;
    }
    return true;
  }, [tableConfig.addButtonVisibility, tableConfig.visibility, ctx]);

  // Resolve Search visibility (defaults to true unless explicitly set to false)
  const isSearchVisible = useMemo(() => {
    if (tableConfig.searchVisibility === false) return false;
    if (typeof tableConfig.searchVisibility === "function") {
      return Boolean(tableConfig.searchVisibility(ctx));
    }
    if (tableConfig.searchVisibility === true) return true;

    if (tableConfig.visibility === false) return false;
    if (typeof tableConfig.visibility === "function") {
      return Boolean(tableConfig.visibility(ctx));
    }
    if (typeof tableConfig.visibility === "object" && tableConfig.visibility !== null) {
      if (tableConfig.visibility.search === false) return false;
      if (tableConfig.visibility.search === true) return true;
    }
    return true;
  }, [tableConfig.searchVisibility, tableConfig.visibility, ctx]);

  // Extract react-hook-form helpers from form instance if sent
  const form = ctx.form;
  const register = form?.register || ctx.register;
  const errors = form?.formState?.errors || ctx.errors || {};
  const formData = form?.watch ? form.watch() : ctx.formData || {};

  // Item resolution driven by responseKey or backend response
  const displayItems = useMemo(() => {
    let raw;
    if (responseKey) {
      raw = apiResponse?.[responseKey] ?? apiResponse?.data?.[responseKey] ?? ctx?.[responseKey];
    }
    if (!raw) {
      raw = ctx?.items ?? apiResponse?.data?.data ?? apiResponse?.data ?? apiResponse;
    }
    return Array.isArray(raw) ? raw : [];
  }, [apiResponse, ctx, responseKey]);

  const renderCellContent = (col: TableColumn, item: any) => {
    if (col.render) {
      return col.render(item, renderHelpers);
    }

    const val = item[col.key];
    return (
      <div className={col.className || "text-xs font-semibold text-slate-900"}>
        {val !== undefined && val !== null ? String(val) : "-"}
      </div>
    );
  };

  return (
    <div className="space-y-2.5 w-full pb-4 animate-in fade-in duration-150 select-none">
      <ToastManager
        successMessage={successMessage}
        errorMessage={errorMessage}
        setSuccessMessage={ctx.setSuccessMessage}
        setErrorMessage={ctx.setErrorMessage}
      />
      {/* Control & Header Strip Driven by Config */}
      <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-sm font-black text-slate-900 leading-tight">
              {tableConfig.title}
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold truncate">
              {tableConfig.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 grow sm:grow-0 justify-end">
          {/* Reusable Table Search Component */}
          {isSearchVisible && (
            <TableSearch
              value={searchTerm}
              onChange={(val) => setSearchTerm && setSearchTerm(val)}
              placeholder={tableConfig.searchPlaceholder}
              refetch={refetch}
            />
          )}

          {isSearchVisible && searchTerm && handleResetFilters && (
            <button
              onClick={handleResetFilters}
              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              title="Reset Search"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {isAddButtonVisible && (
            <button
              onClick={handleAddClick}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{tableConfig.addButtonLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Compact Data Table Driven By Config & State */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-230px)]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-800">
                {tableConfig.columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider ${col.key === "actions" ? "text-right" : ""
                      }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {loading && displayItems.length === 0 ? (
                <tr>
                  <td colSpan={tableConfig.columns.length} className="px-3 py-8 text-center text-xs font-bold text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Loading records from database...
                    </div>
                  </td>
                </tr>
              ) : displayItems.length === 0 ? (
                <tr>
                  <td colSpan={tableConfig.columns.length} className="px-3 py-8 text-center text-xs font-bold text-slate-600">
                    {tableConfig.emptyMessage}
                  </td>
                </tr>
              ) : (
                displayItems.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    {tableConfig.columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-3 py-1.5 ${col.key === "actions" ? "text-right" : ""
                          }`}
                      >
                        {renderCellContent(col, item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Table Pagination Component */}
        <TablePagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          apiResponse={apiResponse}
          displayCount={displayItems.length}
          loading={loading}
          refetch={refetch}
        />
      </div>

      {/* Modal Form Popup Component */}
      <FormModal
        isOpen={Boolean(isModalOpen && closeModal && resolvedSubmit)}
        onClose={closeModal}
        onSubmit={resolvedSubmit}
        formFieldsConfig={formFieldsConfig}
        editingItem={editingItem}
        loading={loading}
        register={register}
        errors={errors}
        form={form}
        formData={formData}
        handleInputChange={handleInputChange}
        modalWidth={formModalWidth}
        modalClassName={tableConfig?.modalClassName}
      />
    </div>
  );
}
