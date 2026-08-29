import React from "react";
import Badge from "@/components/ui/Badge";
import TableActions from "@/components/ui/TableActions";
import { TableConfig, TableColumn } from "@/global-config/types/tableConfig";
import { Edit2, Trash2 } from "lucide-react";
export const tableConfig: TableConfig = {
  title: "OMP Country Options Setup",
  description: "Manage country classifications, ISO codes, Schengen coverage & premium zones for Overseas Mediclaim Policies.",
  searchPlaceholder: "Search country by name, code, region, zone...",
  addButtonLabel: "Add Country Option",
  addButtonVisibility: false,

  emptyMessage: "No matching country options found in database.",
  columns: [
    {
      key: "id",
      header: "ID",
      className: "font-mono font-black text-slate-900 text-[11px]",
    },
    {
      key: "label",
      header: "Country Name",
      render: (row) => (
        <span className="font-extrabold text-slate-900 text-xs">
          {row.label}
        </span>
      ),
    },
    {
      key: "value",
      header: "Country Code",
      render: (row) => (
        <span className="font-mono font-extrabold text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded text-[11px] border border-blue-300">
          {row.value}
        </span>
      ),
    },
    {
      key: "iso3",
      header: "ISO3",
      render: (row) => (
        <span className="font-mono text-xs font-bold text-slate-700 uppercase">
          {row.iso3 || "-"}
        </span>
      ),
    },
    {
      key: "region",
      header: "Region",
      className: "text-xs font-semibold text-slate-700",
    },
    // {
    //   key: "premium_zone",
    //   header: "Premium Zone",
    //   render: (row) => (
    //     <span className="font-semibold text-xs text-slate-800">
    //       {row.premium_zone || row.premiumZone || "-"}
    //     </span>
    //   ),
    // },
    {
      key: "schengen",
      header: "Schengen",
      render: (row) => (
        <Badge variant={row.schengen ? "success" : "neutral"}>
          {row.schengen ? "YES" : "NO"}
        </Badge>
      ),
    },
    {
      key: "usa_canada",
      header: "USA / Canada",
      render: (row) => (
        <Badge variant={row.usa_canada || row.usaCanada ? "info" : "neutral"}>
          {row.usa_canada || row.usaCanada ? "YES" : "NO"}
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
