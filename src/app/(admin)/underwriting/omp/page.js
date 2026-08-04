"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import {
  useGetOmpInsurancesQuery,
  useDeleteOmpInsuranceMutation,
} from "@/features/omp/ompApi";
import {
  Search,
  Shield,
  DollarSign,
  Globe,
  Trash2,
  Edit2,
  Calendar,
} from "lucide-react";

export default function OmpListPage() {
  const { data: apiResponse, isLoading, error } = useGetOmpInsurancesQuery();
  const [deleteOmpInsurance] = useDeleteOmpInsuranceMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const raw = apiResponse?.data?.data ?? apiResponse?.data ?? [];
  const policies = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this OMP proposal?")) {
      try {
        await deleteOmpInsurance(id).unwrap();
      } catch (err) {
        alert("Failed to delete: " + (err?.data?.message || err?.message || "Server error"));
      }
    }
  };

  const filtered = policies.filter((item) => {
    const name = (item.insured_name || "").toLowerCase();
    const passport = (item.passport_no || "").toLowerCase();
    const country = (item.country_of_visit || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    return (
      name.includes(q) ||
      passport.includes(q) ||
      country.includes(q) ||
      String(item.id).includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-350">
      <PageHeader
        title="Overseas Mediclaim Proposals"
        description="Manage all OMP underwriting proposals — edit and delete."
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold">
          Failed to load data: {error?.message || JSON.stringify(error)}
        </div>
      )}

      {/* Summary widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Proposals</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">{policies.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
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
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Countries Covered</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              {new Set(policies.map((p) => p.country_of_visit).filter(Boolean)).size}
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
            placeholder="Search by name, passport, country or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold placeholder-slate-400 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "Insured Name", "Passport", "Country", "Plan", "Days", "Sum Insured", "Total Premium", "Dental", "Period", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-xs font-semibold text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-xs font-semibold text-slate-500">
                    No OMP proposals found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-xs text-slate-900">OMP-{item.id}</div>
                    </td>

                    {/* Insured Name */}
                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-slate-800">{item.insured_name || "-"}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Age: {item.age || "-"}</div>
                    </td>

                    {/* Passport */}
                    <td className="px-5 py-4">
                      <div className="text-xs font-mono text-slate-700">{item.passport_no || "-"}</div>
                    </td>

                    {/* Country */}
                    <td className="px-5 py-4">
                      <Badge variant="primary">{item.country_of_visit || "-"}</Badge>
                    </td>

                    {/* Plan */}
                    <td className="px-5 py-4">
                      <div className="text-xs text-slate-600 font-medium">{item.plan_type || "-"}</div>
                      <div className="text-[10px] text-slate-400">{item.policy_type || ""}</div>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4">
                      <div className="text-xs font-bold text-slate-800">{item.duration_days || "-"} days</div>
                    </td>

                    {/* Sum Insured */}
                    <td className="px-5 py-4 font-mono">
                      <div className="text-xs font-bold text-slate-800">
                        BDT {(parseFloat(item.insamt) || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Total Premium */}
                    <td className="px-5 py-4 font-mono">
                      <div className="text-xs font-bold text-emerald-700">
                        BDT {(parseFloat(item.total) || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Dental */}
                    <td className="px-5 py-4">
                      <Badge variant={item.include_dental ? "success" : "secondary"}>
                        {item.include_dental ? "Yes" : "No"}
                      </Badge>
                    </td>

                    {/* Period */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.sdate || "-"}</span>
                        <span>→</span>
                        <span>{item.edate || "-"}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/underwriting/omp/${item.id}`}>
                          <button
                            title="Edit proposal"
                            className="p-2 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all cursor-pointer"
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
