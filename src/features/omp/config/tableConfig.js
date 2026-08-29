import React from "react";
import Badge from "@/components/ui/Badge";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2, Award } from "lucide-react";

export const tableConfig = {
  title: "OMP Underwriting",
  description: "Manage overseas mediclaim insurance proposals.",
  searchPlaceholder: "Search by insured name, passport, country or bill no...",
  addButtonLabel: null,
  addButtonVisibility: false,
  searchVisibility: true,
  emptyMessage: "No OMP proposals found.",
  columns: [
    {
      key: "bill_no",
      header: "Bill No",
      render: (row) => (
        <div>
          <div className="font-bold text-xs text-slate-900">{row.bill_no || `OMP-${row.id}`}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">{row.created_at?.slice(0, 10) || ""}</div>
        </div>
      ),
    },
    {
      key: "insured_name",
      header: "Insured Name",
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-slate-700">{row.insured_name || "—"}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Age: {row.age || "—"}</div>
        </div>
      ),
    },
    {
      key: "passport_no",
      header: "Passport",
      render: (row) => (
        <span className="text-xs text-slate-600 font-mono">{row.passport_no || "—"}</span>
      ),
    },
    {
      key: "cert_type",
      header: "Certificate",
      render: (row) => (
        <Badge variant="secondary">
          {row.cert_type || "Comprehensive Travel"}
        </Badge>
      ),
    },
    {
      key: "country_of_visit",
      header: "Country",
      render: (row) => <Badge variant="primary">{row.country_of_visit || "—"}</Badge>,
    },
    {
      key: "plan_type",
      header: "Plan",
      render: (row) => (
        <div>
          <div className="text-xs text-slate-600 font-medium">{row.plan_type || "—"}</div>
          <div className="text-[10px] text-slate-400">{row.policy_type || ""}</div>
        </div>
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
          status === "Approved" || status === "Paid" || status === "Confirmed"
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
              title: "Generate OMP Insurance Certificate PDF",
              onClick: (r) => {
                const apiBase = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api";
                window.open(`${apiBase}/v1/omps/${r.id}/certificate`, "_blank");
              },
              show: (r) => {
                const s = String(r?.status || r?.payment_status || r?.mr_status || "").toLowerCase();
                return s === "paid" || s === "payed" || r?.is_paid === true || r?.is_paid === 1 || r?.is_paid === "1";
              },
            },
            {
              key: "edit",
              icon: Edit2,
              href: (r) => `/underwriting/omp/${r.id}`,
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
