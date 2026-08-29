export const formFieldsConfig = [
  {
    name: "code",
    label: "Tariff Type Code",
    type: "text",
    required: true,
    placeholder: "e.g. PRIVATE, MOTORCYCLE, A1",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "name",
    label: "Tariff Type Name",
    type: "text",
    required: true,
    placeholder: "e.g. Private Vehicle, Commercial Class A(1)",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
    placeholder: "Enter optional description or classification details...",
    colSpan: "col-span-12",
  },
];
