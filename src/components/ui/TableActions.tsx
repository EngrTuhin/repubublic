"use client";

import React from "react";
import Link from "next/link";
import { ActionConfig } from "@/global-config/types/tableConfig";
export type { ActionConfig };

export interface TableActionsProps<T = any> {
  row: T;
  helpers?: any;
  actions?: ActionConfig<T>[];
}

export default function TableActions<T = any>({
  row,
  helpers,
  actions = [],
}: TableActionsProps<T>) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex items-center justify-end gap-1">
      {actions.map((act, index) => {
        // Conditional visibility
        if (act.show && !act.show(row)) return null;

        const title =
          act.title ||
          act.label ||
          (act.key ? act.key.charAt(0).toUpperCase() + act.key.slice(1) : "");

        const btnClass =
          act.className ||
          "p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer";

        // Resolve Icon from config
        let renderIcon: React.ReactNode = null;
        if (React.isValidElement(act.icon)) {
          renderIcon = act.icon;
        } else if (act.icon) {
          const IconComp = act.icon as any;
          renderIcon = <IconComp className="w-3.5 h-3.5 stroke-[2.5]" />;
        }

        // URL / Link Action
        const targetUrl =
          typeof act.url === "function"
            ? act.url(row)
            : typeof act.href === "function"
              ? act.href(row)
              : act.url || act.href;

        if (targetUrl) {
          return (
            <Link
              key={act.key || index}
              href={targetUrl}
              className={btnClass}
              title={title}
            >
              {renderIcon}
            </Link>
          );
        }

        // Handle Action Button Click (runs act.onClick callback/string name, or default fallback)
        const handleActionClick = (e: React.MouseEvent) => {
          e.preventDefault();

          if (act.onSubmit && helpers?.setActiveActionSubmit) {
            helpers.setActiveActionSubmit(act.onSubmit);
          } else if (helpers?.setActiveActionSubmit) {
            helpers.setActiveActionSubmit(null);
          }

          const item = row as any;
          const targetHandler = act.onClick;

          if (typeof targetHandler === "function") {
            targetHandler(row, helpers);
            return;
          }

          if (typeof targetHandler === "string" && targetHandler.trim() !== "") {
            const fnName = targetHandler.trim();
            if (helpers && typeof helpers[fnName] === "function") {
              helpers[fnName](fnName === "handleDelete" ? (item.id ?? item) : item);
              return;
            }
          }

          // Fallback if onClick is empty string or omitted
          if (act.key === "edit" && helpers?.openEditModal) {
            helpers.openEditModal(row);
          } else if (act.key === "delete" && helpers?.handleDelete) {
            helpers.handleDelete(item.id ?? item);
          }
        };

        // Button Action
        return (
          <button
            key={act.key || index}
            type="button"
            onClick={handleActionClick}
            className={btnClass}
            title={title}
          >
            {renderIcon}
          </button>
        );
      })}
    </div>
  );
}
