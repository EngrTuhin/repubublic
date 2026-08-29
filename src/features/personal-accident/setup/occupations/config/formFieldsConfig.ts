export const formFieldsConfig = [
  {
    name: "label",
    label: "Occupation Title / Name",
    type: "text",
    required: true,
    placeholder: "e.g. Accountant / Office Manager",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "value",
    label: "Occupation Code / Value",
    type: "text",
    required: true,
    placeholder: "e.g. accountant_office_manager",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "risk_class",
    label: "Risk Class",
    type: "select",
    required: true,
    options: [
      { label: "Class I ", value: "class_1" },
      { label: "Class II ", value: "class_2" },
      { label: "Class III", value: "class_3" },

    ],
    placeholder: "Select Risk Class",
    colSpan: "col-span-12",
  },
];
