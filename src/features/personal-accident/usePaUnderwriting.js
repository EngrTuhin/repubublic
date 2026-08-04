"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetPaInsuranceQuery,
  useUpdatePaInsuranceMutation,
} from "./paApi";

const PA_DEFAULTS = {
  risk_class: "",
  table_type: "",
  sdate: "",
  edate: "",
  insamt: "500000",
  totprem: "",
  vat: "",
  total: "",
};

export function usePaUnderwriting(id) {
  const router = useRouter();
  const isEditMode = !!id;

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("coverage");

  const formMethods = useForm({ defaultValues: PA_DEFAULTS });
  const { reset, formState: { errors } } = formMethods;

  const { data: existingData, isLoading: isLoadingData, error: loadError } =
    useGetPaInsuranceQuery(id, { skip: !id });

  const [updatePaInsurance, { isLoading: isUpdating }] = useUpdatePaInsuranceMutation();

  // Populate form when data loads
  useEffect(() => {
    if (existingData) {
      const record = existingData.data || existingData;
      reset({ ...PA_DEFAULTS, ...record });
    }
  }, [existingData, reset]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSaveSuccess(false);
    try {
      await updatePaInsurance({ id, data }).unwrap();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/underwriting/personal-accident");
      }, 1500);
    } catch (err) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to save PA proposal.");
    }
  };

  return {
    isEditMode,
    saveSuccess,
    errorMessage,
    activeTab,
    setActiveTab,
    isLoading: isLoadingData || isUpdating,
    isLoadingData,
    loadError,
    underwritingData: existingData?.data || existingData,
    isSaving: isUpdating,
    ...formMethods,
    errors,
    onSubmit,
    getOptionsForField: (field) => field.options || [],
  };
}
