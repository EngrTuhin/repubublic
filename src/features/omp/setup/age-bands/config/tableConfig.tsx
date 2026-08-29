import React from "react";
import { Clock, Edit2, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import TableActions from "@/components/ui/TableActions";

import { TableConfig, TableColumn, RenderHelpers } from "@/global-config/types/tableConfig";
export type { TableConfig, TableColumn, RenderHelpers };

export const tableConfig: TableConfig = {
  title: "OMP Age Bands Setup",
  description: "Manage age classification ranges, minimum & maximum age limits for Overseas Mediclaim Policies.",
  searchPlaceholder: "Search age bands by code or title...",
  addButtonLabel: "Add Age Band",
  addButtonVisibility: false,

  // onClick: "",
  // onSubmit: "test",
  emptyMessage: "No matching age bands found in database.",
  columns: [
    {
      key: "id",
      header: "ID",
      className: "font-mono font-black text-slate-900 text-[11px]",
    },
    {
      key: "code",
      header: "Band Code",
      render: (row) => (
        <span className="font-mono font-extrabold text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded text-[11px] border border-blue-300">
          {row.code || row.band_code}
        </span>
      ),
    },
    {
      key: "label",
      header: "Band Name / Title",
      render: (row) => (
        <span className="font-extrabold text-slate-900 text-xs">
          {row.label || row.band_name}
        </span>
      ),
    },
    {
      key: "age_range",
      header: "Age Range",
      render: (row) => (
        <div className="inline-flex items-center gap-1 font-bold text-slate-900 text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
          <Clock className="w-3 h-3 text-slate-600" />
          <span>{row.min_age ?? row.minAge} - {row.max_age ?? row.maxAge} yrs</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const val = row.status;
        const isActive = !val || String(val).toLowerCase() === "active" || String(val).toLowerCase() === "a";
        return (
          <Badge variant={isActive ? "success" : "warning"}>
            {isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        );
      },
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
              title: "Edit",
              className: "p-1 text-slate-700 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors cursor-pointer",
              icon: Edit2,
              onClick: (r, h) => h?.openEditModal && h.openEditModal(r),
            },
            {
              key: "delete",
              title: "Delete",
              className: "p-1 text-slate-600 hover:text-rose-700 hover:bg-rose-100 rounded transition-colors cursor-pointer",
              icon: Trash2,
              onClick: (r, h) => r?.id && h?.handleDelete && h.handleDelete(r.id),
            },
          ]}
        />
      ),
    },
  ],
};
