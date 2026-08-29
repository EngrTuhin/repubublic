import React from "react";
import { LucideIcon } from "lucide-react";

export interface RenderHelpers {
  openEditModal?: (item: any) => void;
  handleDelete?: (id: number | string) => void;
  setActiveActionSubmit?: (submitHandler: any) => void;
  [key: string]: any;
}

export interface ActionConfig<T = any> {
  key?: string;
  label?: string;
  title?: string;
  icon?: LucideIcon | React.ReactNode;
  url?: string | ((row: T) => string);
  href?: string | ((row: T) => string);
  onClick?: string | ((row: T, helpers?: any) => void);
  onSubmit?: string | ((row: T, helpers?: any) => void);
  className?: string;
  show?: (row: T) => boolean;
}

export interface TableColumn<T = any> {
  key: string;
  header: string;
  className?: string;
  actions?: ActionConfig<T>[];
  render?: (row: T, helpers?: RenderHelpers) => React.ReactNode;
}

export interface TableConfig {
  title: string;
  description: string;
  searchPlaceholder: string;
  addButtonLabel: string;
  emptyMessage: string;
  responseKey?: string;
  modalWidth?: string;
  modalClassName?: string;
  onClick?: string | ((ctx?: any) => void);
  onSubmit?: string | ((data?: any, ctx?: any) => void);
  visibility?: boolean | ((ctx?: any) => boolean) | { addButton?: boolean; search?: boolean };
  addButtonVisibility?: boolean | ((ctx?: any) => boolean);
  searchVisibility?: boolean | ((ctx?: any) => boolean);
  columns: TableColumn[];
}
