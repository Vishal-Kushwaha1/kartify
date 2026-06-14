import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { authClient } from "@/lib/authClient";
import type { User } from "@/types/type";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query<User | null, void>({
      queryFn: async () => {
        try {
          const { data: session, error } = await authClient.getSession();

          if (error) return { error: error.message ?? "Auth error" };

          const user = session?.user;
          if (!user) return { data: null };
          return {
            data: {
              ...user,
              createdAt: new Date(user.createdAt).toISOString(),
              updatedAt: new Date(user.updatedAt).toISOString(),
            } as unknown as User,
          };
        } catch {
          return { error: "Something went wrong" };
        }
      },
      providesTags: ["User"],
    }),
    clearUser: builder.mutation<null, void>({
      queryFn: async () => {
        try {
          await authClient.signOut();
          return { data: null };
        } catch {
          return { error: "Something went wrong" };
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery, useClearUserMutation } = userApi;
