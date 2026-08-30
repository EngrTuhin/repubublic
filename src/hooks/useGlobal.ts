"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  useGetGlobalListQuery,
  useCreateGlobalItemMutation,
  useUpdateGlobalItemMutation,
  useDeleteGlobalItemMutation,
} from "@/features/api/globalSetupApi";

export interface UseGlobalOptions {
  queryParams?: Record<string, any>;
  defaultValues?: Record<string, any>;
  initialPerPage?: number;
  transformSubmitData?: (data: any, isEditing: boolean) => any;
  transformEditData?: (item: any) => any;
  onSuccess?: (type: "create" | "update" | "delete", res?: any) => void;
  onError?: (type: "create" | "update" | "delete", err?: any) => void;
}

export function useGlobal(endpoint: string, options: UseGlobalOptions = {}) {
  const {
    queryParams,
    defaultValues = {},
    transformSubmitData,
    transformEditData,
    onSuccess,
    onError,
  } = options;

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // Combine queryParams with search & pagination for Laravel backend
  const combinedParams = useMemo(
    () => ({
      search: searchTerm || undefined,
      page,
      per_page: perPage,
      ...queryParams,
    }),
    [searchTerm, page, perPage, queryParams]
  );

  // React Hook Form
  const form = useForm({ defaultValues });
  const { register, handleSubmit: hookFormSubmit, reset, setValue } = form;

  // Modal & Notification State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clean endpoint string (remove leading slash if present)
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  // RTK Query call driven dynamically by `cleanEndpoint` and `combinedParams`
  const {
    data: apiResponse,
    isLoading: isQueryLoading,
    isFetching,
    refetch,
    error: queryError,
  } = useGetGlobalListQuery({ endpoint: cleanEndpoint, params: combinedParams });

  const [createItem, { isLoading: isCreating }] = useCreateGlobalItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateGlobalItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteGlobalItemMutation();

  const loading = isQueryLoading || isFetching || isCreating || isUpdating || isDeleting;

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setPage(1);
  };

  // Modal Handlers
  const openCreateModal = () => {
    setEditingItem(null);
    reset(defaultValues);
    setIsModalOpen(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (item: any) => {
    let formattedItem = item ? { ...item } : item;
    if (formattedItem && formattedItem.status !== undefined && formattedItem.status !== null) {
      if (typeof formattedItem.status === "boolean") {
        formattedItem.status = formattedItem.status ? 1 : 0;
      } else if (formattedItem.status === "true") {
        formattedItem.status = 1;
      } else if (formattedItem.status === "false") {
        formattedItem.status = 0;
      }
    }
    if (transformEditData) {
      formattedItem = transformEditData(formattedItem);
    }
    setEditingItem(formattedItem);
    reset(formattedItem);
    setIsModalOpen(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset(defaultValues);
  };

  // Form Submit Handler
  const onSubmit = async (data: any) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const sanitizedData = { ...data };
    Object.keys(sanitizedData).forEach((key) => {
      if (sanitizedData[key] === "true") sanitizedData[key] = true;
      if (sanitizedData[key] === "false") sanitizedData[key] = false;
    });

    const isEdit = Boolean(editingItem?.id);
    const payload = transformSubmitData ? transformSubmitData(sanitizedData, isEdit) : sanitizedData;

    try {
      if (isEdit) {
        const res = await updateItem({
          endpoint: cleanEndpoint,
          id: editingItem.id,
          data: payload,
        }).unwrap();
        setSuccessMessage(res?.message || "Record updated successfully!");
        if (onSuccess) onSuccess("update", res);
      } else {
        const res = await createItem({
          endpoint: cleanEndpoint,
          data: payload,
        }).unwrap();
        setSuccessMessage(res?.message || "Record created successfully!");
        if (onSuccess) onSuccess("create", res);
      }
      closeModal();
      refetch();
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || "An error occurred while saving record.";
      setErrorMessage(msg);
      if (onError) onError(isEdit ? "update" : "create", err);
    }
  };

  // Delete Action Handler
  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await deleteItem({ endpoint: cleanEndpoint, id }).unwrap();
      setSuccessMessage(res?.message || "Record deleted successfully!");
      if (onSuccess) onSuccess("delete", res);
      refetch();
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || "Failed to delete record.";
      setErrorMessage(msg);
      if (onError) onError("delete", err);
    }
  };

  return {
    // Query Data & Loading States
    apiResponse,
    loading,
    isFetching,
    refetch,
    queryError,

    // Search & Pagination State & Handlers
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    setPerPage,
    handleResetFilters,

    // Modal State & Controls
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,

    // Notifications
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,

    // Action Handlers
    handleDelete,
    handleSubmit: hookFormSubmit(onSubmit),

    // React Hook Form
    form,
    register,
    reset,
    setValue,
  };
}

export default useGlobal;
