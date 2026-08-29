export const formFieldsConfig = [
  {
    name: "code",
    label: "Usage Code",
    type: "text",
    required: true,
    placeholder: "e.g. private_use, commercial_use",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "name",
    label: "Usage Name",
    type: "text",
    required: true,
    placeholder: "e.g. Private Use, Commercial Use",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
    placeholder: "Enter optional description for vehicle usage...",
    colSpan: "col-span-12",
  },
];
