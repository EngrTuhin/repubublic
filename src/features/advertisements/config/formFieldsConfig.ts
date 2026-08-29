export const formConfig = {
  modalWidth: "max-w-4xl",
  fields: [
    {
      name: "title",
      label: "Advertisement Title / Campaign Text",
      type: "text",
      required: true,
      placeholder: "e.g. Special 15% Motor Insurance Discount Deal",
      colSpan: "col-span-12",
    },
    {
      name: "image_url",
      label: "Picture File / Image Upload",
      type: "file",
      required: true,
      placeholder: "Click or drag & drop picture file to upload",
      colSpan: "col-span-12 md:col-span-6",
    },
    {
      name: "link_url",
      label: "Target Redirect Link",
      type: "text",
      placeholder: "e.g. /underwriting/motor-vehicle or https://example.com/promo",
      colSpan: "col-span-12 md:col-span-6",
    },
    {
      name: "product_type",
      label: "Placement / Product Line",
      type: "select",
      required: true,
      defaultValue: "all",
      options: [
        { value: "all", label: "All Products (General Banner)" },
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
  ],
};

export const formFieldsConfig = formConfig.fields;
