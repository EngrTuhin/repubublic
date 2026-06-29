"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetMotorUnderwritingQuery,
  useCreateMotorUnderwritingMutation,
  useUpdateMotorUnderwritingMutation,
} from "./motorVehicleApi";

export function useMotorUnderwriting(id) {
  const router = useRouter();
  const isEditMode = !!id;

  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      cyclonebm_rate: "",
      cycloneamt: "",
      cycloned: false,
      riot_rate: "",
      riot_amt: "",
      riot: false,
      earth_rate: "",
      earthamt: "",
      earthd: false,
      narration: "",
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
      reset({
        ...record,
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
    }
  }, [existingData, reset]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSaveSuccess(false);
    try {
      console.log("Submitting underwriting:", data);
      if (isEditMode) {
        await updateMotorUnderwriting({ id, data }).unwrap();
      } else {
        await createMotorUnderwriting(data).unwrap();
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
    handleSearchBill: () => {},
    getOptionsForField: (field) => field.options,
  };
}
