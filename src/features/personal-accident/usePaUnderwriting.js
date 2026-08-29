"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetPaOccupationsQuery,
  useGetPaTableTypesQuery,
  useGetPaTariffsQuery,
  useGetPaInsuranceQuery,
  useUpdatePaInsuranceMutation,
} from "./paApi";

const PA_DEFAULTS = {
  bill_no: "",
  status: "Pending Underwriting",
  risk_class: "",
  table_type: "",
  sdate: "",
  edate: "",
  insamt: "500000",
  totprem: "",
  vat: "",
  total: "",
};

// Fallback rate per 10,000 BDT
const FALLBACK_RATES = {
  class_1: { table_a: 22.50, table_b: 15.00, table_c: 11.25 },
  class_2: { table_a: 30.00, table_b: 20.00, table_c: 15.00 },
  class_3: { table_a: 45.00, table_b: 30.00, table_c: 22.50 },
};

export function usePaUnderwriting(id) {
  const router = useRouter();
  const isEditMode = !!id;

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("coverage");

  const formMethods = useForm({ defaultValues: PA_DEFAULTS });
  const { reset, watch, setValue, formState: { errors } } = formMethods;

  const { data: existingData, isLoading: isLoadingData, error: loadError } =
    useGetPaInsuranceQuery(id, { skip: !id });

  const { data: occupationsRes } = useGetPaOccupationsQuery();
  const { data: tableTypesRes } = useGetPaTableTypesQuery();
  const { data: tariffsRes } = useGetPaTariffsQuery();

  const [updatePaInsurance, { isLoading: isUpdating }] = useUpdatePaInsuranceMutation();

  const occupations = occupationsRes?.data?.data ?? occupationsRes?.data ?? [];
  const tableTypes = tableTypesRes?.data?.data ?? tableTypesRes?.data ?? [];
  const tariffs = tariffsRes?.data?.data ?? tariffsRes?.data ?? [];

  // Populate form when data loads
  useEffect(() => {
    if (existingData) {
      const record = existingData.data || existingData;
      reset({ ...PA_DEFAULTS, ...record, status: record.status || "Pending Underwriting" });
    }
  }, [existingData, reset]);

  // Reactive calculation watcher
  const watchedInsamt = watch("insamt");
  const watchedRiskClass = watch("risk_class");
  const watchedTableType = watch("table_type");

  useEffect(() => {
    const sumInsured = Math.max(0, Number(watchedInsamt) || 0);
    if (!watchedRiskClass || !watchedTableType || sumInsured <= 0) return;

    let targetClass = watchedRiskClass;
    if (!watchedRiskClass.startsWith("class_") && occupations.length > 0) {
      const occ = occupations.find(
        (o) => o.value === watchedRiskClass || o.label === watchedRiskClass
      );
      targetClass = occ?.riskClass || occ?.risk_class || watchedRiskClass;
    }

    const tariff = tariffs.find(
      (t) =>
        (t.riskClass === targetClass || t.risk_class === targetClass) &&
        (t.tableType === watchedTableType || t.table_type === watchedTableType)
    );

    let ratePer10k = tariff?.rate ? Number(tariff.rate) : 0;
    if (ratePer10k <= 0 && FALLBACK_RATES[targetClass]?.[watchedTableType]) {
      ratePer10k = FALLBACK_RATES[targetClass][watchedTableType];
    }

    if (ratePer10k > 0) {
      const basePrem = (sumInsured / 10000) * ratePer10k;
      const vatVal = basePrem * 0.15;
      const totalVal = basePrem + vatVal;

      setValue("totprem", basePrem.toFixed(2));
      setValue("vat", vatVal.toFixed(2));
      setValue("total", totalVal.toFixed(2));
    }
  }, [watchedInsamt, watchedRiskClass, watchedTableType, occupations, tariffs, setValue]);

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
    getOptionsForField: (field) => {
      if (field.name === "risk_class") return occupations;
      if (field.name === "table_type") return tableTypes;
      return field.options || [];
    },
  };
}
