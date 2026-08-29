export const fieldsConfig = {
  type: "tab-based",
  tabs: [
    {
      id: "claim_info",
      label: "Claim Information",
      icon: "FileText",
      sections: [
        {
          id: "claim_details",
          title: "Claim & Policy Details",
          class: "col-span-12",
          fields: [
            { name: "claim_no", label: "Claim No", type: "text", readOnly: true, colSpan: "col-span-12 md:col-span-6" },
            {
              name: "product_type",
              label: "Product Type",
              type: "select",
              colSpan: "col-span-12 md:col-span-6",
              options: [
                { value: "motor", label: "Motor Insurance" },
                { value: "omp", label: "Overseas Mediclaim (OMP)" },
                { value: "pa", label: "Personal Accident (PA)" },
              ],
            },
            { name: "policy_no", label: "Policy / Bill No", type: "text", colSpan: "col-span-12 md:col-span-6" },
            { name: "insured_name", label: "Insured Name", type: "text", required: true, colSpan: "col-span-12 md:col-span-6" },
            { name: "mobile", label: "Mobile Number", type: "text", required: true, colSpan: "col-span-12 md:col-span-6" },
            { name: "email", label: "Email Address", type: "text", colSpan: "col-span-12 md:col-span-6" },
            { name: "incident_date", label: "Incident Date", type: "date", colSpan: "col-span-12 md:col-span-6" },
            { name: "incident_location", label: "Incident Location", type: "text", colSpan: "col-span-12 md:col-span-6" },
            { name: "description", label: "Incident Description / Notes", type: "textarea", colSpan: "col-span-12" },
          ],
        },
      ],
    },
    {
      id: "underwriting_decision",
      label: "Settlement & Underwriting",
      icon: "CheckCircle",
      sections: [
        {
          id: "decision_details",
          title: "Claim Underwriting & Approval",
          class: "col-span-12 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl space-y-4 shadow-sm",
          fields: [
            {
              name: "status",
              label: "Claim Status",
              type: "select",
              required: true,
              colSpan: "col-span-12 md:col-span-6",
              options: [
                { value: "Pending Review", label: "Pending Review" },
                { value: "In Inspection", label: "In Inspection" },
                { value: "Approved", label: "Approved" },
                { value: "Settled", label: "Settled" },
                { value: "Rejected", label: "Rejected" },
              ],
            },
            { name: "estimated_amount", label: "Estimated Loss Amount (BDT)", type: "number", colSpan: "col-span-12 md:col-span-6" },
            { name: "approved_amount", label: "Approved Settlement Amount (BDT)", type: "number", colSpan: "col-span-12 md:col-span-6" },
            { name: "remarks", label: "Underwriter / Inspector Remarks", type: "textarea", colSpan: "col-span-12" },
          ],
        },
      ],
    },
    {
      id: "documents",
      label: "Documents Verification",
      icon: "FileCheck",
      sections: [
        {
          id: "documents_management",
          title: "Attached Claim Documents",
          class: "col-span-12",
          customComponent: "DocumentSection",
          documentableType: "Claim",
          addDocoment: true,
        },
      ],
    },
  ],
};
