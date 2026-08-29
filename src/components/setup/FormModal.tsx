"use client";

import React from "react";
import { Sparkles, Edit3, PlusCircle, Loader2, X } from "lucide-react";
import FormField, { FormFieldConfig } from "./FormField";

export type { FormFieldConfig };

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formFieldsConfig: FormFieldConfig[];
  editingItem?: any;
  loading?: boolean;
  register?: any;
  errors?: Record<string, any>;
  form?: any;
  formData?: Record<string, any>;
  handleInputChange?: (field: string, value: any) => void;
  title?: string;
  modalWidth?: string;
  modalClassName?: string;
}

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  formFieldsConfig = [],
  editingItem = null,
  loading = false,
  register,
  errors = {},
  form,
  formData = {},
  handleInputChange,
  title,
  modalWidth,
  modalClassName,
}: FormModalProps) {
  if (!isOpen) return null;

  const isEdit = Boolean(editingItem);
  const modalTitle = title || (isEdit ? "Edit Record" : "Create New Record");
  const widthClass =
    modalWidth ||
    (formFieldsConfig as any)?.modalWidth ||
    modalClassName ||
    "max-w-lg";

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 select-none">
      <div className={`bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full overflow-hidden flex flex-col max-h-[90vh] ${widthClass}`}>
        {/* Clean Light Header */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border flex items-center justify-center ${isEdit
                ? "bg-blue-50 text-blue-600 border-blue-100 shadow-2xs"
                : "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-2xs"
                }`}
            >
              {isEdit ? (
                <Edit3 className="w-4 h-4" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
                <span>{modalTitle}</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                {isEdit
                  ? "Modify parameters for this record"
                  : "Fill in the required information below"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
            title="Close Form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body using common FormField component */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-12 gap-3.5">
              {formFieldsConfig.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  register={register}
                  errors={errors}
                  form={form}
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              ))}
            </div>
          </div>

          {/* Sticky Form Footer Actions */}
          <div className="px-5 py-3.5 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs font-black shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEdit ? "Save Changes" : "Submit Record"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
