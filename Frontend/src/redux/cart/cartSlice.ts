import type { CartData } from "@/types/type";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearCart,
  fetchCartItem,
  removeFromCart,
  updateCartItem,
} from "./cartThunk";

export interface CartState {
  cart: CartData[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const handlePending = (state: CartState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (
  state: CartState,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
) => {
  state.loading = false;
  state.error = action.payload  ?? action.error.message ?? "Something went wrong";
};
const handleCartUpdate = (state: CartState, action: PayloadAction<{ data: CartData[] }>) => {
  state.loading = false;
  state.cart = action.payload.data;
  state.error = null;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartData[]>) => {
      state.loading = false;
      state.cart = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItem.pending, handlePending)
      .addCase(addToCart.pending, handlePending)
      .addCase(removeFromCart.pending, handlePending)
      .addCase(updateCartItem.pending, handlePending)
      .addCase(clearCart.pending, handlePending);
    builder
      .addCase(fetchCartItem.fulfilled, handleCartUpdate)
      .addCase(addToCart.fulfilled, handleCartUpdate)
      .addCase(removeFromCart.fulfilled, handleCartUpdate)
      .addCase(updateCartItem.fulfilled, handleCartUpdate)
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = [];
        state.error = null;
      });
    builder
      .addCase(fetchCartItem.rejected, handleRejected)
      .addCase(addToCart.rejected, handleRejected)
      .addCase(removeFromCart.rejected, handleRejected)
      .addCase(updateCartItem.rejected, handleRejected)
      .addCase(clearCart.rejected, handleRejected);
  },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
