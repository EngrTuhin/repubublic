import React from "react";
import Badge from "@/components/ui/Badge";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";

export const tableConfig = {
  title: "Personal Accident Occupations",
  description: "Manage Personal Accident occupations, risk classifications, and codes.",
  searchPlaceholder: "Search occupations by title, code, risk class...",
  addButtonLabel: "Add Occupation",
  addButtonVisibility: true,
  searchVisibility: true,
  emptyMessage: "No matching occupations found in database.",
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
      header: "Occupation Name",
      render: (row: any) => (
        <div className="font-bold text-xs text-slate-900">
          {row.label}
        </div>
      ),
    },
    {
      key: "value",
      header: "Occupation Code / Value",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.value}
        </span>
      ),
    },
    {
      key: "risk_class",
      header: "Risk Classification",
      render: (row: any) => {
        const rc = String(row.risk_class || "").toLowerCase();
        let variant: "success" | "warning" | "danger" | "info" | "neutral" = "info";
        if (rc.includes("1") || rc.includes("i") || rc.includes("low")) variant = "success";
        else if (rc.includes("2") || rc.includes("ii") || rc.includes("med")) variant = "warning";
        else if (rc.includes("3") || rc.includes("iii") || rc.includes("high")) variant = "danger";

        return (
          <Badge variant={variant}>
            {row.risk_class}
          </Badge>
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
