import React from "react";
import Badge from "@/components/ui/Badge";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";
import { TableConfig } from "@/global-config/types/tableConfig";

export const tableConfig: TableConfig = {
  title: "OMP Plan Options Setup",
  description: "Manage coverage plans, plan codes, sorting order, and active statuses for Overseas Mediclaim Policies.",
  searchPlaceholder: "Search plan by title, code...",
  addButtonLabel: "Add Plan Option",
  addButtonVisibility: true,
  searchVisibility: true,
  emptyMessage: "No matching plan options found in database.",
  columns: [
    {
      key: "id",
      header: "ID",
      className: "font-mono font-black text-slate-900 text-[11px]",
    },
    {
      key: "label",
      header: "Plan Title",
      render: (row) => (
        <span className="font-extrabold text-slate-900 text-xs">
          {row.label || row.plan_title}
        </span>
      ),
    },
    {
      key: "value",
      header: "Plan Code",
      render: (row) => (
        <span className="font-mono font-extrabold text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded text-[11px] border border-blue-300">
          {row.value || row.plan_code}
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
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "inactive" ? "danger" : "success"}>
          {(row.status || "active").toUpperCase()}
        </Badge>
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
