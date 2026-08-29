export const paUnderwritingLayoutConfig = {
  type: "tab-based",
  tabs: [
    {
      id: "coverage",
      label: "Occupation & Coverage",
      icon: "Shield",
      sections: [
        {
          id: "occupation_details",
          title: "Occupation & Risk Category",
          class: "col-span-12",
          fields: [
            {
              name: "risk_class",
              label: "Occupation / Profession",
              type: "select",
              required: true,
              placeholder: "Select occupation",
              colSpan: "col-span-12 md:col-span-6",
              options: [
                { value: "accountant", label: "Accountant" },
                { value: "banker", label: "Banker" },
                { value: "barrister", label: "Barrister / Lawyer" },
                { value: "doctor", label: "Medical Practitioner / Doctor" },
                { value: "mercantile_assistant", label: "Mercantile Assistant" },
                { value: "executive", label: "Executive / Administrative Officer" },
                { value: "clerical", label: "Clerical Staff / Desk Job" },
                { value: "architect", label: "Architect" },
                { value: "planter", label: "Planter" },
                { value: "electrical_engineer", label: "Electrical Engineer (Supervising)" },
                { value: "master_tradesman", label: "Master Tradesman (Supervisory)" },
                { value: "motor_engineer", label: "Motor Engineer (Master Working)" },
                { value: "veterinary_surgeon", label: "Veterinary Surgeon" },
                { value: "manual_worker", label: "Manual Worker (General)" },
              ],
            },
            {
              name: "table_type",
              label: "Benefit Coverage Table",
              type: "select",
              required: true,
              placeholder: "Select coverage plan",
              colSpan: "col-span-12 md:col-span-6",
              options: [
                { value: "table_a", label: "Table A — Death & Full Disability (Permanent & Temporary)" },
                { value: "table_b", label: "Table B — Death & Permanent Disability" },
                { value: "table_c", label: "Table C — Death Only" },
              ],
            },
            { name: "sdate", label: "Policy Start Date", type: "date", required: true, colSpan: "col-span-12 md:col-span-6" },
            { name: "edate", label: "Policy End Date", type: "date", required: true, colSpan: "col-span-12 md:col-span-6" },
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
          id: "financial_details",
          title: "Sum Insured & Premium",
          class: "col-span-12 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl space-y-4 shadow-sm",
          fields: [
            { name: "insamt", label: "Sum Insured (BDT)", type: "text", required: true, placeholder: "e.g. 500000", colSpan: "col-span-12 md:col-span-6" },
            { name: "totprem", label: "Base Premium (BDT)", type: "text", readOnly: true, colSpan: "col-span-12 md:col-span-6" },
            { name: "vat", label: "VAT 15% (BDT)", type: "text", readOnly: true, colSpan: "col-span-12 md:col-span-6" },
            { name: "total", label: "Total Gross Premium (BDT)", type: "text", readOnly: true, colSpan: "col-span-12 md:col-span-6" },
          ],
        },
      ],
    },
    {
      id: "documents",
      label: "Documents",
      icon: "FileCheck",
      sections: [
        {
          id: "documents_management",
          title: "Attached Policy Documents",
          class: "col-span-12",
          customComponent: "DocumentSection",
          documentableType: "Pa",
          addDocoment: true,
        },
      ],
    },
    {
      id: "confirmation",
      label: "Confirmation",
      icon: "MessageSquare",
      sections: [
        {
          id: "confirmation_group",
          title: "Final Confirmation",
          class: "col-span-12",
          fields: [

            {
              name: "status",
              label: "Underwriting Status",
              type: "select",
              required: true,
              defaultValue: "Pending Underwriting",
              colSpan: "col-span-12 md:col-span-6",
              options: [
                { value: "Pending Underwriting", label: "Pending Underwriting" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
