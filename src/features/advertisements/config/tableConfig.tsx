import React, { useState, useEffect } from "react";
import TableActions from "@/components/ui/TableActions";
import { Edit2, Trash2, CheckCircle2, XCircle, ExternalLink, Image as ImageIcon } from "lucide-react";

function AdImageCell({ src, title }: { src?: string; title?: string }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  if (!src || imgError) {
    return (
      <div className="w-16 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-2xs">
        <ImageIcon className="w-4 h-4 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0 shadow-2xs group">
      <img
        src={src}
        alt={title || "Ad Picture"}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export const tableConfig = {
  title: "Advertisement Banners Setup",
  description: "Manage promotional banner pictures, campaign text descriptions, and target redirect links across product lines.",
  searchPlaceholder: "Search advertisements by title, link, placement...",
  addButtonLabel: "Add Advertisement",
  addButtonVisibility: true,
  searchVisibility: true,
  emptyMessage: "No matching Advertisement Banners found in database.",
  modalWidth: "max-w-4xl",
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
      key: "image_url",
      header: "Picture Preview",
      render: (row: any) => <AdImageCell src={row.image_url} title={row.title} />,
    },
    {
      key: "title",
      header: "Ad Title / Text",
      render: (row: any) => (
        <div className="font-bold text-xs text-slate-900 max-w-xs line-clamp-2">
          {row.title}
        </div>
      ),
    },
    {
      key: "link_url",
      header: "Target Link",
      render: (row: any) => (
        <a
          href={row.link_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-blue-600 hover:text-blue-800 hover:underline max-w-xs truncate font-medium"
        >
          <span>{row.link_url || "—"}</span>
          {row.link_url && <ExternalLink className="w-3 h-3 shrink-0" />}
        </a>
      ),
    },
    {
      key: "product_type",
      header: "Placement",
      render: (row: any) => {
        const type = (row.product_type || "all").toLowerCase();
        let badgeStyle = "text-slate-700 bg-slate-100 border-slate-200";
        let label = "ALL PRODUCTS";

        if (type === "motor") {
          badgeStyle = "text-blue-700 bg-blue-50 border-blue-200";
          label = "MOTOR";
        } else if (type === "omp") {
          badgeStyle = "text-purple-700 bg-purple-50 border-purple-200";
          label = "OMP";
        } else if (type === "pa") {
          badgeStyle = "text-emerald-700 bg-emerald-50 border-emerald-200";
          label = "PA";
        }

        return (
          <span className={`font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${badgeStyle}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => (
        <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full ${
          row.status
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
