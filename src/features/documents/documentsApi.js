import { baseApi } from "../api/baseApi";

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: (params) => ({
        url: "/v1/documents",
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const items = result?.data || result;
        return Array.isArray(items)
          ? [
              ...items.map(({ id }) => ({ type: "Document", id })),
              { type: "Document", id: "LIST" },
            ]
          : [{ type: "Document", id: "LIST" }];
      },
    }),
    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: "/v1/documents",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Document", id: "LIST" },
        { type: "MotorUnderwriting" },
        { type: "OmpUnderwriting" },
      ],
    }),
    approveDocument: builder.mutation({
      query: ({ id, remarks }) => ({
        url: `/v1/documents/${id}/approve`,
        method: "POST",
        body: { remarks },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Document", id: "LIST" },
        { type: "Document", id },
        { type: "MotorUnderwriting" },
        { type: "OmpUnderwriting" },
      ],
    }),
    rejectDocument: builder.mutation({
      query: ({ id, remarks }) => ({
        url: `/v1/documents/${id}/reject`,
        method: "POST",
        body: { remarks },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Document", id: "LIST" },
        { type: "Document", id },
        { type: "MotorUnderwriting" },
        { type: "OmpUnderwriting" },
      ],
    }),
    updateDocumentStatus: builder.mutation({
      query: ({ id, status, remarks }) => ({
        url: `/v1/documents/${id}`,
        method: "PUT",
        body: { status, remarks },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Document", id: "LIST" },
        { type: "Document", id },
        { type: "MotorUnderwriting" },
        { type: "OmpUnderwriting" },
      ],
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/v1/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Document", id: "LIST" }, { type: "MotorUnderwriting" }, { type: "OmpUnderwriting" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
  useUpdateDocumentStatusMutation,
  useDeleteDocumentMutation,
} = documentsApi;
