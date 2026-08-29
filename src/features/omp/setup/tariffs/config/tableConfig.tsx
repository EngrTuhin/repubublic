import React from "react";
import Badge from "@/components/ui/Badge";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";
import { TableConfig } from "@/global-config/types/tableConfig";

export const tableConfig: TableConfig = {
  title: "OMP Premium Tariffs Setup",
  description: "Configure premium rates, age bands, trip day ranges, and Schengen applicability for Overseas Mediclaim Policies.",
  searchPlaceholder: "Search tariffs by policy type, plan option, days range...",
  addButtonLabel: "Add Tariff Record",
  addButtonVisibility: false,
  searchVisibility: true,
  emptyMessage: "No matching tariff records found in database.",
  columns: [
    {
      key: "id",
      header: "ID",
      className: "font-mono font-black text-slate-900 text-[11px]",
    },
    {
      key: "policy_type",
      header: "Policy Type",
      render: (row) => (
        <span className="font-extrabold text-slate-900 text-xs">
          {row.policyType?.label || row.policyType?.value || row.policy_type_id || "-"}
        </span>
      ),
    },
    {
      key: "plan_option",
      header: "Plan Option",
      render: (row) => (
        <span className="font-mono font-extrabold text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded text-[11px] border border-blue-300">
          {row.planOption?.label || row.planOption?.value || row.plan_option_id || "ALL / NONE"}
        </span>
      ),
    },
    {
      key: "days_range",
      header: "Days Range",
      render: (row) => (
        <span className="font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
          {row.min_days ?? row.minDays ?? 0} - {row.max_days ?? row.maxDays ?? "∞"} Days
        </span>
      ),
    },

    {
      key: "is_schengen",
      header: "Schengen",
      render: (row) => (
        <Badge variant={row.is_schengen || row.isSchengen ? "success" : "neutral"}>
          {row.is_schengen || row.isSchengen ? "SCHENGEN" : "NON-SCHENGEN"}
        </Badge>
      ),
    },
    {
      key: "rates",
      header: "Rates Configured",
      render: (row) => {
        const rates = row.rates || {};
        const count = typeof rates === "object" ? Object.keys(rates).length : 0;
        return (
          <span className="font-mono font-bold text-indigo-700 text-[11px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200" title={JSON.stringify(rates)}>
            {count} Band Rate{count !== 1 ? "s" : ""}
          </span>
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
