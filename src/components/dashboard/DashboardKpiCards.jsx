"use client";

import React from "react";
import { FileText, Clock, CheckCircle, DollarSign } from "lucide-react";

export default function DashboardKpiCards({ data }) {
  const totalProposals = data?.total_proposals ?? 0;
  const pendingCount = data?.pending_underwriting ?? 0;
  const approvedCount = data?.approved_proposals ?? 0;
  const totalPremium = data?.total_premium ?? "Tk. 0";

  const stats = [
    {
      id: "total_premium",
      title: "Total Premium",
      value: totalPremium,
      icon: DollarSign,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      id: "total_proposals",
      title: "Total Proposals",
      value: totalProposals,
      icon: FileText,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      id: "pending_uw",
      title: "Pending Underwriting",
      value: pendingCount,
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      id: "approved",
      title: "Approved Proposals",
      value: approvedCount,
      icon: CheckCircle,
      iconBg: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
