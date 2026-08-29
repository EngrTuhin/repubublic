import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";

export const tableConfig = {
  title: "PA Table Types Setup",
  description: "Configure Personal Accident table coverage types and benefit categories.",
  searchPlaceholder: "Search table types by name, code...",
  addButtonLabel: "Add Table Type",
  addButtonVisibility: false,
  searchVisibility: true,
  emptyMessage: "No matching PA table types found in database.",
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
      key: "label",
      header: "Table Type Name",
      render: (row: any) => (
        <div className="font-bold text-xs text-slate-900">
          {row.label}
        </div>
      ),
    },
    {
      key: "value",
      header: "Table Type Code / Value",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.value}
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
