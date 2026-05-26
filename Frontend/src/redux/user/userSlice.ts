import type { User } from "@/types/type";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "./userThunk";

const tokenFromStorage = localStorage.getItem("token");

export interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: tokenFromStorage,
  loading: !!tokenFromStorage, // Set loading true if we have a token to rehydrate
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.loading = false;
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearUser: (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload as User;
        if (!action.payload) {
          // If fetched successfully but no user (e.g., expired session)
          state.token = null;
          localStorage.removeItem("token");
        }
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Error";
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      });
  },
});


export const { setUser, setToken, clearUser } = userSlice.actions;
export default userSlice.reducer;
