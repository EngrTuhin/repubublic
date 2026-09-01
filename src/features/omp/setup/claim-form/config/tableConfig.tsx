import React from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2 } from "lucide-react";
import { TableConfig } from "@/global-config/types/tableConfig";

export const tableConfig: TableConfig = {
  title: "OMP Claim Form Setup",
  description: "Configure the OMP (Overseas Mediclaim Policy) claim form content, instructions, and requirements displayed to customers.",
  searchPlaceholder: "Search claim form entries...",
  addButtonLabel: "Add Claim Form Entry",
  addButtonVisibility: false,
  modalWidth: "max-w-4xl",
  searchVisibility: true,
  emptyMessage: "No claim form entries found. Add one to configure the OMP claim form.",
  columns: [
    {
      key: "id",
      header: "ID",
      className: "font-mono font-black text-slate-900 text-[11px]",
    },
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <span className="font-extrabold text-slate-900 text-xs">
          {row.title || "-"}
        </span>
      ),
    },
    {
      key: "content",
      header: "Content Preview",
      render: (row) => (
        <span
          className="text-xs text-slate-600 font-medium max-w-[320px] line-clamp-2 block"
          dangerouslySetInnerHTML={{
            __html: (row.content || "").replace(/<[^>]*>/g, "").slice(0, 100) + (row.content?.length > 100 ? "..." : ""),
          }}
        />
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
            // {
            //   key: "delete",
            //   icon: Trash2,
            //   onClick: (r, h) => h?.handleDelete && h.handleDelete(r.id),
            // },
          ]}
        />
      ),
    },
  ],
};
