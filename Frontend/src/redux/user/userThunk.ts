import { createAsyncThunk } from "@reduxjs/toolkit";
import { authClient } from "@/lib/authClient";
import type { User } from "@/types/type";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data: session, error } = await authClient.getSession();
        if (error) {
            return rejectWithValue(error.message ?? "Auth error");
        }
      const user = session?.user;
      if(user){
          return {
              ...user,
              createdAt: new Date(user.createdAt).toISOString(),
              updatedAt: new Date(user.updatedAt).toISOString(),
          } as unknown as User
      }
      return null;
    } catch (error: unknown) {
      return rejectWithValue("Something went wrong");
    }
  },
);
