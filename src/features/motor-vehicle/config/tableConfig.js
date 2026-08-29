import React from "react";
import TableActions from "@/components/ui/TableActions";
import Badge from "@/components/ui/Badge";
import { Edit2, Trash2, Award } from "lucide-react";

export const tableConfig = {
  title: "Motor Underwriting",
  description: "Manage and track motor vehicle underwriting policies.",
  searchPlaceholder: "Search by insured name, bill no, or reg no...",
  addButtonLabel: "New Motor Policy",
  addButtonVisibility: true,
  searchVisibility: true,
  emptyMessage: "No underwriting records found.",
  onClick: () => {
    if (typeof window !== "undefined") {
      window.location.href = "/underwriting/motor-vehicle/new";
    }
  },
  columns: [
    {
      key: "bill_no",
      header: "Bill Details",
      render: (row) => (
        <div>
          <div className="font-bold text-xs text-slate-900">
            #{row.bill_no || row.billNo}
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            {row.bill_date || row.billDate}
          </div>
        </div>
      ),
    },
    {
      key: "clientcode",
      header: "Insured Name",
      render: (row) => (
        <div className="font-semibold text-xs text-slate-700">
          {row.cl_name || row.titlename || row.insuredName || row.clientcode || ""}
        </div>
      ),
    },
    {
      key: "reg_mark",
      header: "Registration No",
      render: (row) => (
        <span className="text-xs text-slate-600 font-mono">
          {row.reg_mark || "—"}
        </span>
      ),
    },
    {
      key: "cert_type",
      header: "Certificate",
      render: (row) => (
        <Badge
          variant={
            (row.cert_type || row.typeOfCertificate) === "Comprehensive"
              ? "primary"
              : "secondary"
          }
        >
          {row.cert_type || row.typeOfCertificate || "Standard"}
        </Badge>
      ),
    },
    {
      key: "premium",
      header: "Net Premium",
      render: (row) => (
        <span className="text-xs text-slate-600 font-mono">
          BDT {(parseFloat(row.premium) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "total",
      header: "Gross Premium",
      render: (row) => (
        <span className="text-xs text-slate-900 font-bold font-mono">
          BDT {(parseFloat(row.total || row.grossPremium) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Underwriting Status",
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
              title: "Generate Insurance Certificate PDF",
              onClick: (r) => {
                const apiBase = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api";
                const typeLower = String(r?.class_sub_type || r?.cert_type || "").toLowerCase();
                let type = "PV";
                if (typeLower.includes("commercial") || typeLower.includes("cv") || typeLower.includes("tanker") || typeLower.includes("truck")) {
                  type = "CV";
                } else if (typeLower.includes("cycle") || typeLower.includes("mc") || typeLower.includes("bike")) {
                  type = "MC";
                }
                window.open(`${apiBase}/v1/motorinsurances/${r.id}/certificate?type=${type}`, "_blank");
              },
              show: (r) => {
                const s = String(r?.status || r?.payment_status || r?.mr_status || "").toLowerCase();
                return s === "paid";
              },
            },
            {
              key: "edit",
              icon: Edit2,
              href: (r) => `/underwriting/motor-vehicle/${r.id}`,
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

export const motorUnderwritingTableConfig = tableConfig;
export default tableConfig;
