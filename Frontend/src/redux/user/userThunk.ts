import { createAsyncThunk } from "@reduxjs/toolkit";
import { authClient } from "@/lib/authClient";
import type { User } from "@/types/user";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const { data: session, error } = await authClient.getSession();

    if (error) {
      return error.message ?? "Auth error";
    }
    return session?.user as User ?? null;
  } catch (error: unknown) {
    return "something went wrong";
  }
});
