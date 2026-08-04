"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import {
  useGetPaInsurancesQuery,
  useDeletePaInsuranceMutation,
} from "@/features/personal-accident/paApi";
import {
  Search,
  Shield,
  Calendar,
  DollarSign,
  Trash2,
  Edit2,
  HeartPulse,
} from "lucide-react";

const OCCUPATION_LABELS = {
  accountant: "Accountant",
  banker: "Banker",
  barrister: "Barrister / Lawyer",
  doctor: "Medical Practitioner",
  mercantile_assistant: "Mercantile Assistant",
  executive: "Executive / Admin Officer",
  clerical: "Clerical Staff",
  architect: "Architect",
  planter: "Planter",
  electrical_engineer: "Electrical Engineer",
  master_tradesman: "Master Tradesman",
  motor_engineer: "Motor Engineer",
  veterinary_surgeon: "Veterinary Surgeon",
  manual_worker: "Manual Worker",
};

const TABLE_TYPE_LABELS = {
  table_a: "Table A — Death & Full Disability",
  table_b: "Table B — Death & Permanent Disability",
  table_c: "Table C — Death Only",
};

const CLASS_LABELS = {
  class_1: "Class I — Low Risk",
  class_2: "Class II — Medium Risk",
  class_3: "Class III — High Risk",
};

export default function PersonalAccidentListPage() {
  const { data: apiResponse, isLoading, error } = useGetPaInsurancesQuery();
  const [deletePaInsurance] = useDeletePaInsuranceMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const raw = apiResponse?.data?.data ?? apiResponse?.data ?? [];
  const policies = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this PA proposal?")) {
      try {
        await deletePaInsurance(id).unwrap();
      } catch (err) {
        alert("Failed to delete: " + (err?.data?.message || err?.message || "Server error"));
      }
    }
  };

  const filtered = policies.filter((item) => {
    const occ = (OCCUPATION_LABELS[item.risk_class] || item.risk_class || "").toLowerCase();
    return (
      occ.includes(searchTerm.toLowerCase()) ||
      String(item.id).includes(searchTerm) ||
      (item.total || "").includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-350">
      <PageHeader
        title="Personal Accident Proposals"
        description="Manage all PA underwriting proposals — edit and delete."
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold">
          Failed to load data: {error?.message || JSON.stringify(error)}
        </div>
      )}

      {/* Summary widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Proposals</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">{policies.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Gross Premium</p>
            <h3 className="text-xl font-black text-slate-800 mt-1 font-mono">
              BDT{" "}
              {policies
                .reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
                .toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Sum Insured</p>
            <h3 className="text-xl font-black text-slate-800 mt-1 font-mono">
              BDT{" "}
              {policies
                .reduce((sum, item) => sum + (parseFloat(item.insamt) || 0), 0)
                .toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by occupation, ID or premium..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold placeholder-slate-400 text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "Occupation", "Risk Class", "Coverage Table", "Sum Insured", "Base Premium", "VAT", "Total", "Period", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-xs font-semibold text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-xs font-semibold text-slate-500">
                    No PA proposals found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-xs text-slate-900">PA-{item.id}</div>
                    </td>

                    {/* Occupation */}
                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-slate-800">
                        {OCCUPATION_LABELS[item.risk_class] || item.risk_class || "-"}
                      </div>
                    </td>

                    {/* Risk Class badge */}
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          item.risk_class?.startsWith("class_3") ? "danger"
                          : item.risk_class?.startsWith("class_2") ? "warning"
                          : "success"
                        }
                      >
                        {CLASS_LABELS[item.risk_class] || item.risk_class || "-"}
                      </Badge>
                    </td>

                    {/* Coverage Table */}
                    <td className="px-5 py-4">
                      <div className="text-xs text-slate-600 font-medium max-w-[160px]">
                        {TABLE_TYPE_LABELS[item.table_type] || item.table_type || "-"}
                      </div>
                    </td>

                    {/* Sum Insured */}
                    <td className="px-5 py-4 font-mono">
                      <div className="text-xs font-bold text-slate-800">
                        BDT {(parseFloat(item.insamt) || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Base Premium */}
                    <td className="px-5 py-4 font-mono">
                      <div className="text-xs text-slate-600">
                        {(parseFloat(item.totprem) || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* VAT */}
                    <td className="px-5 py-4 font-mono">
                      <div className="text-xs text-slate-500">
                        {(parseFloat(item.vat) || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 font-mono">
                      <div className="text-xs font-bold text-emerald-700">
                        BDT {(parseFloat(item.total) || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Period */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.sdate || "-"}</span>
                        <span>→</span>
                        <span>{item.edate || "-"}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/underwriting/personal-accident/${item.id}`}>
                          <button
                            title="Edit proposal"
                            className="p-2 hover:bg-slate-100 text-slate-600 hover:text-emerald-600 rounded-lg transition-all cursor-pointer"
                          >
                            <Edit2 className="w-4.5 h-4.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete proposal"
                          className="p-2 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
