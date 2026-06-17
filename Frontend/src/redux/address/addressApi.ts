import type { NewAddressProps } from "@/types/schema";
import type { Address } from "@/types/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AXIOS_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getAddress: builder.query<Address[], void>({
      query: () => "/address",
      transformResponse: (response: { data: Address[] }) =>
        response?.data ?? [],
      providesTags: ["Address"],
    }),
    addAddress: builder.mutation({
      query: (values: NewAddressProps) => ({
        url: `/address`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: builder.mutation({
      query: (id) => ({
        url: `/address/${id}`,
        method: "PUT",
        body: { isDefault: true },
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi;
