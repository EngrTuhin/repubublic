"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useGetClaimByIdQuery, useUpdateClaimMutation } from "./claimsApi";

export function useClaimEdit(id) {
  const router = useRouter();
  const isEditMode = !!id;

  const [activeTab, setActiveTab] = useState("claim_info");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formMethods = useForm({
    defaultValues: {
      claim_no: "",
      product_type: "motor",
      policy_no: "",
      insured_name: "",
      mobile: "",
      email: "",
      incident_date: "",
      incident_location: "",
      description: "",
      status: "Pending Review",
      estimated_amount: 0,
      approved_amount: 0,
      remarks: "",
    },
  });

  const {
    data: fetchedClaim,
    isLoading: isLoadingData,
    error: loadError,
  } = useGetClaimByIdQuery(id, { skip: !isEditMode });

  const [updateClaim, { isLoading: isUpdating }] = useUpdateClaimMutation();

  const claimData = fetchedClaim?.data || fetchedClaim;

  useEffect(() => {
    if (claimData) {
      formMethods.reset({
        claim_no: claimData.claim_no || "",
        product_type: claimData.product_type || "motor",
        policy_no: claimData.policy_no || claimData.bill_no || "",
        insured_name: claimData.insured_name || "",
        mobile: claimData.mobile || "",
        email: claimData.email || "",
        incident_date: claimData.incident_date || "",
        incident_location: claimData.incident_location || "",
        description: claimData.description || "",
        status: claimData.status || "Pending Review",
        estimated_amount: claimData.estimated_amount || 0,
        approved_amount: claimData.approved_amount || 0,
        remarks: claimData.remarks || "",
      });
    }
  }, [claimData, formMethods]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    try {
      if (isEditMode) {
        await updateClaim({ id, ...data }).unwrap();
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/claims");
      }, 1500);
    } catch (err) {
      console.error("API submission error:", err);
      setErrorMessage(
        err?.data?.message || err?.message || "Failed to update claim."
      );
    }
  };

  return {
    isEditMode,
    activeTab,
    setActiveTab,
    saveSuccess,
    errorMessage,
    isLoading: isLoadingData || isUpdating,
    isLoadingData,
    loadError,
    isSaving: isUpdating,
    underwritingData: claimData,
    id,
    ...formMethods,
    errors: formMethods.formState.errors,
    onSubmit: formMethods.handleSubmit(onSubmit),
    getOptionsForField: (field) => field.options || [],
  };
}
