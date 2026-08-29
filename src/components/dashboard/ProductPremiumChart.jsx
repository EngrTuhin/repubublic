"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const formatBDT = (value) => {
  return "Tk. " + (value || 0).toLocaleString("en-IN");
};

export default function ProductPremiumChart({ data }) {
  const [viewType, setViewType] = useState("bar");

  const productData = data || [];
  const totalPremium = productData.reduce((sum, item) => sum + (item.premium || 0), 0);

  const SimplePremiumTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const itemData = payload[0].payload;
      const percentage = totalPremium > 0 ? ((itemData.premium / totalPremium) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white border border-gray-200 p-2.5 rounded shadow-sm text-xs space-y-1">
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: itemData.color }} />
            {itemData.product}
          </div>
          <div className="text-gray-600 flex justify-between gap-4">
            <span>Premium:</span>
            <span className="font-bold text-gray-900">{formatBDT(itemData.premium)}</span>
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
            Product-Wise Premium Chart
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Business performance by insurance product (Total: {formatBDT(totalPremium)})
          </p>
        </div>

        {/* View Switcher Button */}
        <div className="inline-flex rounded-md shadow-xs" role="group">
          <button
            type="button"
            onClick={() => setViewType("bar")}
            className={`px-3 py-1 text-xs font-medium border border-gray-300 rounded-l-md ${
              viewType === "bar"
                ? "bg-gray-100 text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Bar
          </button>
          <button
            type="button"
            onClick={() => setViewType("pie")}
            className={`px-3 py-1 text-xs font-medium border-t border-b border-r border-gray-300 rounded-r-md ${
              viewType === "pie"
                ? "bg-gray-100 text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full my-4">
        {totalPremium > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {viewType === "bar" ? (
              <BarChart data={productData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: "#4B5563" }} />
                <YAxis
                  tickFormatter={(val) => `Tk. ${(val / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: "#4B5563" }}
                />
                <Tooltip content={<SimplePremiumTooltip />} />
                <Bar dataKey="premium" barSize={40}>
                  {productData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Tooltip content={<SimplePremiumTooltip />} />
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="premium"
                  nameKey="product"
                  label={({ product, formatted }) => `${product}: ${formatted}`}
                >
                  {productData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-xs text-gray-400 font-medium border border-dashed border-gray-200 rounded-lg">
            No premium collection records in database yet
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border-t border-gray-200 pt-3">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-gray-500 font-semibold border-b border-gray-100">
              <th className="pb-2">Product</th>
              <th className="pb-2 text-right">Premium</th>
              <th className="pb-2 text-right">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {productData.map((item) => {
              const pct = totalPremium > 0 ? ((item.premium / totalPremium) * 100).toFixed(1) : 0;
              return (
                <tr key={item.product}>
                  <td className="py-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.product}</span>
                  </td>
                  <td className="py-2 text-right font-bold text-gray-900">{item.formatted || formatBDT(item.premium)}</td>
                  <td className="py-2 text-right text-gray-500">{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
