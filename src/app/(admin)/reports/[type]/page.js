"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetReportDataQuery } from "@/features/api/reportsApi";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import {
  Download,
  Printer,
  Search,
  RotateCcw,
  RefreshCw,
} from "lucide-react";

const reportTitles = {
  proposal: { title: "Proposal Report", description: "Proposal count and status distribution analytics." },
  collection: { title: "Premium Collection Report", description: "Collection summary across all insurance policy lines." },
  product: { title: "Product-Wise Business Report", description: "Motor, OMP, and PA business performance comparison." },
  officer: { title: "Officer-Wise Performance Report", description: "Staff and underwriter performance logs." },
  payment: { title: "Payment Tracking Report", description: "SSLCommerz payment gateway vs manual MR collection tracking." },
  certificate: { title: "Certificate Status Report", description: "Issued and pending insurance certificates feed." },
  renewal: { title: "Policy Renewal Report", description: "Upcoming policy renewals load in 7, 15, and 30-day windows." },
  claim: { title: "Claim Settlement Report", description: "Claim status, settlement totals, and processing logs." },
  customer: { title: "Customer Database Report", description: "Policyholder directory and client statistics." },
  tariff: { title: "Tariff Audit Trail Report", description: "Audit trail of tariff updates and rate modifications." },
};

export default function SingleReportPage() {
  const params = useParams();
  const reportType = (params?.type || "proposal").toLowerCase();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const queryParams = useMemo(() => {
    const p = { type: reportType };
    if (startDate && endDate) {
      p.start_date = startDate;
      p.end_date = endDate;
    }
    return p;
  }, [reportType, startDate, endDate]);

  const { data: apiResponse, isLoading, isFetching } = useGetReportDataQuery(queryParams);

  const meta = reportTitles[reportType] || {
    title: `${reportType.toUpperCase()} Report`,
    description: "Official executive management report dataset.",
  };

  const reportData = apiResponse?.data || { columns: [], rows: [], summary: {} };
  const rawRows = reportData.rows || [];
  const columns = reportData.columns || [];
  const summary = reportData.summary || {};

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rawRows;
    const term = searchTerm.toLowerCase();
    return rawRows.filter((row) => {
      const values = Array.isArray(row) ? row : Object.values(row);
      return values.some((val) => String(val ?? "").toLowerCase().includes(term));
    });
  }, [rawRows, searchTerm]);

  const handleExportPDF = () => {
    exportToPDF(
      meta.title,
      columns,
      filteredRows,
      summary
    );
  };

  const handleExportExcel = () => {
    exportToExcel(
      columns,
      filteredRows,
      `republic_${reportType}_report`
    );
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Main Report View Panel */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        {/* Header & Export Actions */}
        <div className="p-5 border-b border-gray-200 bg-gray-50 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  {meta.title} Data Stream
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-200 text-gray-800">
                  {filteredRows.length} Records
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Live database records filtered by selection
              </p>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                disabled={!filteredRows.length}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Export as Printable PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={handleExportExcel}
                disabled={!filteredRows.length}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Download Excel / CSV Spreadsheet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 rounded px-2.5 py-1">
                <span className="text-gray-500 font-semibold">Start:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 rounded px-2.5 py-1">
                <span className="text-gray-500 font-semibold">End:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer"
                />
              </div>

              {(startDate || endDate || searchTerm) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-2 py-1 bg-white hover:bg-gray-100 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search report data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Summary Metric Boxes */}
        {Object.keys(summary).length > 0 && (
          <div className="bg-blue-50/50 p-4 border-b border-gray-200 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-800">
            {Object.entries(summary).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-gray-200">
                <span className="text-gray-500">{key}:</span>
                <span className="font-bold text-blue-700">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          {isLoading || isFetching ? (
            <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Fetching report data from backend...</span>
            </div>
          ) : filteredRows.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider">
                  {columns.map((col, idx) => (
                    <th key={idx} className="py-3 px-4">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800 font-medium">
                {filteredRows.map((row, rowIdx) => {
                  const cells = Array.isArray(row) ? row : Object.values(row);
                  return (
                    <tr key={rowIdx} className="hover:bg-gray-50">
                      {cells.map((cellVal, cellIdx) => (
                        <td key={cellIdx} className="py-3 px-4">
                          {cellVal}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-gray-400">
              No report records found matching filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
