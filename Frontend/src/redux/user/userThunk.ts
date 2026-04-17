import { createAsyncThunk } from "@reduxjs/toolkit";
import { authClient } from "@/lib/authClient";
import type { User } from "@/types/user";

export const fetchUser = createAsyncThunk<User |null, void, {rejectValue: string}>
("user/fetchUser", async (_, {rejectWithValue}) => {
  try {
    const { data: session, error } = await authClient.getSession();
  
    if (error) {
      return rejectWithValue(error.message ?? "Auth error")
    }
    return session?.user ?? null
  } catch (error: unknown) {
    return rejectWithValue("something went wrong")
  }
});
