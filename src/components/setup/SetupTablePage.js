"use client";

import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Search,
  RotateCcw,
  Users,
  Building2,
  GitBranch,
  ShieldAlert,
  HelpCircle,
  FileText,
  UserCheck,
  Percent,
} from "lucide-react";

const tabConfig = {
  "uw-clients": {
    title: "Underwriting Clients",
    description: "Manage client registration records and customer accounts.",
    endpoint: "/v1/uw-clients",
    icon: Users,
    columns: [
      { key: "idno", label: "Client ID", className: "font-mono font-bold text-slate-800 text-xs" },
      { key: "clname", label: "Full Name", className: "font-bold text-slate-900 text-xs" },
      { key: "phone", label: "Phone Number", className: "text-xs font-semibold text-slate-600" },
      { key: "present_add", label: "Address", className: "text-xs text-slate-500 max-w-xs truncate" },
      { key: "client_status", label: "Status", type: "status" },
    ],
  },
  "uw-bank-infos": {
    title: "Bank Information",
    description: "Manage bank details used for policy premium calculations and transactions.",
    endpoint: "/v1/uw-bank-infos",
    icon: Building2,
    columns: [
      { key: "id", label: "ID", className: "font-mono font-bold text-slate-800 text-xs" },
      { key: "bankname", label: "Bank Name", className: "font-bold text-slate-900 text-xs" },
      { key: "bankcode", label: "Bank Code", className: "text-xs font-semibold text-slate-600" },
      { key: "status", label: "Status", type: "status" },
    ],
  },
  "uw-bank-branches": {
    title: "Bank Branches",
    description: "Manage specific bank branch offices and contact information.",
    endpoint: "/v1/uw-bank-branches",
    icon: GitBranch,
    columns: [
      { key: "id", label: "ID", className: "font-mono font-bold text-slate-800 text-xs" },
      { key: "bankname", label: "Bank Name", className: "text-xs text-slate-600 font-semibold" },
      { key: "bankbranch", label: "Branch Name", className: "font-bold text-slate-900 text-xs" },
      { key: "bank_br_code", label: "Branch Code", className: "font-mono text-xs text-slate-600" },
      { key: "status", label: "Status", type: "status" },
    ],
  },
  "uw-tarrifs": {
    title: "Insurance Tariffs",
    description: "Manage base rates, premium calculation rules, and tariff parameters.",
    endpoint: "/v1/uw-tarrifs",
    icon: Percent,
    columns: [
      { key: "id", label: "ID", className: "font-mono font-bold text-slate-800 text-xs" },
      { key: "tmtype", label: "Tariff Type", className: "font-bold text-slate-900 text-xs" },
      { key: "fname", label: "Vehicle Group", className: "text-xs text-slate-600 font-semibold" },
      { key: "catagoary", label: "Capacity Category", className: "text-xs text-slate-500" },
      { key: "basicpremium", label: "Basic Premium", type: "currency", className: "font-mono text-xs text-slate-800" },
      { key: "basicrate", label: "Basic Rate (%)", className: "text-xs text-slate-600" },
      { key: "liability", label: "Liability Premium", type: "currency", className: "font-mono text-xs text-slate-800" },
    ],
  },
  "uw-drivers": {
    title: "Underwriting Drivers",
    description: "Manage registered drivers, licensing details, and safety parameters.",
    endpoint: "/v1/uw-drivers",
    icon: UserCheck,
    columns: [
      { key: "id", label: "ID", className: "font-mono font-bold text-slate-800 text-xs" },
      { key: "name", label: "Driver Name", className: "font-bold text-slate-900 text-xs" },
      { key: "license", label: "License Number", className: "text-xs font-semibold text-slate-600" },
      { key: "phone", label: "Phone", className: "text-xs text-slate-500" },
      { key: "status", label: "Status", type: "status" },
    ],
  },
  "motor-certificate-types": {
    title: "Motor Certificate Types",
    description: "Manage classification profiles for vehicle certificates.",
    endpoint: "/v1/motor-certificate-types",
    icon: FileText,
    columns: [
      { key: "id", label: "ID", className: "font-mono font-bold text-slate-800 text-xs" },
      { key: "name", label: "Certificate Name", className: "font-bold text-slate-900 text-xs" },
      { key: "description", label: "Description", className: "text-xs text-slate-500 max-w-sm truncate" },
      { key: "created_at", label: "Created At", type: "date", className: "text-xs text-slate-400 font-semibold" },
    ],
  },
  "uw-limitation-uses": {
    title: "Limitations of Use",
    description: "Manage limitation classifications and policy scope limits.",
    endpoint: "/v1/uw-limitation-uses",
    icon: ShieldAlert,
    columns: [
      { key: "id", label: "ID", className: "font-mono font-bold text-slate-800 text-xs" },
      { key: "name", label: "Limitation Rule", className: "font-bold text-slate-900 text-xs" },
      { key: "description", label: "Description", className: "text-xs text-slate-500 max-w-sm truncate" },
      { key: "created_at", label: "Created At", type: "date", className: "text-xs text-slate-400 font-semibold" },
    ],
  },
};

