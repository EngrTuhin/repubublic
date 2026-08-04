"use client";

import React, { use } from "react";
import Link from "next/link";
import FormBuilder from "@/components/form/FormBuilder";
import PageHeader from "@/components/layout/PageHeader";
import { useOmpUnderwriting } from "@/features/omp/useOmpUnderwriting";
import { ompUnderwritingLayoutConfig } from "@/features/omp/config/fields";
import * as LucideIcons from "lucide-react";

export default function OmpEditPage({ params }) {
  const { id } = use(params);
  const hookData = useOmpUnderwriting(id);
  const { isEditMode, isLoadingData, loadError, underwritingData } = hookData;

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <LucideIcons.Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-sm text-slate-500 font-semibold">Loading OMP proposal...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
        <LucideIcons.Info className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Failed to Load</h3>
        <p className="text-slate-500 text-sm">The OMP proposal could not be retrieved from the server.</p>
        <Link
          href="/underwriting/omp"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-xs"
        >
          <LucideIcons.ArrowLeft className="w-4 h-4" /> Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-350">
      <div className="flex items-center gap-4">
        <Link
          href="/underwriting/omp"
          className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <LucideIcons.ArrowLeft className="w-5 h-5" />
        </Link>
        <PageHeader
          title={`Edit OMP: OMP-${id}`}
          description={`Update proposal for ${underwritingData?.insured_name || "this insured"}.`}
        />
      </div>

      <FormBuilder config={ompUnderwritingLayoutConfig} hookData={hookData} />
    </div>
  );
}
