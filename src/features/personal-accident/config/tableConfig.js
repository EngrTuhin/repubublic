import React from "react";
import Badge from "@/components/ui/Badge";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2, Award } from "lucide-react";

export const tableConfig = {
  title: "PA Underwriting",
  description: "Manage personal accident insurance proposals.",
  searchPlaceholder: "Search by occupation, bill no, or ID...",
  addButtonLabel: null,
  addButtonVisibility: false,
  searchVisibility: true,
  emptyMessage: "No PA proposals found.",
  columns: [
    {
      key: "bill_no",
      header: "Bill No",
      render: (row) => (
        <div>
          <div className="font-bold text-xs text-slate-900">{row.bill_no || `PA-${row.id}`}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">{row.created_at?.slice(0, 10) || ""}</div>
        </div>
      ),
    },
    {
      key: "risk_class",
      header: "Occupation / Class",
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-slate-700">{row.risk_class || "—"}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{row.table_type || ""}</div>
        </div>
      ),
    },
    {
      key: "cert_type",
      header: "Certificate",
      render: (row) => (
        <Badge variant="secondary">
          {row.cert_type || "Individual PA"}
        </Badge>
      ),
    },
    {
      key: "insamt",
      header: "Sum Insured",
      render: (row) => (
        <span className="text-xs text-slate-700 font-mono">
          BDT {(parseFloat(row.insamt) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "total",
      header: "Gross Premium",
      render: (row) => (
        <span className="text-xs text-slate-900 font-bold font-mono">
          BDT {(parseFloat(row.total) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const status = row.status || "Pending Underwriting";
        const variant =
          status === "Approved" || status === "Paid"
            ? "success"
            : status === "Rejected"
            ? "danger"
            : "warning";
        return <Badge variant={variant}>{status}</Badge>;
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
              key: "certificate",
              icon: Award,
              title: "Generate PA Insurance Certificate PDF",
              onClick: (r) => {
                const apiBase = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api";
                window.open(`${apiBase}/v1/pas/${r.id}/certificate`, "_blank");
              },
              show: (r) => {
                const s = String(r?.status || r?.payment_status || r?.mr_status || "").toLowerCase();
                return s === "paid" || s === "payed" || r?.is_paid === true || r?.is_paid === 1 || r?.is_paid === "1";
              },
            },
            {
              key: "edit",
              icon: Edit2,
              href: (r) => `/underwriting/personal-accident/${r.id}`,
              show: (r) => {
                const s = String(r?.status || r?.payment_status || r?.mr_status || "").toLowerCase();
                return !(s === "approved" || s === "paid" || r?.is_paid === true || r?.is_paid === 1 || r?.is_paid === "1");
              },
            },
            {
              key: "delete",
              icon: Trash2,
              onClick: (r, h) => h?.handleDelete && h.handleDelete(r.id),
              show: (r) => {
                const s = String(r?.status || r?.payment_status || r?.mr_status || "").toLowerCase();
                return !(s === "approved" || s === "paid" || r?.is_paid === true || r?.is_paid === 1 || r?.is_paid === "1");
              },
            },
          ]}
        />
      ),
    },
  ],
};

export default tableConfig;
