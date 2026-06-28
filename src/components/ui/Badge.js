import React from "react";
import { cn } from "@/lib/utils";

export default function Badge({ children, variant = "primary", className, ...props }) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors";

  const variants = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

export function RoleBadge({ role }) {
  const variants = {
    super_admin: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
    admin: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10",
    underwriter: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/10",
    claims_manager: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
    finance_officer: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10",
  };

  const currentVariant = variants[role] || "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10";
  const formattedRole = role ? role.replace(/_/g, ' ') : 'User';

  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold capitalize",
      currentVariant
    )}>
      {formattedRole}
    </span>
  );
}

