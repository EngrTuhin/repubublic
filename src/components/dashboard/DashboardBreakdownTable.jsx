"use client";

import React, { useState } from "react";

const getStatusBadgeClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("approved") || s.includes("paid")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s.includes("pending")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (s.includes("rejected")) return "bg-red-50 text-red-700 border-red-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

export default function DashboardBreakdownTable({ proposals }) {
  const [activeTab, setActiveTab] = useState("all");

  const proposalRows = proposals || [];

  const filteredRows =
    activeTab === "all"
      ? proposalRows
      : proposalRows.filter((r) => (r.productCategory || r.product || "").toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
      {/* Header with filter tabs */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Recent Proposal Activity Feed
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Live proposal logs and underwriting feed from database
          </p>
        </div>

        {/* Filters */}
        <div className="inline-flex rounded-md shadow-xs" role="group">
          {[
            { id: "all", label: "All Products" },
            { id: "motor", label: "Motor" },
            { id: "omp", label: "OMP" },
            { id: "pa", label: "PA" },
          ].map((tab, idx, arr) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-medium border-y border-r border-gray-300 ${
                idx === 0 ? "border-l rounded-l-md" : ""
              } ${idx === arr.length - 1 ? "rounded-r-md" : ""} ${
                activeTab === tab.id
                  ? "bg-gray-200 text-gray-900 font-bold"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Standard Table */}
      <div className="overflow-x-auto">
        {filteredRows.length > 0 ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Proposal ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Product Line</th>
                <th className="py-3 px-4">Sum Insured</th>
                <th className="py-3 px-4">Premium</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800 font-medium">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                    {row.id}
                  </td>
                  <td className="py-3 px-4 text-gray-900">{row.client}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-2xs font-semibold">
                      {row.product}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{row.sumInsured}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {row.premium}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-2xs font-bold border ${getStatusBadgeClass(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-xs text-gray-400 font-medium">
            No proposal activity found for selected product filter.
          </div>
        )}
      </div>
    </div>
  );
}
