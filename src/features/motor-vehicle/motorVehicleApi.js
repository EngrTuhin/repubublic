import { baseApi } from "../api/baseApi";

export const motorVehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMotorUnderwritings: builder.query({
      query: (params) => ({
        url: "/v1/motorinsurances",
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const items = result?.data || result;
        return Array.isArray(items)
          ? [
              ...items.map(({ id }) => ({ type: "MotorUnderwriting", id })),
              { type: "MotorUnderwriting", id: "LIST" },
            ]
          : [{ type: "MotorUnderwriting", id: "LIST" }];
      },
    }),
    getMotorUnderwriting: builder.query({
      query: (id) => ({
        url: `/v1/motorinsurances/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "MotorUnderwriting", id }],
    }),
    createMotorUnderwriting: builder.mutation({
      query: (data) => ({
        url: "/v1/motorinsurances",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "MotorUnderwriting", id: "LIST" }],
    }),
    updateMotorUnderwriting: builder.mutation({
      query: ({ id, data }) => ({
        url: `/v1/motorinsurances/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MotorUnderwriting", id: "LIST" },
        { type: "MotorUnderwriting", id },
      ],
    }),
    deleteMotorUnderwriting: builder.mutation({
      query: (id) => ({
        url: `/v1/motorinsurances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "MotorUnderwriting", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMotorUnderwritingsQuery,
  useGetMotorUnderwritingQuery,
  useCreateMotorUnderwritingMutation,
  useUpdateMotorUnderwritingMutation,
  useDeleteMotorUnderwritingMutation,
} = motorVehicleApi;
