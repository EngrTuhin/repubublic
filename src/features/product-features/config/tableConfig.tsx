import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";

export const tableConfig = {
  title: "Product Features Setup",
  description: "Configure product features, benefits, and coverage rules for Motor, Overseas Mediclaim (OMP), and Personal Accident (PA) insurance products.",
  searchPlaceholder: "Search features by description, product type...",
  addButtonLabel: "Add Product Feature",
  addButtonVisibility: false,
  searchVisibility: true,
  emptyMessage: "No matching Product Features found in database.",
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
      key: "product_type",
      header: "Product Line",
      render: (row: any) => {
        const type = (row.product_type || "motor").toLowerCase();
        let badgeStyle = "text-blue-700 bg-blue-50 border-blue-200";
        let label = "MOTOR";

        if (type === "omp") {
          badgeStyle = "text-purple-700 bg-purple-50 border-purple-200";
          label = "OMP";
        } else if (type === "pa") {
          badgeStyle = "text-emerald-700 bg-emerald-50 border-emerald-200";
          label = "PA";
        }

        return (
          <span className={`font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded border ${badgeStyle}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: "description",
      header: "Feature Description",
      render: (row: any) => {
        const plainText = row.description ? row.description.replace(/<[^>]*>/g, "").trim() : "—";
        return (
          <div
            className="font-semibold text-xs text-slate-800 leading-relaxed max-w-lg line-clamp-2"
            title={plainText}
            dangerouslySetInnerHTML={{ __html: row.description || "—" }}
          />
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => (
        <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full ${row.status
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}>
          {row.status ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 text-slate-400" /> Inactive
            </>
          )}
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
