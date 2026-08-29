"use client";

import React, { useState, useMemo } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DashboardKpiCards from "@/components/dashboard/DashboardKpiCards";
import ProposalStatusChart from "@/components/dashboard/ProposalStatusChart";
import ProductPremiumChart from "@/components/dashboard/ProductPremiumChart";
import PaymentCollectionChart from "@/components/dashboard/PaymentCollectionChart";
import RenewalReminderChart from "@/components/dashboard/RenewalReminderChart";
import DashboardBreakdownTable from "@/components/dashboard/DashboardBreakdownTable";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { RefreshCw, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  const [period, setPeriod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Prepare RTK Query query parameters dynamically
  const queryParams = useMemo(() => {
    const params = {};
    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    } else if (period && period !== "all") {
      params.period = period;
    }
    return params;
  }, [period, startDate, endDate]);

  const { stats, loading, refetch } = useDashboardStats(queryParams);

  const handleReset = () => {
    setPeriod("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6">
      {/* Standard Corporate Page Header with Date Filter & Refresh Actions */}
      <PageHeader
        title="Dashboard"
        description="Welcome to Republic Insurance management and underwriting overview panel."
        actions={
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Quick Period Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded px-2 py-1">
              <span className="text-gray-500 font-semibold">Period:</span>
              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  if (e.target.value !== "custom") {
                    setStartDate("");
                    setEndDate("");
                  }
                }}
                className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year (2026)</option>
              </select>
            </div>

            {/* Start Date Input */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded px-2 py-1">
              <span className="text-gray-500 font-semibold">Start:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPeriod("custom");
                }}
                className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer"
              />
            </div>

            {/* End Date Input */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded px-2 py-1">
              <span className="text-gray-500 font-semibold">End:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPeriod("custom");
                }}
                className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer"
              />
            </div>

            {/* Reset Button (If filters active) */}
            {(startDate || endDate || period !== "all") && (
              <button
                onClick={handleReset}
                className="p-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                title="Reset Date Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-white" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh Stats"}</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <DashboardKpiCards data={stats?.kpis} />

      {/* Charts Grid Row 1: Proposal Status & Product Premiums */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProposalStatusChart data={stats?.proposal_status} />
        <ProductPremiumChart data={stats?.product_premiums} />
      </div>

      {/* Charts Grid Row 2: Payment Collections & Renewal Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentCollectionChart data={stats?.payment_collections} />
        <RenewalReminderChart data={stats?.renewal_reminders} />
      </div>

      {/* Recent Proposals Table */}
      <DashboardBreakdownTable proposals={stats?.recent_proposals} />
    </div>
  );
}
