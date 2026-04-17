import { authClient } from "@/lib/authClient";
import type { User } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { fetchUser } from "./userThunk";

export interface UserState {
  user: User | null ;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

  const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setUser:(state, action: PayloadAction<User>) =>{
        state.user = action.payload
      },
      clearUser:(state)=>{
        state.user = null
      }
    },
    extraReducers:(builder)=>{
      builder.addCase(fetchUser.pending, (state)=>{
        state.loading = true
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action)=>{
        state.loading = false;
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action)=>{
        state.loading = false;
        state.error  =action.payload as string ?? "Error"
      })
    }
  });

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
