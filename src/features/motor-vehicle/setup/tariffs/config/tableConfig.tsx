import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";

export const tableConfig = {
  title: "Motor Tariffs Setup",
  description: "Configure Motor Insurance premiums, rates, act liabilities, and personnel coverages.",
  searchPlaceholder: "Search tariffs by name, group, type...",
  addButtonLabel: "Add Tariff",
  addButtonVisibility: true,
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
      header: "Tariff Type",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {row.tariff_type?.name || row.tmtype || "—"}
        </span>
      ),
    },
    {
      key: "tariff_group",
      header: "Tariff Group",
      render: (row: any) => (
        <div className="font-semibold text-xs text-slate-700">
          {row.tariff_group?.name || row.fname || "—"}
        </div>
      ),
    },
    {
      key: "class_sub_type",
      header: "Sub Type",
      render: (row: any) => (
        <span className="font-mono text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
          {row.class_sub_type_obj?.name || row.class_sub_type || "—"}
        </span>
      ),
    },
    {
      key: "tname",
      header: "Tariff Name / Description",
      render: (row: any) => (
        <div className="font-bold text-xs text-slate-900">
          {row.tname || row.name || "—"}
        </div>
      ),
    },
    {
      key: "own_dp_basic",
      header: "OD Basic (Tk)",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-emerald-700">
          {row.own_dp_basic != null ? `৳${row.own_dp_basic}` : "—"}
        </span>
      ),
    },
    {
      key: "full_ins_value",
      header: "OD Rate (%)",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-blue-700">
          {row.full_ins_value != null ? `${row.full_ins_value}%` : "—"}
        </span>
      ),
    },
    {
      key: "act_liability",
      header: "Act Liability (Tk)",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-purple-700">
          {row.act_liability != null ? `৳${row.act_liability}` : "—"}
        </span>
      ),
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
