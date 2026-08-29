export const formFieldsConfig = [
  {
    name: "label",
    label: "Plan Title / Name",
    type: "text",
    required: true,
    placeholder: "e.g. Plan A - Worldwide Excluding USA & Canada",
    colSpan: "col-span-12",
  },
  {
    name: "value",
    label: "Plan Code",
    type: "text",
    required: true,
    placeholder: "e.g. PLAN_A",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "sort_order",
    label: "Display Order",
    type: "number",
    placeholder: "e.g. 1",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    colSpan: "col-span-12 md:col-span-6",
  },
];
