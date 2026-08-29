import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";

export const tableConfig = {
  title: "Motor Tariff Groups Setup",
  description: "Configure tariff sub-groups linked to tariff types (e.g. Private Vehicle, Commercial Class A(1)).",
  searchPlaceholder: "Search tariff groups by name...",
  addButtonLabel: "Add Tariff Group",
  addButtonVisibility: true,
  searchVisibility: true,

  emptyMessage: "No matching Motor Tariff Groups found in database.",
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
      header: "Motor Tariff Type",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {row.tariff_type?.name || row.tariff_type?.code || "—"}
        </span>
      ),
    },
    {
      key: "name",
      header: "Tariff Group Name",
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