export default function SetupTablePage({ tab }) {
  const currentTab = tab || "uw-clients";
  const config = tabConfig[currentTab] || tabConfig["uw-clients"];
  const TabIcon = config.icon || HelpCircle;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch page data on change
  useEffect(() => {
    let active = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const session = await getSession();
        const headers = {
          Accept: "application/json",
        };
        if (session?.accessToken) {
          headers["Authorization"] = `Bearer ${session.accessToken}`;
        }

        const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://192.168.0.113:8001/api";
        const queryParams = new URLSearchParams({
          page: String(page),
        });
        if (debouncedSearch) {
          queryParams.append("search", debouncedSearch);
        }

        const url = `${baseUrl}${config.endpoint}?${queryParams.toString()}`;
        const res = await fetch(url, { headers });

        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const json = await res.json();
        if (active) {
          if (json.success) {
            setData(json.data || []);
            setMeta(json.meta || null);
          } else {
            throw new Error(json.message || "Failed to load data");
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Something went wrong while fetching setup records.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [currentTab, page, debouncedSearch, config.endpoint]);

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-350">
      {/* Header section with Icon */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5 bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <TabIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{config.title}</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1 max-w-xl">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold shadow-sm flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          {error}
        </div>
      )}

      {/* Control bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search records by name, code or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold placeholder-slate-400 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {(searchTerm || page > 1) && (
          <Button
            onClick={handleReset}
            variant="secondary"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer w-full md:w-auto justify-center"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filter
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {config.columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={config.columns.length}
                    className="px-6 py-16 text-center text-xs font-semibold text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading setup records...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.columns.length}
                    className="px-6 py-12 text-center text-xs font-semibold text-slate-500"
                  >
                    No records found matching current query.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={item.id || item.idno || idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {config.columns.map((col) => {
                      const val = item[col.key];

                      if (col.type === "status") {
                        const isActive = String(val).toLowerCase() === "active" || String(val).toLowerCase() === "a";
                        return (
                          <td key={col.key} className="px-6 py-4">
                            <Badge variant={isActive ? "success" : "warning"}>
                              {isActive ? "ACTIVE" : String(val || "INACTIVE").toUpperCase()}
                            </Badge>
                          </td>
                        );
                      }

                      if (col.type === "currency") {
                        return (
                          <td key={col.key} className="px-6 py-4 font-mono text-xs text-slate-700">
                            BDT {(parseFloat(val) || 0).toLocaleString()}
                          </td>
                        );
                      }

                      if (col.type === "date") {
                        return (
                          <td key={col.key} className="px-6 py-4 text-xs text-slate-400 font-semibold">
                            {val ? new Date(val).toLocaleDateString() : "-"}
                          </td>
                        );
                      }

                      return (
                        <td key={col.key} className="px-6 py-4">
                          <div className={col.className || "text-xs font-medium text-slate-700"}>
                            {val !== null && val !== undefined ? String(val) : "-"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {meta && meta.last_page > 1 && (
          <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Showing page {meta.current_page} of {meta.last_page} ({meta.total} total records)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={page >= meta.last_page || loading}
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
