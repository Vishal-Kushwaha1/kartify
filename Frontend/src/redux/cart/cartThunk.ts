import {api} from "@/utils/Axios";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const fetchCartItem = createAsyncThunk(
    "cart/fetchCart",
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.get("/cart", {
                withCredentials: true,
            });
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue("Unable to load cart item");
        }
    },
);

export const addToCart = createAsyncThunk(
    "cart/addItem",
    async (productId: string, {rejectWithValue}) => {
        try {
            const response = await api.post(
                "/cart/add",
                {productId},
                {withCredentials: true},
            );
            await api.post(`/recommendation/track`, {productId,actionType:"cart"},{withCredentials:true})
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue("Unable to add cart item");
        }
    },
);

export const removeFromCart = createAsyncThunk(
    "cart/removeItem",
    async (productId: string, {rejectWithValue}) => {
        try {
            const response = await api.post(
                "/cart/remove",
                {productId},
                {withCredentials: true},
            );
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue("Unable to remove cart item");
        }
    },
);

export const updateCartItem = createAsyncThunk(
    "cart/updateItem",
    async (
        {productId, quantity}: { productId: string; quantity: number },
        {rejectWithValue},
    ) => {
        try {
            const response = await api.put(
                "/cart/update",
                {productId, quantity},
                {withCredentials: true},
            );
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue("Unable to update cart");
        }
    },
);

export const clearCart = createAsyncThunk(
    "cart/clearItems",
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.delete("/cart/clear", {
                withCredentials: true,
            });
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue("Unable to clear cart");
        }
    },
);
