import React from "react";
import Badge from "@/components/ui/Badge";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";

export const tableConfig = {
  title: "PA Tariffs Setup",
  description: "Configure Personal Accident tariff rates based on occupation, risk class, and table coverage types.",
  searchPlaceholder: "Search tariffs by occupation, risk class, table type...",
  addButtonLabel: "Add PA Tariff Record",
  addButtonVisibility: true,
  searchVisibility: true,
  emptyMessage: "No matching PA tariff records found in database.",
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
      key: "occupation",
      header: "Occupation / Risk Class",
      render: (row: any) => {
        const occ = row.occupation;
        const rc = String(occ?.risk_class || "").toLowerCase();
        let variant: "success" | "warning" | "danger" | "info" | "neutral" = "info";
        if (rc.includes("1") || rc.includes("i") || rc.includes("low")) variant = "success";
        else if (rc.includes("2") || rc.includes("ii") || rc.includes("med")) variant = "warning";
        else if (rc.includes("3") || rc.includes("iii") || rc.includes("high")) variant = "danger";

        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-xs text-slate-900">
              {occ?.label || "All Occupations"}
            </span>
            {occ?.risk_class && (
              <div className="flex items-center gap-1 mt-0.5">
                <Badge variant={variant}>
                  {occ.risk_class}
                </Badge>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "tableType",
      header: "Table Type",
      render: (row: any) => (
        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.tableType?.label || row.tableType?.value || "-"}
        </span>
      ),
    },
    {
      key: "rate",
      header: "Tariff Rate",
      render: (row: any) => (
        <span className="font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md text-xs border border-emerald-200 shadow-2xs">
          {row.rate !== undefined && row.rate !== null ? `${row.rate} %` : "-"}
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
