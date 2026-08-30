import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";

const formatTwoDigits = (val: any) => {
  if (val === null || val === undefined || val === "") return "—";
  const num = Number(val);
  return isNaN(num) ? String(val) : num.toFixed(2);
};

export const tableConfig = {
  title: "Motor Tariffs Setup",
  description: "Configure Motor Insurance premiums, rates, act liabilities, and personnel coverages.",
  searchPlaceholder: "Search tariffs by name, group, type...",
  addButtonLabel: "Add Tariff",
  addButtonVisibility: false,
  searchVisibility: true,

  emptyMessage: "No matching Motor Tariffs found in database.",
  columns: [
    {
      key: "id",
      header: "ID",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-slate-500">
          #{row.id}
        </span>
      ),
    },
    {
      key: "tariff_type",
      header: "Type",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2  rounded border border-amber-200">
          {row.tariff_type?.name || row.tmtype || "—"}
        </span>
      ),
    },

    {
      key: "class_sub_type",
      header: "Sub Type",
      render: (row: any) => (
        <span className="font-mono text-xs font-medium text-indigo-700 bg-indigo-50 rounded border border-indigo-200">
          {row.class_sub_type_obj?.name || row.class_sub_type || "—"}
        </span>
      ),
    },
    {
      key: "tname",
      header: "Name",
      render: (row: any) => (
        <div className="font-bold text-xs text-slate-900">
          {row.tname || row.name || "—"}
        </div>
      ),
    },
    {
      key: "capacity_from",
      header: "Cap From",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-slate-700">
          {formatTwoDigits(row.capacity_from)}
        </span>
      ),
    },
    {
      key: "capacity_to",
      header: "Cap To",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-slate-700">
          {formatTwoDigits(row.capacity_to)}
        </span>
      ),
    },
    {
      key: "capacity_type",
      header: "Cap Type",
      render: (row: any) => (
        <span className="font-mono text-[11px] font-bold text-slate-600 uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          {row.capacity_type || "—"}
        </span>
      ),
    },
    {
      key: "own_dp_basic",
      header: "OD Basic",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-emerald-700">
          {row.own_dp_basic != null ? `৳${Number(row.own_dp_basic).toLocaleString()}` : "—"}
        </span>
      ),
    },
    {
      key: "full_ins_value",
      header: "OD Rate",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-blue-700">
          {row.full_ins_value != null ? `${row.full_ins_value}%` : "—"}
        </span>
      ),
    },
    {
      key: "act_liability",
      header: "Act Liab",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-purple-700">
          {row.act_liability != null ? `৳${Number(row.act_liability).toLocaleString()}` : "—"}
        </span>
      ),
    },
    {
      key: "driver_rate",
      header: "Driver",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.driver_rate != null ? `৳${row.driver_rate}` : "—"}
        </span>
      ),
    },
    {
      key: "passenger_rate",
      header: "Pass",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.passenger_rate != null ? `৳${row.passenger_rate}` : "—"}
        </span>
      ),
    },
    {
      key: "helper_rate",
      header: "Helper",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.helper_rate != null ? `৳${row.helper_rate}` : "—"}
        </span>
      ),
    },
    {
      key: "fire_theft_rate",
      header: "Fire / Theft",
      render: (row: any) => {
        const fire = row.fire_rate != null ? `${row.fire_rate}%` : "—";
        const theft = row.theft_rate != null ? `${row.theft_rate}%` : "—";
        return (
          <span className="font-mono text-xs font-semibold text-rose-700">
            {fire} / {theft}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: any, helpers: any) => (
        <TableActions
          row={row}
          helpers={helpers}
          actions={[
            {
              key: "edit",
              icon: Edit2,
              onClick: (r: any, h: any) => h?.openEditModal && h.openEditModal(r),
            },
            {
              key: "delete",
              icon: Trash2,
              onClick: (r: any, h: any) => h?.handleDelete && h.handleDelete(r.id),
            },
          ]}
        />
      ),
    },
  ],
};
