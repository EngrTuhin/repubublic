export const formFieldsConfig = [
  {
    name: "label",
    label: "Table Type Name",
    type: "text",
    required: true,
    placeholder: "e.g. Table I - Death Only",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "value",
    label: "Table Type Code / Value",
    type: "select",
    required: true,
    options: [
      { label: "Table A", value: "table_a" },
      { label: "Table B", value: "table_b" },
      { label: "Table C", value: "table_c" },

    ],
    placeholder: "Select Table Type Code",
    colSpan: "col-span-12 md:col-span-6",
  },
];
