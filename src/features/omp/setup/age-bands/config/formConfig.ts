import { Layers } from "lucide-react";

export interface OmpAgeBand {
  id?: number | string;
  code?: string;
  band_code?: string;
  label?: string;
  band_name?: string;
  min_age: number;
  max_age: number;
  status?: "active" | "inactive" | "Active" | "Inactive" | string;
  sort_order?: number;
  created_at?: string;
}

export const defaultAgeBandForm: OmpAgeBand = {
  code: "",
  band_code: "",
  label: "",
  band_name: "",
  min_age: 0,
  max_age: 100,
  status: "active",
  sort_order: 1,
};

export const formFieldsConfig = [
  {
    name: "code",
    label: "Band Code",
    type: "text",
    required: true,
    placeholder: "e.g. OMP-AGE-01",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "label",
    label: "Band Name / Title",
    type: "text",
    required: true,
    placeholder: "e.g. Young Adult",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "min_age",
    label: "Minimum Age (Years)",
    type: "number",
    required: true,
    min: 0,
    max: 120,
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "max_age",
    label: "Maximum Age (Years)",
    type: "number",
    required: true,
    min: 0,
    max: 120,
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "sort_order",
    label: "Display Order",
    type: "number",
    min: 1,
    colSpan: "col-span-12 md:col-span-6",
  },
];


