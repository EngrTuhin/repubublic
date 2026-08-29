export const formFieldsConfig = [
  {
    name: "label",
    label: "Country Name",
    type: "text",
    required: true,
    placeholder: "e.g. Germany",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "value",
    label: "Country Code / Value",
    type: "text",
    required: true,
    placeholder: "e.g. GERMANY",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "iso3",
    label: "ISO3 Code",
    type: "text",
    placeholder: "e.g. DEU",
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "region",
    label: "Region / Continent",
    type: "text",
    placeholder: "e.g. Europe",
    colSpan: "col-span-12 md:col-span-6",
  },
  // {
  //   name: "premium_zone",
  //   label: "Premium Zone",
  //   type: "text",
  //   placeholder: "e.g. Zone 1",
  //   colSpan: "col-span-12 md:col-span-6",
  // },
  {
    name: "schengen",
    label: "Schengen Member",
    type: "select",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "usa_canada",
    label: "USA / Canada Included",
    type: "select",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
    colSpan: "col-span-12 md:col-span-6",
  },
  {
    name: "loading",
    label: "Loading Applied",
    type: "select",
    options: [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ],
    colSpan: "col-span-12 md:col-span-6",
  },
];
