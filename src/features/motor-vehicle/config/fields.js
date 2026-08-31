import {
  calculateMotorPremium,
  triggerCalc,
} from "../calculations/motorCalculations";

export const motorUnderwritingLayoutConfig = {
  type: "tab-based",
  tabs: [
    {
      id: "general",
      label: "General & Vehicle Information",
      icon: "FileText",
      sections: [
        {
          id: "motor_general",
          title: "General & Vehicle Details",
          class: "col-span-12",
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
              valueKey: "description",
              labelKey: "description",
            },
            {
              name: "cert_type",
              label: "Type of Certificate",
              type: "select",
              endpoint: "/v1/uw-certificate-types",
              mappingTemplate: "certificateTypeSearchTemplate",
              isSearchable: true,
              colSpan: "col-span-12 md:col-span-4",
              required: true,
            },
            {
              name: "bill_no",
              label: "Bill No",
              type: "text",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "user_id",
              label: "Insured Name",
              type: "select",
              endpoint: "/v1/uw-clients",
              mappingTemplate: "clientSearchTemplate",
              isSearchable: true,
              placeholder: "Search and select client...",
              colSpan: "col-span-12 md:col-span-6",
              required: true,
            },
            {
              name: "motor_class_sub_type_id",
              label: "Vehicle Class Sub Type",
              type: "select",
              endpoint: "/v1/motor-class-sub-types",
              mappingTemplate: "motorClassSubTypeTemplate",
              isSearchable: true,
              valueKey: "id",
              labelKey: "name",
              colSpan: "col-span-12 md:col-span-6",
              required: true,
              onChange: (opt, setValue, getValues) => {
                const vehicleName = opt?.label || opt?.raw?.name || "";
                const usage = getValues ? getValues("motor_vehicle_usage_id") : "";
                const vLower = String(vehicleName).toLowerCase();
                const uLower = String(usage).toLowerCase();
                let autoCerType = "Private Vehicle";
                if (vLower.includes("motorcycle") || vLower.includes("scooter")) {
                  autoCerType = "Motorcycle";
                } else if (
                  vLower.includes("commercial") ||
                  vLower.includes("bus") ||
                  vLower.includes("truck") ||
                  vLower.includes("lorry") ||
                  vLower.includes("covered van") ||
                  vLower.includes("tanker") ||
                  vLower.includes("trailer") ||
                  vLower.includes("taxi") ||
                  vLower.includes("rent-a-car") ||
                  vLower.includes("cng") ||
                  vLower.includes("rickshaw") ||
                  uLower === "2" ||
                  uLower.includes("commercial")
                ) {
                  autoCerType = "Commercial Vehicle";
                }
                if (setValue) setValue("motor_cer_type", autoCerType);
              },
            },
            {
              name: "motor_vehicle_usage_id",
              label: "Vehicle Usage",
              type: "select",
              endpoint: "/v1/motor-vehicle-usages",
              mappingTemplate: "motorVehicleUsageTemplate",
              isSearchable: true,
              valueKey: "id",
              labelKey: "name",
              colSpan: "col-span-12 md:col-span-6",
              required: true,
              onChange: (opt, setValue, getValues) => {
                const usageName = opt?.label || opt?.raw?.name || opt?.value || "";
                const vehicleName = getValues ? getValues("motor_class_sub_type_id") : "";
                const vLower = String(vehicleName).toLowerCase();
                const uLower = String(usageName).toLowerCase();
                let autoCerType = "Private Vehicle";
                if (vLower.includes("motorcycle") || vLower.includes("scooter")) {
                  autoCerType = "Motorcycle";
                } else if (
                  vLower.includes("commercial") ||
                  vLower.includes("bus") ||
                  vLower.includes("truck") ||
                  vLower.includes("lorry") ||
                  vLower.includes("covered van") ||
                  vLower.includes("tanker") ||
                  vLower.includes("trailer") ||
                  vLower.includes("taxi") ||
                  vLower.includes("rent-a-car") ||
                  vLower.includes("cng") ||
                  vLower.includes("rickshaw") ||
                  uLower === "2" ||
                  uLower.includes("commercial")
                ) {
                  autoCerType = "Commercial Vehicle";
                }
                if (setValue) setValue("motor_cer_type", autoCerType);
              },
            },
            {
              name: "reg_mark",
              label: "Registration Number",
              type: "text",
              placeholder: "e.g., DHAKA-METRO-...",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "previous_insurance_no",
              label: "Previous Insurance Number",
              type: "text",
              placeholder: "Enter previous policy/cover note no...",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "engno",
              label: "Engine Number",
              type: "text",
              placeholder: "Enter engine number...",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "chessisno",
              label: "Chassis Number",
              type: "text",
              placeholder: "Enter chassis number...",
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "make",
              label: "Make",
              type: "text",
              placeholder: "e.g., TOYOTA",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "model",
              label: "Model",
              type: "text",
              placeholder: "e.g., Corolla",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "year",
              label: "Reg. Year",
              type: "text",
              placeholder: "e.g., 2020",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "power",
              label: "H.P / C.C / Tonnage",
              type: "number",
              placeholder: "e.g., 1500 CC or 1.5 Ton",
              required: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "set_capacity",
              label: "Seating Capacity",
              type: "number",
              placeholder: "e.g., 4",
              required: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "bus_type",
              label: "Deck Type",
              type: "text",
              placeholder: "single_deck or double_deck",
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "sdate",
              label: "Policy Start Date",
              type: "date",
              colSpan: "col-span-12 md:col-span-6",
              required: true,
            },
            {
              name: "edate",
              label: "Policy Expiry Date",
              type: "date",
              colSpan: "col-span-12 md:col-span-6",
              required: true,
            },

          ],
        },
      ],
    },
    {
      id: "coverage",
      label: "Personnel & Risk Coverages",
      icon: "Shield",
      sections: [
        {
          id: "personnel_details",
          title: "Personnel Quantities & Tariff Rates",
          class: "col-span-12 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl mb-6 shadow-sm",
          fields: [
            {
              name: "driver_qty",
              label: "Driver Quantity",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "driver_rate",
              label: "Driver Rate (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "passenger_qty",
              label: "Passenger Quantity",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "passenger_rate",
              label: "Passenger Rate (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "helper_qty",
              label: "Helper Quantity",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "helper_rate",
              label: "Helper Rate (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "conductor_qty",
              label: "Conductor Quantity",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "conductor_rate",
              label: "Conductor Rate (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "supervisor_qty",
              label: "Supervisor Quantity",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-2",
            },
            {
              name: "supervisor_rate",
              label: "Supervisor Rate (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-2",
            },
          ],
        },
        {
          id: "deductable_risk",
          title: "Special Perils & Deductibles",
          class: "col-span-12 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl mb-6 shadow-sm",
          fields: [
            {
              name: "has_tracker",
              label: "Vehicle Has VTS / Tracker Device (20% OD Discount)",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-12",
            },
            {
              name: "cycloned",
              label: "Flood & Cyclone",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "cyclone",
              label: "Cyclone Rate (%)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "riot",
              label: "Riot & Strike",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "riot_rate",
              label: "Riot Rate (%)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "earthd",
              label: "Earthquake",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "earthcue",
              label: "Earthquake Rate (%)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
          ],
        },
      ],
    },
    {
      id: "pricing",
      label: "Premium & Financial Summary",
      icon: "Calculator",
      sections: [
        {
          id: "premium_calculator",
          title: "Premium Details",
          class: "col-span-12",
          fields: [
            {
              name: "insamt",
              label: "Insured Amount (Sum Insured)",
              type: "number",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
              required: true,
            },
            {
              name: "own_dp_basic",
              label: "Own Damage Basic (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "full_ins_value",
              label: "Full Insured Rate (%)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "act_liability",
              label: "Act Liability Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "premium",
              label: "Net Premium (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "vat",
              label: "VAT Amount (15%)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "total",
              label: "Gross Premium (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
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
          documentableType: "PremBill",
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
          id: "narration_group",
          title: "Final Confirmation",
          class: "col-span-12",
          fields: [

            // {
            //   name: "narration",
            //   label: "Narration / Special Conditions",
            //   type: "textarea",
            //   placeholder: "Enter additional notes or special terms...",
            //   colSpan: "col-span-12",
            //   // className: "h-32",
            // },
            {
              name: "status",
              label: "Underwriting Status",
              type: "select",
              options: [
                { value: "Pending Underwriting", label: "Pending Underwriting" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ],
              defaultValue: "Pending Underwriting",
              colSpan: "col-span-12 md:col-span-6",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};

export const formFieldsConfig = motorUnderwritingLayoutConfig.tabs[0].sections[0].fields;
