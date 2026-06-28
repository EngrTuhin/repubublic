import React from "react";
import TextInput from "./fields/TextInput";
import SelectInput from "./fields/SelectInput";
import TextareaInput from "./fields/TextareaInput";
import * as LucideIcons from "lucide-react";

export default function FormField({
  field,
  register,
  errors,
  watch,
  isEditMode,
  hookData,
  options,
  onOptionSelect,
  ...props
}) {
  const {
    name,
    label,
    type,
    required,
    placeholder,
    readOnly,
    className,
    step,
    endpoint,
    valueKey,
    labelKey,
    isSearchable,
    mappingTemplate,
    colSpan,
    showIf,
    searchKey,
    onSearch,
  } = field;

  // 1. Check showIf conditions
  if (showIf && typeof watch === "function") {
    const parentValue = watch(showIf.field);
    if (parentValue !== showIf.value) {
      return null;
    }
  }

  const validationRules = required ? { required: `${label} is required` } : {};
  const staticOptions = options || field.options || [];

  let inputContent = null;

  switch (type) {
    case "search":
      inputContent = (
        <div className="flex items-end gap-2 w-full">
          {isEditMode ? (
            <TextInput
              label={label}
              readOnly
              className="bg-slate-50"
              {...register(searchKey)}
            />
          ) : (
            <>
              <TextInput
                label={label}
                placeholder={placeholder}
                {...register(name)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={hookData[onSearch]}
                className="py-1.5 px-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 rounded-lg transition-all cursor-pointer"
              >
                <LucideIcons.Search className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      );
      break;

    case "select":
      inputContent = (
        <SelectInput
          label={label}
          name={name}
          placeholder={placeholder}
          options={staticOptions}
          endpoint={endpoint}
          watch={watch}
          control={hookData?.control}
          valueKey={valueKey}
          labelKey={labelKey}
          isSearchable={isSearchable}
          mappingTemplate={mappingTemplate}
          disabled={readOnly}
          {...register(name, validationRules)}
          error={errors[name]}
          onOptionSelect={(opt) => {
            if (typeof field.onChange === "function") {
              field.onChange(opt, hookData?.setValue, hookData?.getValues);
            }

            if (field.autoFill && hookData?.setValue) {
              Object.entries(field.autoFill).forEach(
                ([targetField, sourcePath]) => {
                  if (sourcePath.startsWith("raw.")) {
                    const prop = sourcePath.substring(4);
                    const val = opt?.raw?.[prop] || "";
                    hookData.setValue(targetField, val);
                  } else if (sourcePath === "label") {
                    hookData.setValue(targetField, opt?.label || "");
                  } else if (sourcePath === "value") {
                    hookData.setValue(targetField, opt?.value || "");
                  }
                },
              );
            }

            if (typeof onOptionSelect === "function") {
              onOptionSelect(opt);
            }
          }}
          {...props}
        />
      );
      break;

    case "textarea":
      inputContent = (
        <TextareaInput
          label={label}
          placeholder={placeholder}
          readOnly={readOnly}
          className={className}
          {...register(name, validationRules)}
          error={errors[name]}
          {...props}
        />
      );
      break;

    case "checkbox":
      const { onChange: checkOnChange, ...checkRegister } = register(name, validationRules);
      inputContent = (
        <div className="flex flex-col py-1">
          <div className="flex items-center gap-2">
            <input
              id={name}
              type="checkbox"
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              {...checkRegister}
              onChange={(e) => {
                checkOnChange(e);
                if (typeof field.onChange === "function") {
                  field.onChange(e, hookData?.setValue, hookData?.getValues);
                }
              }}
              {...props}
            />
            <label
              htmlFor={name}
              className="text-xs font-bold text-slate-700 cursor-pointer select-none"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
          {errors[name] && (
            <p className="mt-1.5 text-xs text-red-650">
              {errors[name].message}
            </p>
          )}
        </div>
      );
      break;

    case "radio":
      const { onChange: radioOnChange, ...radioRegister } = register(name, validationRules);
      inputContent = (
        <div className="space-y-1 py-1">
          {label && (
            <span className="block text-xs font-bold text-slate-700 mb-0.5">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {staticOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-1.5 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  value={opt.value}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                  {...radioRegister}
                  onChange={(e) => {
                    radioOnChange(e);
                    if (typeof field.onChange === "function") {
                      field.onChange(e, hookData?.setValue, hookData?.getValues);
                    }
                  }}
                  {...props}
                />
                <span className="text-xs font-semibold text-slate-700">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          {errors[name] && (
            <p className="mt-1.5 text-xs text-red-650">
              {errors[name].message}
            </p>
          )}
        </div>
      );
      break;

    default:
      const { onChange: formOnChange, ...restRegister } = register(name, validationRules);
      inputContent = (
        <TextInput
          label={label}
          type={type}
          step={step}
          placeholder={placeholder}
          readOnly={readOnly}
          className={className}
          {...restRegister}
          onChange={(e) => {
            formOnChange(e);
            if (typeof field.onChange === "function") {
              field.onChange(e, hookData?.setValue, hookData?.getValues);
            }
          }}
          error={errors[name]}
          {...props}
        />
      );
      break;
  }

  return <div className={colSpan || ""}>{inputContent}</div>;
}
