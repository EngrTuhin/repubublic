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
            className={`px-3 py-1 text-xs font-medium border border-gray-300 rounded-l-md ${
              chartType === "pie"
                ? "bg-gray-100 text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pie
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 text-xs font-medium border-t border-b border-r border-gray-300 rounded-r-md ${
              chartType === "bar"
                ? "bg-gray-100 text-gray-900"
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
                  label={({ type, formatted }) => `${type}: ${formatted}`}
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

      {/* Data Table */}
      <div className="overflow-x-auto border-t border-gray-200 pt-3">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-gray-500 font-semibold border-b border-gray-100">
              <th className="pb-2">Payment Type</th>
              <th className="pb-2 text-right">Amount</th>
              <th className="pb-2 text-right">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {paymentData.map((item) => {
              const pct = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;
              return (
                <tr key={item.type}>
                  <td className="py-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.type}</span>
                  </td>
                  <td className="py-2 text-right font-bold text-gray-900">{item.formatted || formatBDT(item.amount)}</td>
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
