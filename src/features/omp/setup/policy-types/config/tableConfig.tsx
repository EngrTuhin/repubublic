import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";
import { TableConfig } from "@/global-config/types/tableConfig";

export const tableConfig: TableConfig = {
  title: "OMP Policy Types Setup",
  description: "Manage policy duration ranges, travel categories, and validation rules for Overseas Mediclaim Policies.",
  searchPlaceholder: "Search policy type by title, code, rules...",
  addButtonLabel: "Add Policy Type",
  addButtonVisibility: false,
  searchVisibility: true,
  emptyMessage: "No matching policy types found in database.",
  columns: [
    {
      key: "id",
      header: "ID",
      className: "font-mono font-black text-slate-900 text-[11px]",
    },
    {
      key: "label",
      header: "Policy Type Title",
      render: (row) => (
        <span className="font-extrabold text-slate-900 text-xs">
          {row.label || row.policy_type_title}
        </span>
      ),
    },
    {
      key: "value",
      header: "Type Code",
      render: (row) => (
        <span className="font-mono font-extrabold text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded text-[11px] border border-blue-300">
          {row.value || row.policy_type_code}
        </span>
      ),
    },
    {
      key: "min_days",
      header: "Min Days",
      render: (row) => (
        <span className="font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
          {row.min_days ?? row.minDays ?? 1} Days
        </span>
      ),
    },
    {
      key: "max_days",
      header: "Max Days",
      render: (row) => (
        <span className="font-mono font-extrabold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-200">
          {row.max_days ?? row.maxDays ?? 365} Days
        </span>
      ),
    },
    {
      key: "rule_info",
      header: "Rule Info",
      render: (row) => (
        <span className="font-medium text-xs text-slate-700">
          {row.rule_info || row.ruleInfo || "-"}
        </span>
      ),
    },
    {
      key: "sort_order",
      header: "Order",
      render: (row) => (
        <span className="font-mono font-bold text-slate-700 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          #{row.sort_order ?? 0}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row, helpers) => (
        <TableActions
          row={row}
          helpers={helpers}
          actions={[
            {
              key: "edit",
              icon: Edit2,
              onClick: (r, h) => h?.openEditModal && h.openEditModal(r),
            },
            {
              key: "delete",
              icon: Trash2,
              onClick: (r, h) => h?.handleDelete && h.handleDelete(r.id),
            },
          ]}
        />
      ),
    },
  ],
};
