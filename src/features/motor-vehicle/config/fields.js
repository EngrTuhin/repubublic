import {
  calculateMotorPremium,
  triggerCalc,
} from "../calculations/motorCalculations";

export const motorUnderwritingLayoutConfig = {
  type: "tab-based",
  tabs: [
    {
      id: "general",
      label: "General Information",
      icon: "FileText",
      sections: [
        {
          id: "motor_general",
          title: "General & Vehicle Details",
          class: "col-span-12 lg:col-span-8 md:col-span-8",
          fields: [
            {
              name: "motor_cer_type",
              label: "Motor Certificate Type",
              type: "select",
              endpoint: "/v1/motor-certificate-types",
              mappingTemplate: "motorCertificateTypeTemplate",
              isSearchable: true,
              colSpan: "col-span-12 md:col-span-4",
              required: true,
            },
            {
              name: "searchBillNo",
              label: "Search Bill No",
              type: "search",
              searchKey: "searchBillNo",
              onSearch: "handleSearchBill",
              placeholder: "Enter Bill No...",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "searchCertNo",
              label: "Search Cert No",
              type: "text",
              placeholder: "Enter Cert No...",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "bill_no",
              label: "Bill No",
              type: "text",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "bill_date",
              label: "Bill Date",
              type: "date",
              colSpan: "col-span-12 md:col-span-6",
              required: true,
            },
            {
              name: "clientcode",
              label: "Insured Name",
              type: "select",
              endpoint: "/v1/uw-clients",
              mappingTemplate: "clientSearchTemplate",
              isSearchable: true,
              placeholder: "Search and select client...",
              colSpan: "col-span-12 md:col-span-6",
              required: true,
              onChange: (option, setValue) => {
                setValue("cl_add", option?.raw?.present_add || "");
              },
            },
            {
              name: "cl_add",
              label: "Insured Address",
              type: "text",
              placeholder: "Enter insured address...",
              colSpan: "col-span-12 md:col-span-6",
              className: "h-20",
            },
            {
              name: "bankcode",
              label: "Bank Name",
              type: "select",
              endpoint: "/v1/uw-bank-infos",
              mappingTemplate: "bankSearchTemplate",
              isSearchable: true,
              placeholder: "Select bank...",
              colSpan: "col-span-12 md:col-span-6",
              onChange: (option, setValue) => {
                setValue("bank_br_code", "");
                setValue("bank_add", "");
              },
            },
            {
              name: "bank_br_code",
              label: "Branch Name",
              type: "select",
              endpoint: (watch) => {
                const bank = watch("bankcode");
                return bank
                  ? `/v1/uw-bank-branches?bank_name=${encodeURIComponent(bank)}`
                  : null;
              },
              mappingTemplate: "branchSearchTemplate",
              isSearchable: true,
              placeholder: "Select branch...",
              colSpan: "col-span-12 md:col-span-6",
              onChange: (option, setValue) => {
                setValue("bank_add", option?.raw?.add1 || "");
              },
            },
            {
              name: "bank_add",
              label: "Bank Address",
              type: "text",
              placeholder: "Bank address will be filled automatically...",
              colSpan: "col-span-12 md:col-span-6",
              className: "h-20",
            },
            {
              name: "cert_type",
              label: "Type of Certificate",
              type: "select",
              endpoint: "/v1/uw-certificate-types",
              mappingTemplate: "certificateTypeSearchTemplate",
              isSearchable: true,
              colSpan: "col-span-12 md:col-span-6",
              required: true,
            },
            {
              name: "class_sub_type",
              label: "Description of Vehicle(s)",
              type: "text",
              placeholder: "e.g., HARD JEEP",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "reg_mark",
              label: "Registration Number",
              type: "text",
              placeholder: "DHAKA-METRO-...",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "engno",
              label: "Engine Number",
              type: "text",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "chessisno",
              label: "Chassis Number",
              type: "text",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "make",
              label: "Make",
              type: "text",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "model",
              label: "Model",
              type: "text",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "year",
              label: "Reg. Year",
              type: "text",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "power",
              label: "H.P/C.C/ TON",
              type: "text",
              placeholder: "e.g., 1500 CC.",
              colSpan: "col-span-12",
            },
            {
              name: "sdate",
              label: "From Date",
              type: "date",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "edate",
              label: "To Date",
              type: "date",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "periodof",
              label: "Period",
              type: "text",
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "pday",
              label: "Days",
              type: "text",
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "producerNo",
              label: "Producer No",
              type: "text",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "producerName",
              label: "Name",
              type: "text",
              colSpan: "col-span-12 md:col-span-8",
            },
            {
              name: "ren_cert_no",
              label: "Renewal Cert. No.",
              type: "text",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "limitation",
              label: "Limitation as to use",
              type: "select",
              endpoint: "/v1/uw-limitation-uses",
              mappingTemplate: "limitationUseSearchTemplate",
              isSearchable: true,
              colSpan: "col-span-12 md:col-span-6",
            },
          ],
        },
        {
          id: "duty_free",
          title: "For Duty Free Vehicles",
          class:
            "col-span-12 lg:col-span-4 md:col-span-4 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl space-y-4 shadow-sm",
          fields: [
            {
              name: "coins",
              label: "Co-Insurance",
              type: "checkbox",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "otherleader",
              label: "Non Leader",
              type: "checkbox",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "lead_per",
              label: "Non Leader %",
              type: "text",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "leadcompany",
              label: "Company Name",
              type: "text",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "lead_docno",
              label: "Doc. No.",
              type: "text",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "pw_edit",
              label: "Edit",
              type: "checkbox",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "rcode",
              label: "Renewal",
              type: "checkbox",
              colSpan: "col-span-12 md:col-span-6",
            },
          ],
        },
      ],
    },
    {
      id: "other",
      label: "Other Information",
      icon: "Calculator",
      sections: [
        {
          id: "rate_select",
          title: "Rate Select",
          class:
            "col-span-12 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl mb-6 shadow-sm",
          fields: [
            {
              name: "ttgroup",
              label: "Tariff Type",
              type: "select",
              endpoint: "/v1/uw-tarrifs",
              mappingTemplate: "tariffTypeTemplate",
              isSearchable: true,
              placeholder: "Select Tariff Type...",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "fname",
              label: "Group of Vehicle",
              type: "select",
              endpoint: (watch) => {
                const tariffType = watch("ttgroup");
                return tariffType
                  ? `/v1/uw-tarrifs/vehicle-groups?ttgroup=${encodeURIComponent(tariffType)}`
                  : null;
              },
              mappingTemplate: "groupOfVehicleTemplate",
              isSearchable: true,
              placeholder: "Select Group of Vehicle...",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "tname",
              label: "Type of Vehicle",
              type: "select",
              endpoint: (watch) => {
                const tariffType = watch("ttgroup");
                const groupOfVehicle = watch("fname");
                return tariffType && groupOfVehicle
                  ? `/v1/uw-tarrifs/vehicle-types?ttgroup=${encodeURIComponent(tariffType)}&fname=${encodeURIComponent(groupOfVehicle)}`
                  : null;
              },
              mappingTemplate: "typeOfVehicleTemplate",
              isSearchable: true,
              placeholder: "Select Type of Vehicle...",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "capacity",
              label: "Capacity",
              type: "select",
              endpoint: (watch) => {
                const tariffType = watch("ttgroup");
                const groupOfVehicle = watch("fname");
                const typeOfVehicle = watch("tname");
                return tariffType && groupOfVehicle && typeOfVehicle
                  ? `/v1/uw-tarrifs/capacity?ttgroup=${encodeURIComponent(tariffType)}&fname=${encodeURIComponent(groupOfVehicle)}&name=${encodeURIComponent(typeOfVehicle)}`
                  : null;
              },
              mappingTemplate: "capacityTemplate",
              isSearchable: true,
              placeholder: "Select Capacity...",
              colSpan: "col-span-12 md:col-span-6",
              onChange: (option, setValue, getValues) => {
                const raw = option?.raw || {};
                calculateMotorPremium(setValue, getValues, raw);
              },
            },
            {
              name: "premium_type",
              label: "Basis",
              type: "radio",
              options: [
                { value: "prorata", label: "Prorata Basis" },
                { value: "short", label: "Short Period" },
                { value: "general", label: "General" },
              ],
              colSpan: "col-span-12 md:col-span-6",
            },
          ],
        },
        {
          id: "premium_calculator",
          title: "Premium Details",
          class: "col-span-12 lg:col-span-8 md:col-span-8",
          fields: [
            {
              name: "insamt",
              label: "Insured Amount",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "basic",
              label: "Basic (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-3",
            },
            {
              name: "rate",
              label: "Basic Rate (%)",
              type: "number",
              step: "0.01",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-3",
            },
            {
              name: "odpamt",
              label: "Own Damage Premium (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "less_excl",
              label: "Less Excl. Perils (Tk.)",
              type: "number",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "avts",
              label: "AVTS",
              type: "checkbox",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "avtsamt",
              label: "AVTS Amount (Tk.)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-8",
            },
            {
              name: "short_per",
              label: "Short Period",
              type: "number",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "totprem",
              label: "Annual Premium (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "premiumPercent",
              label: "Percent",
              type: "number",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "loadtextper",
              label: "% of Premium Tk.",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-8",
            },
            {
              name: "actl",
              label: "Motor Liability Premium (Tk.)",
              type: "number",
              readOnly: true,
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "passenger",
              label: "Passenger",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "pamt",
              label: "Amount",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "pas_amt",
              label: "Passenger Total (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "driver",
              label: "Driver",
              type: "select",
              endpoint: "/v1/uw-drivers",
              mappingTemplate: "driverSearchTemplate",
              isSearchable: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "driver_amt",
              label: "Driver Paid (Tk.)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "ncb",
              label: "Less: NCB in % (ODP)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "noclaim_actl",
              label: "% (ACTL)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "ncbamt",
              label: "NCB Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "loadper",
              label: "Add: Loading in % (ODP)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "addload_actl",
              label: "% (ATCL)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "loadamt",
              label: "Loading Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "ex_load_amt",
              label: "Extra Loading (Tk.)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-12",
            },
            {
              name: "extra1",
              label: "Road User",
              type: "checkbox",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "extra1_amt",
              label: "Road User Amount (Tk.)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-8",
            },
            {
              name: "discount",
              label: "Discount (%)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "disamt",
              label: "Discount Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "theftamt",
              label: "Com: theft claim",
              type: "text",
              colSpan: "col-span-12 md:col-span-12",
            },
            {
              name: "premium",
              label: "Net Premium (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12",
            },
            {
              name: "addVat",
              label: "Add Vat 15% on Net Premium",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "vat",
              label: "VAT Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-8",
            },
            {
              name: "total",
              label: "Gross Premium (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12",
            },
          ],
        },
        {
          id: "deductable_risk",
          title: "Deductable Risk",
          class:
            "col-span-12 lg:col-span-4 md:col-span-4 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl space-y-4 shadow-sm",
          fields: [
            {
              name: "cycloned",
              label: "Flood & Cyclone",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "cyclonebm_rate",
              label: "Rate (%)",
              type: "number",
              step: "0.01",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "cycloneamt",
              label: "Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "riot",
              label: "Riot & Strike",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "riot_rate",
              label: "Rate (%)",
              type: "number",
              step: "0.01",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "riot_amt",
              label: "Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "earthd",
              label: "Earth",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "earth_rate",
              label: "Rate (%)",
              type: "number",
              step: "0.01",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "earthamt",
              label: "Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
          ],
        },
      ],
    },
    {
      id: "narration",
      label: "Narration",
      icon: "MessageSquare",
      sections: [
        {
          id: "narration_group",
          title: "Narration & Notes",
          class: "col-span-12",
          fields: [
            {
              name: "narration",
              label: "Narration",
              type: "textarea",
              placeholder: "Enter details and notes here...",
              colSpan: "col-span-12",
              className: "h-32",
            },
          ],
        },
      ],
    },
  ],
};

export const motorUnderwritingTableConfig = {
  title: "Motor Underwriting",
  description: "Manage and track motor vehicle underwriting policies.",
  searchPlaceholder: "Search by insured name, bill no, or reg no...",
  filterKey: "cert_type",
  filterOptions: [
    { value: "ALL", label: "All Certificates" },
    { value: "Comprehensive", label: "Comprehensive" },
    { value: "Act Liability", label: "Act Liability" },
  ],
  columns: [
    { key: "bill_no", label: "Bill Details", type: "bill-details" },
    {
      key: "clientcode",
      label: "Insured Name",
      className: "font-semibold text-xs text-slate-700",
    },
    {
      key: "reg_mark",
      label: "Registration No",
      className: "text-xs text-slate-600",
    },
    {
      key: "cert_type",
      label: "Certificate",
      type: "certificate-badge",
    },
    {
      key: "premium",
      label: "Net Premium",
      type: "amount",
      className: "text-xs text-slate-600",
    },
    {
      key: "total",
      label: "Gross Premium",
      type: "amount",
      className: "text-xs text-slate-900 font-bold",
    },
    { key: "status", label: "Status", type: "status-badge" },
  ],
};
