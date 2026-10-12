import {
  triggerCalc,
  calculateMotorPremium,
  isCommercialVehicle,
} from "../calculations/motorCalculations";

let tariffDebounceTimer = null;

export const fetchTariffRates = async (setValue, getValues, delayMs = 250) => {
  if (tariffDebounceTimer) clearTimeout(tariffDebounceTimer);

  tariffDebounceTimer = setTimeout(async () => {
    if (typeof getValues !== "function" || typeof setValue !== "function") return;

    const class_sub_type = getValues("motor_class_sub_type_id") || getValues("class_sub_type") || "";
    const motor_vehicle_usage_id = getValues("motor_vehicle_usage_id") || getValues("vehicle_usage") || "";
    const coverage_type = getValues("coverage_type") || getValues("cert_type") || "";
    const power = getValues("power") || "";
    const set_capacity = getValues("set_capacity") || "";
    const bus_type = getValues("bus_type") || "";
    const driver_qty = getValues("driver_qty") || "";
    const passenger_qty = getValues("passenger_qty") || "";
    const helper_qty = getValues("helper_qty") || "";
    const conductor_qty = getValues("conductor_qty") || "";
    const supervisor_qty = getValues("supervisor_qty") || "";

    const apiBase = (process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");
    const token = typeof window !== "undefined" ? (localStorage.getItem("auth_token") || localStorage.getItem("token") || sessionStorage.getItem("token") || "") : "";

    const params = new URLSearchParams({
      motor_class_sub_type_id: String(class_sub_type),
      motor_vehicle_usage_id: String(motor_vehicle_usage_id),
      class_sub_type: String(class_sub_type),
      vehicle_usage: String(motor_vehicle_usage_id),
      coverage_type: String(coverage_type),
      power: String(power),
      set_capacity: String(set_capacity),
      bus_type: String(bus_type),
      driver_qty: String(driver_qty),
      passenger_qty: String(passenger_qty),
      helper_qty: String(helper_qty),
      conductor_qty: String(conductor_qty),
      supervisor_qty: String(supervisor_qty),
    });

    try {
      const res = await fetch(`${apiBase}/v1/uw-tarrifs/check-vehicle-type?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data;
        if (data) {
          if (data.own_dp_basic !== undefined) setValue("own_dp_basic", String(data.own_dp_basic));
          if (data.act_liability !== undefined) setValue("act_liability", String(data.act_liability));
          if (data.passenger_rate !== undefined) setValue("passenger_rate", String(data.passenger_rate));
          if (data.driver_rate !== undefined) setValue("driver_rate", String(data.driver_rate));
          if (data.helper_rate !== undefined) setValue("helper_rate", String(data.helper_rate));
          if (data.conductor_rate !== undefined) setValue("conductor_rate", String(data.conductor_rate));
          if (data.supervisor_rate !== undefined) setValue("supervisor_rate", String(data.supervisor_rate));
          if (data.cyclone !== undefined) {
            setValue("flood_cyclone_rate", String(data.cyclone));
            setValue("cyclone", String(data.cyclone));
          }
          if (data.earthcue !== undefined) {
            setValue("earthquake_rate", String(data.earthcue));
            setValue("earthcue", String(data.earthcue));
          }
          if (data.fire !== undefined) setValue("fire_rate", String(data.fire));
          if (data.theft !== undefined) setValue("theft_rate", String(data.theft));

          if (data.motor_comprehensive_liability_configs) {
            const checkboxKeys = [
              "ncb_1st_year",
              "ncb_2nd_year",
              "ncb_3rd_year",
              "claim_loading_1st_time",
              "claim_loading_2nd_time",
              "claim_loading_3rd_time",
            ];
            Object.entries(data.motor_comprehensive_liability_configs).forEach(([key, val]) => {
              if (val !== undefined && val !== null) {
                if (checkboxKeys.includes(key)) {
                  setValue(`${key}_rate`, String(val));
                } else {
                  setValue(key, String(val));
                }
              }
            });
          }
          calculateMotorPremium(setValue, getValues);
        }
      }
    } catch (err) {
      console.warn("Error fetching tariff rates:", err);
    }
  }, delayMs);
};

export const isComprehensiveCoverage = (watch) => {
  const cov = typeof watch === "function" ? (watch("coverage_type") || watch("cert_type")) : (watch?.coverage_type || watch?.cert_type);
  const rawCov = Array.isArray(cov)
    ? cov.join(" ")
    : typeof cov === "object" && cov !== null
      ? cov?.value || cov?.label || ""
      : cov || "";
  const covStr = String(rawCov).toLowerCase();
  return !covStr.includes("liability") && (covStr.includes("comprehensive") || covStr === "");
};

export const isCommercialVehicleUsage = (watch) => {
  const usage = typeof watch === "function" ? (watch("motor_vehicle_usage_id") || watch("vehicle_usage")) : (watch?.motor_vehicle_usage_id || watch?.vehicle_usage);
  const cerType = typeof watch === "function" ? watch("motor_cer_type") : watch?.motor_cer_type;
  return isCommercialVehicle(usage, cerType);
};

export const isTaxExemptionVisible = (watch) => {
  return isComprehensiveCoverage(watch) && !isCommercialVehicleUsage(watch);
};

export const isNcb1stYearVisible = (watch) => {
  if (!isComprehensiveCoverage(watch)) return false;
  const ncb2 = typeof watch === "function" ? watch("ncb_2nd_year") : watch?.ncb_2nd_year;
  const ncb3 = typeof watch === "function" ? watch("ncb_3rd_year") : watch?.ncb_3rd_year;
  return !(ncb2 === true || ncb2 === "true" || ncb3 === true || ncb3 === "true");
};

export const isNcb2ndYearVisible = (watch) => {
  if (!isComprehensiveCoverage(watch)) return false;
  const ncb1 = typeof watch === "function" ? watch("ncb_1st_year") : watch?.ncb_1st_year;
  const ncb3 = typeof watch === "function" ? watch("ncb_3rd_year") : watch?.ncb_3rd_year;
  return !(ncb1 === true || ncb1 === "true" || ncb3 === true || ncb3 === "true");
};

export const isNcb3rdYearVisible = (watch) => {
  if (!isComprehensiveCoverage(watch)) return false;
  const ncb1 = typeof watch === "function" ? watch("ncb_1st_year") : watch?.ncb_1st_year;
  const ncb2 = typeof watch === "function" ? watch("ncb_2nd_year") : watch?.ncb_2nd_year;
  return !(ncb1 === true || ncb1 === "true" || ncb2 === true || ncb2 === "true");
};

export const isNcb1stYearChecked = (watch) => {
  const ncb1 = typeof watch === "function" ? watch("ncb_1st_year") : watch?.ncb_1st_year;
  const c1 = typeof watch === "function" ? watch("claim_loading_1st_time") : watch?.claim_loading_1st_time;
  const c2 = typeof watch === "function" ? watch("claim_loading_2nd_time") : watch?.claim_loading_2nd_time;
  const c3 = typeof watch === "function" ? watch("claim_loading_3rd_time") : watch?.claim_loading_3rd_time;
  return (
    ncb1 === true || ncb1 === "true" ||
    c1 === true || c1 === "true" ||
    c2 === true || c2 === "true" ||
    c3 === true || c3 === "true"
  );
};

export const isClaimLoading1stVisible = (watch) => {
  if (!isComprehensiveCoverage(watch)) return false;
  if (!isNcb1stYearChecked(watch)) return false;
  const c2 = typeof watch === "function" ? watch("claim_loading_2nd_time") : watch?.claim_loading_2nd_time;
  const c3 = typeof watch === "function" ? watch("claim_loading_3rd_time") : watch?.claim_loading_3rd_time;
  return !(c2 === true || c2 === "true" || c3 === true || c3 === "true");
};

export const isClaimLoading2ndVisible = (watch) => {
  if (!isComprehensiveCoverage(watch)) return false;
  if (!isNcb1stYearChecked(watch)) return false;
  const c1 = typeof watch === "function" ? watch("claim_loading_1st_time") : watch?.claim_loading_1st_time;
  const c3 = typeof watch === "function" ? watch("claim_loading_3rd_time") : watch?.claim_loading_3rd_time;
  return !(c1 === true || c1 === "true" || c3 === true || c3 === "true");
};

export const isClaimLoading3rdVisible = (watch) => {
  if (!isComprehensiveCoverage(watch)) return false;
  if (!isNcb1stYearChecked(watch)) return false;
  const c1 = typeof watch === "function" ? watch("claim_loading_1st_time") : watch?.claim_loading_1st_time;
  const c2 = typeof watch === "function" ? watch("claim_loading_2nd_time") : watch?.claim_loading_2nd_time;
  return !(c1 === true || c1 === "true" || c2 === true || c2 === "true");
};

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
              name: "cert_type",
              label: "Coverage Type",
              type: "select",
              endpoint: "/v1/uw-certificate-types",
              mappingTemplate: "certificateTypeSearchTemplate",
              isSearchable: true,
              colSpan: "col-span-12 md:col-span-4",
              required: true,
              onChange: (opt, setValue, getValues) => {
                fetchTariffRates(setValue, getValues);
              },
            },
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
              name: "bill_no",
              label: "Bill No",
              type: "text",
              placeholder: "RIPLC/KAK/MV/0000010",
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
                fetchTariffRates(setValue, getValues);
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
                const optVal = opt?.value ?? opt?.id ?? opt;
                const optStr = String(opt?.label ?? opt?.name ?? optVal ?? "").toLowerCase();
                if (optVal === 2 || optVal === "2" || optStr.includes("commercial")) {
                  if (setValue) {
                    setValue("has_tax_exemption", false);
                    setValue("tax_exemption_doc", null);
                  }
                }
                fetchTariffRates(setValue, getValues);
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
              onChange: triggerCalc,
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
              type: "text",
              placeholder: "e.g., 1500 CC or 1.5 Ton",
              required: true,
              colSpan: "col-span-12 md:col-span-4",
              onChange: (val, setValue, getValues) => fetchTariffRates(setValue, getValues),
            },
            {
              name: "set_capacity",
              label: "Seating Capacity",
              type: "number",
              placeholder: "e.g., 4",
              required: true,
              colSpan: "col-span-12 md:col-span-4",
              onChange: (val, setValue, getValues) => fetchTariffRates(setValue, getValues),
            },
            // {
            //   name: "bus_type",
            //   label: "Deck Type",
            //   type: "text",
            //   placeholder: "single_deck or double_deck",
            //   colSpan: "col-span-12 md:col-span-4",
            //   onChange: (val, setValue, getValues) => fetchTariffRates(setValue, getValues),
            // },
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
              onChange: (val, setValue, getValues) => {
                fetchTariffRates(setValue, getValues);
              },
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
              onChange: (val, setValue, getValues) => {
                fetchTariffRates(setValue, getValues);
              },
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
              onChange: (val, setValue, getValues) => {
                fetchTariffRates(setValue, getValues);
              },
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
              onChange: (val, setValue, getValues) => {
                fetchTariffRates(setValue, getValues);
              },
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
              onChange: (val, setValue, getValues) => {
                fetchTariffRates(setValue, getValues);
              },
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
          title: "Special Perils & Discounts",
          class: "col-span-12 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl mb-6 shadow-sm",
          fields: [
            {
              name: "has_tracker",
              label: "Tracking Device Installed? (10% OD Discount)",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "has_technometer",
              label: "Techo Meter Installed? (10% OD Discount)",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "cycloned",
              label: "Keep Flood & Cyclone coverage?",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "riot",
              label: "Keep Riot & Strike coverage?",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "earthd",
              label: "Keep Earthquake coverage?",
              type: "checkbox",
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "has_tax_exemption",
              label: "Does vehicle have VAT Exemption Certificate?",
              type: "checkbox",
              visibility: isTaxExemptionVisible,
              onChange: triggerCalc,
              colSpan: "col-span-12 md:col-span-6",
            },
          ],
        },
        {
          id: "ncb_and_claims",
          title: "No Claim Bonus (NCB) & Claim Loading",
          class: "col-span-12 bg-slate-50/50 p-6 border border-slate-200 rounded-3xl mb-6 shadow-sm",
          visibility: isComprehensiveCoverage,
          fields: [
            {
              name: "ncb_1st_year",
              label: "No Claim Bonus (NCB) 1st Year?",
              type: "checkbox",
              visibility: isNcb1stYearVisible,
              colSpan: "col-span-12 md:col-span-4",
              onChange: (e, setValue, getValues) => {
                const checked = e?.target?.checked ?? !!e;
                if (checked && setValue) {
                  setValue("ncb_2nd_year", false);
                  setValue("ncb_3rd_year", false);
                } else if (!checked && setValue) {
                  setValue("claim_loading_1st_time", false);
                  setValue("claim_loading_2nd_time", false);
                  setValue("claim_loading_3rd_time", false);
                }
                triggerCalc(checked, setValue, getValues);
              },
            },
            {
              name: "ncb_2nd_year",
              label: "No Claim Bonus (NCB) 2nd Year?",
              type: "checkbox",
              visibility: isNcb2ndYearVisible,
              colSpan: "col-span-12 md:col-span-4",
              onChange: (e, setValue, getValues) => {
                const checked = e?.target?.checked ?? !!e;
                if (checked && setValue) {
                  setValue("ncb_1st_year", false);
                  setValue("ncb_3rd_year", false);
                  setValue("claim_loading_1st_time", false);
                  setValue("claim_loading_2nd_time", false);
                  setValue("claim_loading_3rd_time", false);
                }
                triggerCalc(checked, setValue, getValues);
              },
            },
            {
              name: "ncb_3rd_year",
              label: "No Claim Bonus (NCB) 3rd Year?",
              type: "checkbox",
              visibility: isNcb3rdYearVisible,
              colSpan: "col-span-12 md:col-span-4",
              onChange: (e, setValue, getValues) => {
                const checked = e?.target?.checked ?? !!e;
                if (checked && setValue) {
                  setValue("ncb_1st_year", false);
                  setValue("ncb_2nd_year", false);
                  setValue("claim_loading_1st_time", false);
                  setValue("claim_loading_2nd_time", false);
                  setValue("claim_loading_3rd_time", false);
                }
                triggerCalc(checked, setValue, getValues);
              },
            },
            {
              name: "claim_loading_1st_time",
              label: "Claim Loading (1st Time)",
              type: "checkbox",
              visibility: isClaimLoading1stVisible,
              colSpan: "col-span-12 md:col-span-4",
              onChange: (e, setValue, getValues) => {
                const checked = e?.target?.checked ?? !!e;
                if (checked && setValue) {
                  setValue("ncb_1st_year", true);
                  setValue("ncb_2nd_year", false);
                  setValue("ncb_3rd_year", false);
                  setValue("claim_loading_2nd_time", false);
                  setValue("claim_loading_3rd_time", false);
                }
                triggerCalc(checked, setValue, getValues);
              },
            },
            {
              name: "claim_loading_2nd_time",
              label: "Claim Loading (2nd Time)",
              type: "checkbox",
              visibility: isClaimLoading2ndVisible,
              colSpan: "col-span-12 md:col-span-4",
              onChange: (e, setValue, getValues) => {
                const checked = e?.target?.checked ?? !!e;
                if (checked && setValue) {
                  setValue("ncb_1st_year", true);
                  setValue("ncb_2nd_year", false);
                  setValue("ncb_3rd_year", false);
                  setValue("claim_loading_1st_time", false);
                  setValue("claim_loading_3rd_time", false);
                }
                triggerCalc(checked, setValue, getValues);
              },
            },
            {
              name: "claim_loading_3rd_time",
              label: "Claim Loading (3rd Time)",
              type: "checkbox",
              visibility: isClaimLoading3rdVisible,
              colSpan: "col-span-12 md:col-span-4",
              onChange: (e, setValue, getValues) => {
                const checked = e?.target?.checked ?? !!e;
                if (checked && setValue) {
                  setValue("ncb_1st_year", true);
                  setValue("ncb_2nd_year", false);
                  setValue("ncb_3rd_year", false);
                  setValue("claim_loading_1st_time", false);
                  setValue("claim_loading_2nd_time", false);
                }
                triggerCalc(checked, setValue, getValues);
              },
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
          title: "Premium Details & Breakdown",
          class: "col-span-12",
          fields: [
            {
              name: "insamt",
              label: "Insured Amount (Vehicle Value Tk.)",
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
              name: "act_liability",
              label: "Act Liability Amount (Tk.)",
              type: "number",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-6",
            },
            {
              name: "totprem",
              label: "Annual Net Premium (Tk.)",
              type: "text",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "vat",
              label: "VAT Amount (15% Tk.)",
              type: "text",
              readOnly: true,
              colSpan: "col-span-12 md:col-span-4",
            },
            {
              name: "total",
              label: "Gross Total Premium (Tk.)",
              type: "text",
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
          title: "Final Confirmation & Underwriting Status",
          class: "col-span-12",
          fields: [
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
