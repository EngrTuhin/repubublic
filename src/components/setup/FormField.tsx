"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import SelectInput from "@/components/form/fields/SelectInput";
import RichTextareaInput from "@/components/form/fields/RichTextareaInput";
import ImageFileInput from "@/components/form/fields/ImageFileInput";

export interface FormFieldConfig {
  name?: string;
  label?: string;
  type?: "text" | "number" | "float" | "decimal" | "integer" | "select" | "textarea" | "group" | string;
  title?: string;
  children?: FormFieldConfig[];
  required?: boolean;
  colSpan?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string | number;
  options?: Array<{ label: string; value: any }>;
  endpoint?: string;
  mappingTemplate?: string | ((data: any) => any);
  responseKey?: string;
  valueKey?: string;
  labelKey?: string;
  isSearchable?: boolean;
  isMultiple?: boolean;
  optionLabel?: string;
  optionValue?: string;
  placeholderOption?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface FormFieldProps {
  field: FormFieldConfig;
  register?: any;
  errors?: Record<string, any>;
  formData?: Record<string, any>;
  handleInputChange?: (field: string, value: any) => void;
  form?: any;
  control?: any;
  watch?: any;
}

function FieldGroupRepeater({
  field,
  register,
  errors = {},
  formData = {},
  handleInputChange,
  form,
  control,
  watch,
}: FormFieldProps) {
  const colSpan = field.colSpan || "col-span-12";
  const fieldName = field.name || "";
  const groupTitle = field.label || field.title || "Field Group";
  const groupName = fieldName || "group_items";

  const isKeyValuePair = field.children?.some((c) => c.name === "key") && field.children?.some((c) => c.name === "value");

  const createNewRow = (initialData: any = {}) => ({
    _id: Math.random().toString(36).substring(2, 9),
    key: initialData.key || "",
    value: initialData.value !== undefined ? initialData.value : "",
    ...initialData,
  });

  const getInitialRows = () => {
    const rawData = formData[groupName];
    if (Array.isArray(rawData) && rawData.length > 0) {
      return rawData.map((r) => createNewRow(r));
    }
    if (rawData && typeof rawData === "object" && !Array.isArray(rawData)) {
      const entries = Object.entries(rawData).map(([k, v]) => ({ key: k, value: v }));
      if (entries.length > 0) return entries.map((r) => createNewRow(r));
    }
    return [createNewRow()];
  };

  const [rows, setRows] = useState<any[]>(getInitialRows);

  // Focus-Lock: sync rows only when record ID changes or modal re-opens
  const recordId = formData?.id;
  const prevRecordIdRef = useRef(recordId);

  useEffect(() => {
    if (recordId !== prevRecordIdRef.current) {
      prevRecordIdRef.current = recordId;
      setRows(getInitialRows());
    }
  }, [recordId]);

  const syncToForm = (currentRows: any[]) => {
    // Strip internal _id and preserve exact insertion order
    const payloadValue: any = currentRows.map(({ _id, ...rest }) => ({
      ...rest,
      value: rest.value !== undefined && rest.value !== null && rest.value !== "" ? (isNaN(Number(rest.value)) ? rest.value : Number(rest.value)) : "",
    }));

    if (handleInputChange && groupName) {
      handleInputChange(groupName, payloadValue);
    }
    if (form?.setValue && groupName) {
      form.setValue(groupName, payloadValue, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleAddRow = () => {
    const nextRows = [...rows, createNewRow()];
    setRows(nextRows);
    syncToForm(nextRows);
  };

  const handleRemoveRow = (idToRemove: string) => {
    let nextRows = rows.filter((r) => r._id !== idToRemove);
    if (nextRows.length === 0) {
      nextRows = [createNewRow()];
    }
    setRows(nextRows);
    syncToForm(nextRows);
  };

  const handleChildChange = (rowIndex: number, childName: string, val: any) => {
    const nextRows = rows.map((r, i) => {
      if (i === rowIndex) {
        return { ...r, [childName]: val };
      }
      return r;
    });
    setRows(nextRows);
    syncToForm(nextRows);
  };

  return (
    <div className={`${colSpan} bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 space-y-3.5 shadow-2xs`}>
      {/* Group Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            {groupTitle}
          </h4>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
            {rows.length} {rows.length === 1 ? "Entry" : "Entries"}
          </span>
        </div>
      </div>

      {/* Group Item Rows */}
      <div className="space-y-3">
        {rows.map((rowItem, rowIndex) => (
          <div
            key={rowItem._id}
            className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs relative transition-all hover:border-slate-300 space-y-2 group/row"
          >
            {/* Row Header & Remove Button */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Entry #{rowIndex + 1}</span>
              </span>
              <button
                type="button"
                onClick={() => handleRemoveRow(rowItem._id)}
                className="p-1 px-2 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold active:scale-95"
                title="Remove Entry"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Remove</span>
              </button>
            </div>

            {/* Children Inputs Grid */}
            <div className="grid grid-cols-12 gap-3">
              {field.children?.map((childField) => (
                <FormField
                  key={`${rowItem._id}-${childField.name || childField.label}`}
                  field={childField}
                  formData={rowItem}
                  handleInputChange={(cName, val) => handleChildChange(rowIndex, cName, val)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Append Entry Button */}
      <div className="pt-1.5">
        <button
          type="button"
          onClick={handleAddRow}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold text-blue-600 bg-white hover:bg-blue-50/70 border border-blue-200/90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Append Entry</span>
        </button>
      </div>
    </div>
  );
}

export default function FormField({
  field,
  register,
  errors = {},
  formData = {},
  handleInputChange,
  form,
  control,
  watch,
}: FormFieldProps) {
  const colSpan = field.colSpan || "col-span-12";
  const fieldName = field.name || "";
  const fieldError = fieldName ? errors[fieldName]?.message : undefined;

  const isNumberType =
    field.type === "number" ||
    field.type === "float" ||
    field.type === "decimal" ||
    field.type === "integer";

  const isFloatType =
    field.type === "float" ||
    field.type === "decimal" ||
    field.type === "number";

  // Delegate Dynamic Repeater Field Groups to dedicated FieldGroupRepeater component
  if (field.type === "group" && field.children) {
    return (
      <FieldGroupRepeater
        field={field}
        register={register}
        errors={errors}
        formData={formData}
        handleInputChange={handleInputChange}
        form={form}
        control={control}
        watch={watch}
      />
    );
  }

  const regProps = register && fieldName
    ? register(fieldName, {
        required: field.required,
        setValueAs: (v: any) => {
          if (v === "true") return true;
          if (v === "false") return false;
          return v;
        },
      })
    : {};

  const handleSelectChange = (e: any) => {
    const rawVal = e?.target?.value !== undefined ? e.target.value : e;
    if (regProps.onChange) {
      regProps.onChange(e);
    }
    if (handleInputChange && fieldName) {
      handleInputChange(fieldName, rawVal);
    }
    if (form?.setValue && fieldName) {
      form.setValue(fieldName, rawVal, { shouldValidate: true, shouldDirty: true });
    }
  };

  const fieldValue = fieldName && formData[fieldName] !== undefined && formData[fieldName] !== null
    ? formData[fieldName]
    : undefined;

  return (
    <div className={colSpan}>
      {field.label && (
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
          <span>{field.label}</span>
          {field.required && (
            <span className="text-rose-500 font-extrabold ml-1">*</span>
          )}
        </label>
      )}

      {field.type === "file" || field.type === "image" ? (
        <ImageFileInput
          label=""
          name={fieldName}
          placeholder={field.placeholder}
          disabled={field.disabled || field.readOnly}
          required={field.required}
          value={
            fieldName && formData[fieldName] !== undefined && formData[fieldName] !== null
              ? formData[fieldName]
              : form?.watch && fieldName
              ? form.watch(fieldName) || ""
              : ""
          }
          onChange={(val: any) => {
            if (handleInputChange && fieldName) {
              handleInputChange(fieldName, val);
            }
            if (form?.setValue && fieldName) {
              form.setValue(fieldName, val, { shouldValidate: true, shouldDirty: true });
            }
          }}
          error={fieldError}
        />
      ) : field.type === "richtext" || field.type === "wysiwyg" || field.type === "textarea" ? (
        <RichTextareaInput
          label=""
          name={fieldName}
          placeholder={field.placeholder}
          readOnly={field.readOnly || field.disabled}
          required={field.required}
          value={
            fieldName && formData[fieldName] !== undefined && formData[fieldName] !== null
              ? formData[fieldName]
              : form?.watch && fieldName
              ? form.watch(fieldName) || ""
              : ""
          }
          onChange={(content: string) => {
            if (handleInputChange && fieldName) {
              handleInputChange(fieldName, content);
            }
            if (form?.setValue && fieldName) {
              form.setValue(fieldName, content, { shouldValidate: true, shouldDirty: true });
            }
          }}
          error={fieldError}
        />
      ) : field.type === "select" ? (
        <SelectInput
          {...regProps}
          label=""
          name={fieldName}
          value={fieldValue}
          placeholder={field.placeholder || field.placeholderOption || "Select an option"}
          options={field.options || []}
          endpoint={field.endpoint}
          mappingTemplate={field.mappingTemplate}
          responseKey={field.responseKey}
          valueKey={field.valueKey || field.optionValue || "id"}
          labelKey={field.labelKey || field.optionLabel || "name"}
          isSearchable={field.isSearchable ?? true}
          isMultiple={field.isMultiple}
          error={fieldError}
          control={form?.control || control}
          watch={form?.watch || watch}
          disabled={field.disabled || field.readOnly}
          onChange={handleSelectChange}
        />
      ) : (
        <input
          type={isNumberType ? "number" : field.type || "text"}
          min={field.min}
          max={field.max}
          step={field.step || (isFloatType ? "any" : field.type === "integer" ? "1" : undefined)}
          required={field.required}
          {...(register && fieldName
            ? register(fieldName, {
                required: field.required,
                valueAsNumber: isNumberType,
              })
            : {})}
          value={
            !register && fieldName
              ? formData[fieldName] !== undefined
                ? formData[fieldName]
                : ""
              : undefined
          }
          onChange={
            !register && handleInputChange && fieldName
              ? (e) =>
                  handleInputChange(
                    fieldName,
                    isNumberType
                      ? e.target.value === ""
                        ? ""
                        : field.type === "integer"
                        ? parseInt(e.target.value, 10)
                        : parseFloat(e.target.value)
                      : e.target.value
                  )
              : undefined
          }
          placeholder={field.placeholder}
          className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-slate-900 transition-all outline-none ${
            isNumberType || fieldName.includes("code")
              ? "font-mono"
              : ""
          } ${
            fieldError
              ? "border-rose-400 bg-rose-50/30 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              : "border-slate-300 bg-slate-50/40 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100/70"
          }`}
        />
      )}

      {fieldError && (
        <p className="text-[10px] font-extrabold text-rose-600 mt-1 flex items-center gap-1">
          <span>•</span>
          <span>{String(fieldError)}</span>
        </p>
      )}
    </div>
  );
}
