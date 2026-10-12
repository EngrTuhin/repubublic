import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";

export const tableConfig = {
  title: "Comprehensive & Liability Configuration",
  description: "Configure motor comprehensive peril rates, third-party liability parameters, and statutory VAT exemption percentages.",
  searchPlaceholder: "Search configuration by key, name, value...",
  addButtonLabel: "Add Configuration",
  addButtonVisibility: false,
  searchVisibility: true,
  emptyMessage: "No matching Comprehensive & Liability Configurations found in database.",
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
      key: "name",
      header: "Coverage / Rate Name",
      render: (row: any) => (
        <div className="font-bold text-xs text-slate-900">
          {row.name}
        </div>
      ),
    },
    {
      key: "key",
      header: "Rate Code",
      render: (row: any) => (
        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
          {row.key}
        </span>
      ),
    },
    {
      key: "value",
      header: "Applicable Rate",
      render: (row: any) => {
        if (row.value === null || row.value === undefined || row.value === "") {
          return <span className="text-slate-400">—</span>;
        }
        const valStr = String(row.value);
        const numVal = Number(row.value);
        const isNegative = !isNaN(numVal) && numVal < 0;
        const isClaimLoading = row.key?.includes("claim_loading");
        const displayVal = valStr.includes("%")
          ? valStr
          : isClaimLoading && !valStr.startsWith("+")
          ? `+${valStr}%`
          : `${valStr}%`;

        return (
          <span
            className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${
              isNegative
                ? "text-rose-800 bg-rose-50 border-rose-200"
                : isClaimLoading
                ? "text-amber-800 bg-amber-50 border-amber-200"
                : "text-emerald-800 bg-emerald-50 border-emerald-200"
            }`}
          >
            {displayVal}
          </span>
        );
      },
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
            // {
            //   key: "delete",
            //   icon: Trash2,
            //   onClick: (r: any, h: any) => h?.handleDelete && h.handleDelete(r.id),
            // },
          ]}
        />
      ),
    },
  ],
};
