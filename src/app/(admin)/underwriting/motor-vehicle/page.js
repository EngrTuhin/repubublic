"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motorUnderwritingTableConfig } from "@/features/motor-vehicle/config/fields";
import {
  useGetMotorUnderwritingsQuery,
  useDeleteMotorUnderwritingMutation,
} from "@/features/motor-vehicle/motorVehicleApi";
import {
  Search,
  Plus,
  Edit2,
  Eye,
  Shield,
  Calendar,
  DollarSign,
  Filter,
  Trash2,
} from "lucide-react";

export default function MotorUnderwritingListPage() {
  const { data: apiResponse, isLoading, error } = useGetMotorUnderwritingsQuery();
  const [deleteMotorUnderwriting] = useDeleteMotorUnderwritingMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCertType, setFilterCertType] = useState("ALL");

  console.log("MotorUnderwritingListPage Render:", { apiResponse, isLoading, error });

  const serverData = apiResponse?.data || apiResponse;
  const underwritings = Array.isArray(serverData) ? serverData : [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await deleteMotorUnderwriting(id).unwrap();
      } catch (err) {
        console.error("Failed to delete underwriting policy:", err);
        alert("Failed to delete policy: " + (err?.data?.message || err?.message || "Server error"));
      }
    }
  };

  const filteredUnderwritings = underwritings.filter((item) => {
    const matchesSearch =
      (item.cl_name || item.titlename || item.insuredName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.bill_no || "").includes(searchTerm) ||
      (item.reg_mark || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterCertType === "ALL" ||
      (item[motorUnderwritingTableConfig.filterKey] || item.typeOfCertificate) ===
        filterCertType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-350">
      <PageHeader
        title={motorUnderwritingTableConfig.title}
        description={motorUnderwritingTableConfig.description}
        actions={
          <Link href="/underwriting/motor-vehicle/new">
            <Button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 cursor-pointer">
              <Plus className="w-4.5 h-4.5" />
              New Underwriting
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold">
          Failed to load data from server: {error?.message || JSON.stringify(error)}
        </div>
      )}

      {/* Analytics Summary Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Policies
            </p>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              {underwritings.length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Gross Premium
            </p>
            <h3 className="text-xl font-black text-slate-800 mt-1 font-mono">
              BDT{" "}
              {underwritings
                .reduce((sum, item) => sum + (parseFloat(item.total || item.grossPremium) || 0), 0)
                .toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Recent Activity
            </p>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              Active Desk
            </h3>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder={motorUnderwritingTableConfig.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold placeholder-slate-400 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4.5 h-4.5 text-slate-500" />
          <select
            value={filterCertType}
            onChange={(e) => setFilterCertType(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            {motorUnderwritingTableConfig.filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {motorUnderwritingTableConfig.columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={motorUnderwritingTableConfig.columns.length + 1}
                    className="px-6 py-12 text-center text-xs font-semibold text-slate-500"
                  >
                    Loading records from server...
                  </td>
                </tr>
              ) : filteredUnderwritings.length === 0 ? (
                <tr>
                  <td
                    colSpan={motorUnderwritingTableConfig.columns.length + 1}
                    className="px-6 py-12 text-center text-xs font-semibold text-slate-500"
                  >
                    No underwriting records found.
                  </td>
                </tr>
              ) : (
                filteredUnderwritings.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {motorUnderwritingTableConfig.columns.map((col) => {
                      if (col.type === "bill-details") {
                        return (
                          <td key={col.key} className="px-6 py-4">
                            <div className="font-bold text-xs text-slate-900">
                              #{item.bill_no || item.billNo}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {item.bill_date || item.billDate}
                            </div>
                          </td>
                        );
                      }
                      if (col.key === "clientcode") {
                        return (
                          <td key={col.key} className="px-6 py-4">
                            <div className={col.className}>
                              {item.cl_name || item.titlename || item.insuredName || item.clientcode || ""}
                            </div>
                          </td>
                        );
                      }
                      if (col.type === "certificate-badge") {
                        return (
                          <td key={col.key} className="px-6 py-4">
                            <Badge
                              variant={
                                (item.cert_type || item.typeOfCertificate) === "Comprehensive"
                                  ? "primary"
                                  : "secondary"
                              }
                            >
                              {item.cert_type || item.typeOfCertificate}
                            </Badge>
                          </td>
                        );
                      }
                      if (col.type === "amount") {
                        return (
                          <td key={col.key} className="px-6 py-4 font-mono">
                            <div className={col.className}>
                              BDT {(parseFloat(item[col.key]) || 0).toLocaleString()}
                            </div>
                          </td>
                        );
                      }
                      if (col.type === "status-badge") {
                        return (
                          <td key={col.key} className="px-6 py-4">
                            <Badge
                              variant={
                                item.status === "active" ? "success" : "warning"
                              }
                            >
                              {item.status || "active"}
                            </Badge>
                          </td>
                        );
                      }
                      return (
                        <td key={col.key} className="px-6 py-4">
                          <div className={col.className}>
                            {item[col.key] || col.defaultValue || ""}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/underwriting/motor-vehicle/${item.id}`}>
                          <button
                            title="Edit policy"
                            className="p-2 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all cursor-pointer"
                          >
                            <Edit2 className="w-4.5 h-4.5" />
                          </button>
                        </Link>
                        <button
                          title="View details"
                          className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-all cursor-pointer"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete policy"
                          className="p-2 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
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
