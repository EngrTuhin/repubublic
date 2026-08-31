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
      bill_no: "00022",
      bill_date: "",
      principalBranch: "Principal Branch",
      operator: "csoft",
      motor_cer_type: "",
      searchBillNo: "",
      searchCertNo: "",
      clientcode: "",
      cl_add: "",
      bankcode: "",
      bank_br_code: "",
      bank_add: "",
      cert_type: "",
      class_sub_type: "",
      reg_mark: "",
      previous_insurance_no: "",
      engno: "",
      chessisno: "",
      make: "",
      model: "",
      year: "",
      power: "",
      sdate: "",
      edate: "",
      periodof: "12",
      pday: "365",
      producerNo: "",
      producerName: "",
      ren_cert_no: "",
      limitation: "",
      coins: false,
      otherleader: false,
      lead_per: "",
      leadcompany: "",
      lead_docno: "",
      pw_edit: false,
      rcode: false,
      ttgroup: "",
      fname: "",
      tname: "",
      capacity: "",
      premium_type: "general",
      insamt: "",
      basic: "",
      rate: "",
      odpamt: "",
      less_excl: "",
      avts: false,
      avtsamt: "",
      short_per: "",
      totprem: "",
      premiumPercent: "100",
      loadtextper: "",
      actl: "",
      passenger: "",
      pamt: "",
      pas_amt: "",
      driver: "driver_paid",
      driver_amt: "",
      ncb: "",
      noclaim_actl: "",
      ncbamt: "",
      loadper: "",
      addload_actl: "",
      loadamt: "",
      ex_load_amt: "",
      extra1: false,
      extra1_amt: "",
      discount: "",
      disamt: "",
      theftamt: "",
      premium: "",
      addVat: true,
      vat: "",
      total: "",
      cyclonebm_rate: "0.25",
      cycloneamt: "",
      cycloned: false,
      riot_rate: "0.50",
      riot_amt: "",
      riot: false,
      earth_rate: "0.25",
      earthamt: "",
      earthd: false,
      narration: "",
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
    "cyclone",
    "earthcue",
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
    "driver",
    "passenger",
    "addVat",
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
      const vatVal = parseFloat(record.vat);
      const hasVat = !isNaN(vatVal) && vatVal > 0;
      const rawCov = record.coverage_type || record.cert_type || record.ttgroup;
      const covArray = Array.isArray(rawCov)
        ? rawCov
        : (rawCov ? [rawCov] : ["Comprehensive Insurance"]);

      reset({
        ...record,
        status: record.status || "Pending Underwriting",
        coverage_type: covArray,
        cert_type: record.cert_type || covArray[0],
        vehicle_usage: record.vehicle_usage || record.usage || "private_use",
        addVat: hasVat ? true : (record.addVat !== undefined ? !!record.addVat : false),
        cycloned: !!record.cycloned,
        riot: !!record.riot,
        earthd: !!record.earthd,
        coins: !!record.coins,
        otherleader: !!record.otherleader,
        pw_edit: !!record.pw_edit,
        rcode: !!record.rcode,
        avts: !!record.avts,
        extra1: !!record.extra1,
      });
      setTimeout(() => calculateMotorPremium(setValue, getValues), 100);
    }
  }, [existingData, reset]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSaveSuccess(false);
    try {
      console.log("Submitting underwriting:", data);
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
    errors: formMethods.formState.errors, // Kept for backwards compatibility if needed, or FormBuilder can use formMethods.formState.errors
    onSubmit,
    handleSearchBill: () => { },
    getOptionsForField: (field) => field.options,
  };
}
