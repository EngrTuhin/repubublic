"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetOmpPolicyTypesQuery,
  useGetOmpPlanOptionsQuery,
  useGetOmpCountryOptionsQuery,
  useGetOmpInsuranceQuery,
  useUpdateOmpInsuranceMutation,
} from "./ompApi";

const OMP_DEFAULTS = {
  bill_no: "",
  status: "Pending Underwriting",
  mr_status: "",
  insured_name: "",
  dob: "",
  age: "",
  passport_no: "",
  passport_issue_date: "",
  passport_expiry_date: "",
  policy_type: "",
  country_of_visit: "",
  plan_type: "",
  sdate: "",
  edate: "",
  duration_days: "",
  insamt: "",
  include_dental: false,
  totprem: "",
  additional_loading: "",
  vat: "",
  total: "",
};

export function useOmpUnderwriting(id) {
  const router = useRouter();
  const isEditMode = !!id;

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("coverage");

  const formMethods = useForm({ defaultValues: OMP_DEFAULTS });
  const { reset, formState: { errors } } = formMethods;

  const { data: existingData, isLoading: isLoadingData, error: loadError } =
    useGetOmpInsuranceQuery(id, { skip: !id });
  const { data: policyTypesRes } = useGetOmpPolicyTypesQuery();
  const { data: planOptionsRes } = useGetOmpPlanOptionsQuery();
  const { data: countryOptionsRes } = useGetOmpCountryOptionsQuery();

  const [updateOmpInsurance, { isLoading: isUpdating }] = useUpdateOmpInsuranceMutation();

  const policyTypes = policyTypesRes?.data?.data ?? policyTypesRes?.data ?? [];
  const planOptions = planOptionsRes?.data?.data ?? planOptionsRes?.data ?? [];
  const countryOptions = countryOptionsRes?.data?.data ?? countryOptionsRes?.data ?? [];

  // Populate form when data loads
  useEffect(() => {
    if (existingData) {
      const record = existingData.data || existingData;
      reset({ ...OMP_DEFAULTS, ...record, include_dental: !!record.include_dental });
    }
  }, [existingData, reset]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSaveSuccess(false);
    try {
      await updateOmpInsurance({ id, data }).unwrap();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/underwriting/omp");
      }, 1500);
    } catch (err) {
      setErrorMessage(err?.data?.message || err?.message || "Failed to save OMP proposal.");
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
    getOptionsForField: (field) => {
      if (field.name === "policy_type") return policyTypes;
      if (field.name === "plan_type") return planOptions;
      if (field.name === "country_of_visit") return countryOptions;
      return field.options || [];
    },
  };
}
