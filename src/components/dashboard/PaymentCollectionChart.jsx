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

const formatBDT = (value) => {
  return "Tk. " + (value || 0).toLocaleString("en-IN");
};

export default function PaymentCollectionChart({ data }) {
  const [chartType, setChartType] = useState("pie");

  const paymentData = data || [];
  const totalAmount = paymentData.reduce((sum, item) => sum + (item.amount || 0), 0);

  const SimplePaymentTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const itemData = payload[0].payload;
      const percentage = totalAmount > 0 ? ((itemData.amount / totalAmount) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white border border-gray-200 p-2.5 rounded shadow-sm text-xs space-y-1">
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: itemData.color }} />
            {itemData.type}
          </div>
          <div className="text-gray-600 flex justify-between gap-4">
            <span>Amount:</span>
            <span className="font-bold text-gray-900">{formatBDT(itemData.amount)}</span>
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
            Payment Collection Chart
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Collection breakdown by payment method (Total: {formatBDT(totalAmount)})
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
        {totalAmount > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Tooltip content={<SimplePaymentTooltip />} />
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="amount"
                  nameKey="type"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`pie-pay-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <BarChart data={paymentData} margin={{ top: 20, right: 15, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: "#4B5563" }} />
                <YAxis
                  tickFormatter={(val) => `Tk. ${(val / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: "#4B5563" }}
                />
                <Tooltip content={<SimplePaymentTooltip />} />
                <Bar dataKey="amount" barSize={40}>
                  {paymentData.map((entry, index) => (
                    <Cell key={`bar-pay-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-xs text-gray-400 font-medium border border-dashed border-gray-200 rounded-lg">
            No collection records in database yet
          </div>
        )}
      </div>

      {/* Text Information Legend Grid */}
      {totalAmount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100">
          {paymentData.map((item, idx) => {
            const share = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : "0.0";
            return (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-medium text-slate-700 truncate" title={item.type}>{item.type}</span>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-xs font-extrabold text-slate-900">{formatBDT(item.amount)}</span>
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
