export const formFieldsConfig = [
  {
    name: "code",
    label: "Sub Type Code",
    type: "text",
    required: true,
    placeholder: "e.g. car-sedan, suv, bus",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "name",
    label: "Sub Type Name",
    type: "text",
    required: true,
    placeholder: "e.g. Car / Sedan, SUV, Bus",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
    placeholder: "Enter optional description for class sub type...",
    colSpan: "col-span-12",
  },
];
