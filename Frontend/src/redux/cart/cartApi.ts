import type { CartData } from "@/types/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AXIOS_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCartItem: builder.query<CartData[] | null, void>({
      query: () => "/cart",
      transformResponse: (response: { data: CartData[] }) =>
        response?.data ?? [],
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (productId) => ({
        url: "/cart/add",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: "/cart/remove",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "/cart/update",
        method: "PUT",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartItemQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
} = cartApi;
