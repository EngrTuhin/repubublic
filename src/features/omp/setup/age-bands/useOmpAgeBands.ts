"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetOmpAgeBandsQuery,
  useCreateOmpAgeBandMutation,
  useUpdateOmpAgeBandMutation,
  useDeleteOmpAgeBandMutation,
} from "./ageBandApi";
import { OmpAgeBand, defaultAgeBandForm } from "./config/formConfig";

export function useOmpAgeBands() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBand, setEditingBand] = useState<OmpAgeBand | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize react-hook-form instance
  const form = useForm<OmpAgeBand>({
    defaultValues: defaultAgeBandForm,
  });

  const { reset, setValue, handleSubmit: hookFormSubmit } = form;

  // RTK Query calls to Backend Database API
  const { data: apiResponse, isLoading, isFetching, isError, refetch } = useGetOmpAgeBandsQuery({});



  const openCreateModal = () => {
    const rawData = apiResponse?.data?.data ?? apiResponse?.data;
    const currentCount = Array.isArray(rawData) ? rawData.length : 0;
    setEditingBand(null);
    reset({
      ...defaultAgeBandForm,
      sort_order: currentCount + 1,
    });
    setIsModalOpen(true);
    setErrorMessage(null);
  };



  return {
    form,
    apiResponse,
    refetch,
    loading: isLoading || isFetching,
    isError,
    isModalOpen,
    editingItem: editingBand,
    successMessage,
    errorMessage,
    openCreateModal,

  };
}
