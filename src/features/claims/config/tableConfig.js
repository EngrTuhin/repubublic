import React from "react";
import TableActions from "@/components/ui/TableActions";
import Badge from "@/components/ui/Badge";
import { Edit2, Trash2 } from "lucide-react";

function isApprovedRecord(row) {
  const statusLower = String(row?.status || "").toLowerCase();
  const paymentStatusLower = String(row?.payment_status || "").toLowerCase();
  const mrStatusLower = String(row?.mr_status || "").toLowerCase();

  return (
    statusLower === "approved" ||
    statusLower === "paid" ||
    paymentStatusLower === "paid" ||
    mrStatusLower === "paid" ||
    row?.is_paid === true ||
    row?.is_paid === 1 ||
    row?.is_paid === "1"
  );
}

export const tableConfig = {
  title: "Claims Settlement Desk",
  description: "Review, inspect, update status, approve/reject documents, and manage insurance claims.",
  searchPlaceholder: "Search claim no, insured name, policy no, mobile...",
  columns: [
    { key: "claim_no", header: "Claim No", label: "Claim No" },
    { key: "insured_name", header: "Insured Name", label: "Insured Name" },
    { key: "product_type", header: "Product", label: "Product", render: (row) => String(row.product_type || "").toUpperCase() },
    { key: "incident_date", header: "Incident Date", label: "Incident Date" },
    {
      key: "status",
      header: "Status",
      label: "Status",
      render: (row) => {
        const status = row.status || "Pending Review";
        const variant =
          status === "Approved" || status === "Paid"
            ? "success"
            : status === "Rejected"
            ? "danger"
            : status === "In Inspection"
            ? "info"
            : "warning";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      label: "Actions",
      render: (row, helpers) => (
        <TableActions
          row={row}
          helpers={helpers}
          actions={[
            {
              key: "edit",
              icon: Edit2,
              href: (r) => `/claims/${r.id}`,
              show: (r) => !isApprovedRecord(r),
            },
            {
              key: "delete",
              icon: Trash2,
              onClick: (r, h) => h?.handleDelete && h.handleDelete(r.id),
              show: (r) => !isApprovedRecord(r),
            },
          ]}
        />
      ),
    },
  ],
};

export default tableConfig;
