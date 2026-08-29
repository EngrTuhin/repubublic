import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";

export const tableConfig = {
  title: "Motor Tariff Types Setup",
  description: "Configure Motor Insurance tariff classifications and vehicle category types (e.g. PRIVATE, MOTORCYCLE, A1, B1, etc.).",
  searchPlaceholder: "Search tariff types by code, name...",
  addButtonLabel: "Add Tariff Type",
  addButtonVisibility: false,
  searchVisibility: true,
  emptyMessage: "No matching Motor Tariff Types found in database.",
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
      key: "code",
      header: "Type Code",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {row.code}
        </span>
      ),
    },
    {
      key: "name",
      header: "Tariff Type Name",
      render: (row: any) => (
        <div className="font-bold text-xs text-slate-900">
          {row.name}
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (row: any) => (
        <span className="text-xs text-slate-600">
          {row.description || "—"}
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
