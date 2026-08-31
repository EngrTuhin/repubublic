"use client";

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function ProposalStatusChart({ data }) {
  const [chartType, setChartType] = useState("pie");

  const proposalStatusData = [
    { name: "Submitted", count: data?.submitted ?? 0, color: "#2563EB" },
    { name: "Pending Underwriting", count: data?.pending_underwriting ?? 0, color: "#D97706" },
    { name: "Approved", count: data?.approved ?? 0, color: "#16A34A" },
    { name: "Rejected", count: data?.rejected ?? 0, color: "#DC2626" },
  ];

  const totalProposals = data?.total ?? proposalStatusData.reduce((sum, item) => sum + item.count, 0);

  const SimpleTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const itemData = payload[0].payload;
      const percentage = totalProposals > 0 ? ((itemData.count / totalProposals) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white border border-gray-200 p-2.5 rounded shadow-sm text-xs space-y-1">
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: itemData.color }} />
            {itemData.name}
          </div>
          <div className="text-gray-600 flex justify-between gap-4">
            <span>Count:</span>
            <span className="font-bold text-gray-900">{itemData.count}</span>
          </div>
          <div className="text-gray-500 flex justify-between gap-4">
            <span>Share:</span>
            <span className="font-medium text-gray-700">{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Proposal Status Chart
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Distribution of proposals by status (Total: {totalProposals})
          </p>
        </div>

        {/* View Switcher Button */}
        <div className="inline-flex rounded-md shadow-xs" role="group">
          <button
            type="button"
            onClick={() => setChartType("pie")}
            className={`px-3 py-1 text-xs font-medium border border-gray-300 rounded-l-md cursor-pointer ${
              chartType === "pie"
                ? "bg-gray-100 text-gray-900 font-bold"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pie
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 text-xs font-medium border-t border-b border-r border-gray-300 rounded-r-md cursor-pointer ${
              chartType === "bar"
                ? "bg-gray-100 text-gray-900 font-bold"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full my-4">
        {totalProposals > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Tooltip content={<SimpleTooltip />} />
                <Pie
                  data={proposalStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                >
                  {proposalStatusData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <BarChart data={proposalStatusData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4B5563" }} />
                <YAxis tick={{ fontSize: 11, fill: "#4B5563" }} />
                <Tooltip content={<SimpleTooltip />} />
                <Bar dataKey="count">
                  {proposalStatusData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-xs text-gray-400 font-medium border border-dashed border-gray-200 rounded-lg">
            No proposal records in database yet
          </div>
        )}
      </div>

      {/* Text Information Legend Grid */}
      {totalProposals > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100">
          {proposalStatusData.map((item, idx) => {
            const share = totalProposals > 0 ? ((item.count / totalProposals) * 100).toFixed(1) : "0.0";
            return (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-medium text-slate-700 truncate" title={item.name}>{item.name}</span>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-xs font-extrabold text-slate-900">{item.count}</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">{share}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
