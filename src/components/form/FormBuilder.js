"use client";

import React from "react";
import FormField from "./FormField";
import Button from "@/components/ui/Button";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormBuilder({ config, hookData }) {
  const {
    isEditMode,
    activeTab,
    setActiveTab,
    isSaving,
    register,
    handleSubmit,
    setValue,
    errors,
    watch,
    onSubmit,
    getOptionsForField,
    saveSuccess,
    errorMessage,
  } = hookData;

  // Render Section components based on configuration schemas
  const renderSection = (section) => {
    const sectionColSpan = section.class || section.className || "col-span-12";

    return (
      <div
        key={section.id || section.title || section.groupName}
        className={`${sectionColSpan} ${section.containerClass || ""}`}
      >
        {(section.title || section.groupName) && (
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-100 flex items-center gap-2">
            <span className="w-1 h-3 bg-blue-600 rounded-full shadow-sm shadow-blue-500/50"></span>
            {section.title || section.groupName}
          </h3>
        )}
        <div className="grid grid-cols-12 gap-x-3.5 gap-y-1">
          {(section.fields || []).map((field) => (
            <FormField
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
              isEditMode={isEditMode}
              hookData={hookData}
              options={getOptionsForField(field)}
            />
          ))}
        </div>
      </div>
    );
  };

  const isTabBased = config.type === "tab-based" || config.type === "tab-base";

  // Calculate tab navigation helpers
  const currentTabIndex = isTabBased
    ? config.tabs.findIndex((t) => t.id === activeTab)
    : -1;
  const isFirstTab = isTabBased ? currentTabIndex === 0 : true;
  const isLastTab = isTabBased
    ? currentTabIndex === config.tabs.length - 1
    : true;
  const prevTab =
    isTabBased && !isFirstTab ? config.tabs[currentTabIndex - 1] : null;
  const nextTab =
    isTabBased && !isLastTab ? config.tabs[currentTabIndex + 1] : null;

  return (
    <div className="space-y-4">
      {/* Dynamic Status Banner */}
      <AnimatePresence mode="wait">
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-sm"
          >
            <LucideIcons.CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Underwriting saved successfully! Redirecting...</span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-bold shadow-sm"
          >
            <LucideIcons.AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs list if configured */}
      {isTabBased && (
        <div className="border-b border-slate-200 flex items-center gap-1.5 mb-4 bg-white p-1.5 rounded-xl shadow-sm overflow-x-auto scrollbar-none">
          {config.tabs.map((tab) => {
            const TabIconComponent =
              LucideIcons[tab.icon] || LucideIcons.Shield;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <TabIconComponent className="w-3.5 h-3.5" />
                {tab.label || tab.tabName}
              </button>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
          {isTabBased ? (
            // Tab Based Rendering with Framer Motion Animation
            config.tabs.map((tab) => {
              if (activeTab !== tab.id) return null;

              return (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-12 gap-3.5 items-start">
                    {(tab.sections || tab.Group || []).map((s) =>
                      renderSection(s),
                    )}
                  </div>

                  {/* Tab Action Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <div>
                      {prevTab && (
                        <button
                          type="button"
                          onClick={() => setActiveTab(prevTab.id)}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all shadow-sm cursor-pointer"
                        >
                          {"← Back: "}
                          {prevTab.label || prevTab.tabName}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {nextTab ? (
                        <Button
                          type="button"
                          onClick={() => setActiveTab(nextTab.id)}
                          variant="primary"
                          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                        >
                          {"Next: "}
                          {nextTab.label || nextTab.tabName}
                          {" →"}
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isSaving}
                          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg shadow-md cursor-pointer"
                        >
                          <LucideIcons.Save className="w-3.5 h-3.5" />
                          {isEditMode
                            ? "Update Underwriting"
                            : "Save Underwriting"}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            // Regular Layout Rendering
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-12 gap-3.5 items-start">
                {(config.sections || config.Group || []).map((s) =>
                  renderSection(s),
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg shadow-md cursor-pointer"
                >
                  <LucideIcons.Save className="w-3.5 h-3.5" />
                  {isEditMode ? "Update Underwriting" : "Save Underwriting"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
