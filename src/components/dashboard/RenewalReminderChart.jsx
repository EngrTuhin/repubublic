"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function RenewalReminderChart({ data }) {
  const renewalData = data || [];
  const totalRenewals = renewalData.reduce((sum, item) => sum + (item.count || 0), 0);

  const SimpleRenewalTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const itemData = payload[0].payload;
      const share = totalRenewals > 0 ? ((itemData.count / totalRenewals) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white border border-gray-200 p-2.5 rounded shadow-sm text-xs space-y-1">
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: itemData.color }} />
            {itemData.window}
          </div>
          <div className="text-gray-600 flex justify-between gap-4">
            <span>Policy Count:</span>
            <span className="font-bold text-gray-900">{itemData.count}</span>
          </div>
          <div className="text-gray-500 flex justify-between gap-4">
            <span>Share:</span>
            <span className="font-medium text-gray-700">{share}%</span>
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
            Renewal Reminder Chart
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Upcoming policy expirations (Total: {totalRenewals} policies)
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Renewal notices sent.")}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded shadow-xs cursor-pointer"
        >
          Send Reminders
        </button>
      </div>

      {/* Chart */}
      <div className="h-64 w-full my-4">
        {totalRenewals > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={renewalData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="window" tick={{ fontSize: 11, fill: "#4B5563" }} />
              <YAxis tick={{ fontSize: 11, fill: "#4B5563" }} />
              <Tooltip content={<SimpleRenewalTooltip />} />
              <Bar dataKey="count" barSize={45}>
                {renewalData.map((entry, index) => (
                  <Cell key={`bar-renew-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-xs text-gray-400 font-medium border border-dashed border-gray-200 rounded-lg">
            No policies expiring in the next 30 days
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border-t border-gray-200 pt-3">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-gray-500 font-semibold border-b border-gray-100">
              <th className="pb-2">Expiry Window</th>
              <th className="pb-2 text-center">Urgency</th>
              <th className="pb-2 text-right">Policy Count</th>
              <th className="pb-2 text-right">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {renewalData.map((item) => {
              const pct = totalRenewals > 0 ? ((item.count / totalRenewals) * 100).toFixed(1) : 0;
              return (
                <tr key={item.window}>
                  <td className="py-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.window}</span>
                  </td>
                  <td className="py-2 text-center">
                    <span className="px-2 py-0.5 text-2xs font-semibold rounded bg-gray-100 text-gray-700">
                      {item.urgency}
                    </span>
                  </td>
                  <td className="py-2 text-right font-bold text-gray-900">{item.count}</td>
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
