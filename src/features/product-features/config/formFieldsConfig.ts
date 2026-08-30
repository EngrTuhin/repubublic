export const formConfig = {
  modalWidth: "max-w-4xl",

  fields: [
    {
      name: "product_type",
      label: "Product Line",
      type: "select",
      required: true,
      defaultValue: "motor",
      options: [
        { value: "motor", label: "Motor Insurance (MOTOR)" },
        { value: "omp", label: "Overseas Mediclaim (OMP)" },
        { value: "pa", label: "Personal Accident (PA)" },
      ],
      colSpan: "col-span-12 md:col-span-6",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      defaultValue: 1,
      options: [
        { value: 1, label: "Active" },
        { value: 0, label: "Inactive" },
      ],
      colSpan: "col-span-12 md:col-span-6",
    },
    {
      name: "description",
      label: "Feature Description",
      type: "texteditor",
      required: true,
      rows: 5,
      placeholder: "Enter feature coverage details or benefit description...",
      colSpan: "col-span-12",
    },
  ],
};

export const formFieldsConfig = formConfig.fields;
