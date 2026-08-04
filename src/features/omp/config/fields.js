export const ompUnderwritingLayoutConfig = {
  type: "tab-based",
  tabs: [
    {
      id: "coverage",
      label: "Trip & Coverage",
      icon: "Globe",
      sections: [
        {
          id: "trip_info",
          title: "Trip Details",
          class: "col-span-12",
          fields: [
            {
              name: "policy_type",
              label: "Travel Purpose",
              type: "select",
              required: true,
              placeholder: "Select travel purpose",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "country_of_visit",
              label: "Destination Country / Region",
              type: "select",
              required: true,
              isSearchable: true,
              placeholder: "Select destination country",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "plan_type",
              label: "OMP Plan Type",
              type: "select",
              readOnly: true,
              required: true,
              placeholder: "Auto-calculated",
              colSpan: "col-span-12 md:col-span-4",
            },
            { name: "sdate", label: "Policy Start Date (Departure)", type: "date", required: true, colSpan: "col-span-12 md:col-span-4" },
            { name: "edate", label: "Policy End Date (Return)", type: "date", required: true, colSpan: "col-span-12 md:col-span-4" },
            { name: "duration_days", label: "Duration (Days)", type: "number", readOnly: true, placeholder: "Auto-calculated", colSpan: "col-span-12 md:col-span-4" },
          ],
        },
      ],
    },
    {
      id: "insured",
      label: "Insured Details",
      icon: "User",
      sections: [
        {
          id: "personal_info",
          title: "Personal Information",
          class: "col-span-12 lg:col-span-6 md:col-span-6",
          fields: [
            { name: "insured_name", label: "Insured Name", type: "text", required: true, placeholder: "Full name", colSpan: "col-span-12" },
            { name: "dob", label: "Date of Birth", type: "date", colSpan: "col-span-12 md:col-span-6" },
            { name: "age", label: "Age", type: "number", readOnly: true, placeholder: "e.g. 35", colSpan: "col-span-12 md:col-span-6" },
          ],
        },
        {
          id: "passport_info",
          title: "Passport Information",
          class: "col-span-12 lg:col-span-6 md:col-span-6 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl space-y-4 shadow-sm",
          fields: [
            { name: "passport_no", label: "Passport No.", type: "text", placeholder: "Passport number", colSpan: "col-span-12" },
            { name: "passport_issue_date", label: "Issue Date", type: "date", colSpan: "col-span-12 md:col-span-6" },
            { name: "passport_expiry_date", label: "Expiry Date", type: "date", colSpan: "col-span-12 md:col-span-6" },
          ],
        },
      ],
    },
    {
      id: "premium",
      label: "Premium Summary",
      icon: "FileText",
      sections: [
        {
          id: "premium_info",
          title: "Premium & Financials",
          class: "col-span-12 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl space-y-4 shadow-sm",
          fields: [
            { name: "insamt", label: "Sum Insured / Coverage Limit", type: "text", readOnly: true, placeholder: "Auto-calculated", colSpan: "col-span-12 md:col-span-4" },
            { name: "include_dental", label: "Include Emergency Dental Cover (USD 500 Limit)", type: "checkbox", colSpan: "col-span-12 md:col-span-4" },
            { name: "totprem", label: "Base Premium (BDT)", type: "text", readOnly: true, colSpan: "col-span-12 md:col-span-4" },
            { name: "additional_loading", label: "20% Destination Loading (BDT)", type: "text", readOnly: true, placeholder: "0.00", colSpan: "col-span-12 md:col-span-4" },
            { name: "vat", label: "VAT 15% (BDT)", type: "text", readOnly: true, colSpan: "col-span-12 md:col-span-6" },
            { name: "total", label: "Total Gross Premium (BDT)", type: "text", readOnly: true, colSpan: "col-span-12 md:col-span-6" },
          ],
        },
      ],
    },
  ],
};
