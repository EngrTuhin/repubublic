"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetMotorUnderwritingQuery,
  useCreateMotorUnderwritingMutation,
  useUpdateMotorUnderwritingMutation,
} from "./motorVehicleApi";

import { calculateMotorPremium } from "./calculations/motorCalculations";
import { fetchTariffRates } from "./config/fields";

export function useMotorUnderwriting(id) {
  const router = useRouter();
  const isEditMode = !!id;

  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Always reset activeTab to the first tab (general) when opening/loading form
  useEffect(() => {
    setActiveTab("general");
  }, [id]);

  const formMethods = useForm({
    defaultValues: {
      bill_no: "",
      bill_date: "",
      principalBranch: "Principal Branch",
      operator: "csoft",
      motor_cer_type: "Private Vehicle",
      cert_type: "Comprehensive",
      coverage_type: "Comprehensive",
      clientcode: "",
      user_id: "",
      cl_name: "",
      cl_add: "",
      motor_class_sub_type_id: "",
      class_sub_type: "",
      motor_vehicle_usage_id: "1",
      vehicle_usage: "Private Use",
      reg_mark: "",
      previous_insurance_no: "",
      engno: "",
      chessisno: "",
      make: "",
      model: "",
      year: "",
      power: "",
      set_capacity: "",
      bus_type: "",
      sdate: "",
      edate: "",
      driver_qty: "1",
      driver_rate: "",
      passenger_qty: "0",
      passenger_rate: "",
      helper_qty: "0",
      helper_rate: "",
      conductor_qty: "0",
      conductor_rate: "",
      supervisor_qty: "0",
      supervisor_rate: "",
      has_tracker: false,
      has_technometer: false,
      cycloned: true,
      riot: true,
      earthd: true,
      has_tax_exemption: false,
      tax_exemption_doc: null,
      ncb_1st_year: false,
      ncb_2nd_year: false,
      ncb_3rd_year: false,
      claim_loading_1st_time: false,
      claim_loading_2nd_time: false,
      claim_loading_3rd_time: false,
      insamt: "",
      own_dp_basic: "",
      full_ins_value: "",
      act_liability: "",
      totprem: "",
      premium: "",
      vat: "",
      total: "",
      status: "Pending Underwriting",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = formMethods;

  // Reactive calculation watcher for web admin edit form
  const watchedValues = watch([
    "insamt",
    "own_dp_basic",
    "full_ins_value",
    "act_liability",
    "cycloned",
    "riot",
    "earthd",
    "has_tracker",
    "has_technometer",
    "has_tax_exemption",
    "hasPreviousInsurance",
    "previous_insurance_no",
    "ncb_1st_year",
    "ncb_2nd_year",
    "ncb_3rd_year",
    "claim_loading_1st_time",
    "claim_loading_2nd_time",
    "claim_loading_3rd_time",
    "driver_rate",
    "passenger_rate",
    "helper_rate",
    "conductor_rate",
    "supervisor_rate",
    "driver_qty",
    "passenger_qty",
    "helper_qty",
    "conductor_qty",
    "supervisor_qty",
    "motor_vehicle_usage_id",
    "motor_cer_type",
    "cert_type",
    "coverage_type",
  ]);

  useEffect(() => {
    calculateMotorPremium(setValue, getValues);
  }, [watchedValues]);

  // Fetch existing record if in edit mode
  const { data: existingData, isLoading: isFetching, error: fetchError } = useGetMotorUnderwritingQuery(id, {
    skip: !id,
  });

  const [createMotorUnderwriting, { isLoading: isCreating }] = useCreateMotorUnderwritingMutation();
  const [updateMotorUnderwriting, { isLoading: isUpdating }] = useUpdateMotorUnderwritingMutation();

  // Reset form values once edit data is fetched
  useEffect(() => {
    if (existingData) {
      const record = existingData.data || existingData;
      const rawCov = record.coverage_type || record.cert_type || record.ttgroup;
      const covArray = Array.isArray(rawCov)
        ? rawCov
        : (rawCov ? [rawCov] : ["Comprehensive"]);

      const hasPrev = Boolean(
        record.hasPreviousInsurance ||
        record.has_previous_insurance ||
        (record.previous_insurance_no && String(record.previous_insurance_no).trim().length > 0) ||
        (record.prev_policy_no && String(record.prev_policy_no).trim().length > 0) ||
        (record.prev_policy_number && String(record.prev_policy_number).trim().length > 0)
      );

      // Format bill_no to 7-digit zero-padded sequence (e.g. RIPLC/KAK/MV/0000010)
      let formattedBillNo = record.bill_no || "";
      if (formattedBillNo) {
        let prefix = "RIPLC/KAK/MV/";
        let seq = "";
        const lastSlash = String(formattedBillNo).lastIndexOf("/");
        if (lastSlash !== -1) {
          prefix = String(formattedBillNo).substring(0, lastSlash + 1);
          seq = String(formattedBillNo).substring(lastSlash + 1);
        } else {
          const match = String(formattedBillNo).match(/\d+$/);
          seq = match ? match[0] : "";
        }
        if (seq) {
          seq = String(seq).padStart(7, "0");
          formattedBillNo = `${prefix}${seq}`;
        }
      }

      reset({
        ...record,
        bill_no: formattedBillNo,
        hasPreviousInsurance: hasPrev,
        previous_insurance_no: record.previous_insurance_no || record.prev_policy_no || record.prev_policy_number || "",
        status: record.status || "Pending Underwriting",
        coverage_type: covArray,
        cert_type: record.cert_type || covArray[0] || "Comprehensive",
        motor_vehicle_usage_id: record.motor_vehicle_usage_id || record.vehicle_usage || "1",
        vehicle_usage: record.vehicle_usage || record.motor_vehicle_usage_id || "Private Use",
        cycloned: record.cycloned !== undefined && record.cycloned !== null ? !!record.cycloned : true,
        riot: record.riot !== undefined && record.riot !== null ? !!record.riot : true,
        earthd: record.earthd !== undefined && record.earthd !== null ? !!record.earthd : true,
        has_tracker: !!record.has_tracker,
        has_technometer: !!record.has_technometer,
        has_tax_exemption: !!record.has_tax_exemption,
        ncb_1st_year: !!record.ncb_1st_year,
        ncb_2nd_year: !!record.ncb_2nd_year,
        ncb_3rd_year: !!record.ncb_3rd_year,
        claim_loading_1st_time: !!record.claim_loading_1st_time,
        claim_loading_2nd_time: !!record.claim_loading_2nd_time,
        claim_loading_3rd_time: !!record.claim_loading_3rd_time,
        coins: !!record.coins,
        otherleader: !!record.otherleader,
        pw_edit: !!record.pw_edit,
        rcode: !!record.rcode,
        avts: !!record.avts,
        extra1: !!record.extra1,
        // Standard peril & tariff rates with fallbacks
        accidental_external_means_rate: record.accidental_external_means_rate || "1.15",
        fire_rate: record.fire_rate || "0.25",
        theft_rate: record.theft_rate || "0.25",
        flood_cyclone_rate: record.flood_cyclone_rate || record.cyclone || "0.25",
        riot_strike_rate: record.riot_strike_rate || record.riot_rate || "0.50",
        earthquake_rate: record.earthquake_rate || record.earthcue || "0.25",
        ncb_1st_year_rate: record.ncb_1st_year_rate || "30",
        ncb_2nd_year_rate: record.ncb_2nd_year_rate || "40",
        ncb_3rd_year_rate: record.ncb_3rd_year_rate || "50",
        claim_loading_1st_time_rate: record.claim_loading_1st_time_rate || "30",
        claim_loading_2nd_time_rate: record.claim_loading_2nd_time_rate || "40",
        claim_loading_3rd_time_rate: record.claim_loading_3rd_time_rate || "50",
        techno_meter_discount: record.techno_meter_discount_rate || "10",
        tracking_device_discount: record.tracking_device_discount_rate || "10",
        vat_exemption_rate: record.vat_exemption_rate || "25",
      });
      fetchTariffRates(setValue, getValues, 0);
      setTimeout(() => calculateMotorPremium(setValue, getValues), 150);
    }
  }, [existingData, reset, setValue, getValues]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSaveSuccess(false);
    try {
      console.log("Submitting motor underwriting admin form:", data);
      let resObj;
      if (isEditMode) {
        resObj = await updateMotorUnderwriting({ id, data }).unwrap();
      } else {
        resObj = await createMotorUnderwriting(data).unwrap();
      }

      const policyRecord = resObj?.data ?? resObj;
      if (policyRecord && policyRecord.id) {
        const apiBase = (process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");
        const token = typeof window !== "undefined" ? (localStorage.getItem("auth_token") || localStorage.getItem("token") || sessionStorage.getItem("token") || "") : "";

        const docFields = ["registration_doc", "tax_exemption_doc"];
        for (const docKey of docFields) {
          const fileVal = data[docKey];
          let fileObj = null;

          if (typeof File !== "undefined" && fileVal instanceof File) {
            fileObj = fileVal;
          } else if (typeof FileList !== "undefined" && fileVal instanceof FileList && fileVal.length > 0) {
            fileObj = fileVal[0];
          } else if (fileVal && typeof fileVal === "object" && fileVal.file) {
            fileObj = fileVal.file;
          }

          if (fileObj) {
            const formData = new FormData();
            formData.append("documentable_type", "PremBill");
            formData.append("documentable_id", String(policyRecord.id));
            formData.append("title", docKey);
            formData.append("file", fileObj);

            const headers = { Accept: "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            try {
              const uploadRes = await fetch(`${apiBase}/v1/documents`, {
                method: "POST",
                headers,
                body: formData,
              });
              console.log(`[Web Document Upload] ${docKey}:`, await uploadRes.json());
            } catch (err) {
              console.warn(`[Web Document Upload Error] ${docKey}:`, err);
            }
          }
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/underwriting/motor-vehicle");
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.data?.message || err?.message || "Failed to save motor underwriting.");
    }
  };

  return {
    isEditMode,
    activeTab,
    setActiveTab,
    saveSuccess,
    errorMessage,
    isLoading: isFetching || isCreating || isUpdating,
    isLoadingData: isFetching,
    loadError: fetchError,
    underwritingData: existingData?.data || existingData,
    isSaving: isCreating || isUpdating,
    ...formMethods,
    errors: formMethods.formState.errors,
    onSubmit,
    handleSearchBill: () => { },
    getOptionsForField: (field) => field.options,
    fetchTariffRates: () => fetchTariffRates(setValue, getValues),
  };
}
