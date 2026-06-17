import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { WishlistItem } from "@/types/type";

export const wishlistApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_AXIOS_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Wishlist", "Cart"],
  endpoints: (builder) => ({
    fetchWishlist: builder.query<WishlistItem[], void>({
      query: () => "/wishlist",
      transformResponse: (response: { data: WishlistItem[] }) => response?.data,
      providesTags: ["Wishlist"],
    }),
    addItemToWishlist: builder.mutation({
      query: (productId) => ({
        url: "/wishlist",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeItemFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    moveToCart: builder.mutation({
      query: (productId) => ({
        url: "/wishlist/move-to-cart",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useFetchWishlistQuery,
  useAddItemToWishlistMutation,
  useRemoveItemFromWishlistMutation,
  useMoveToCartMutation,
} = wishlistApi;
