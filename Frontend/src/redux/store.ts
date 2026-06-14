import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./user/userApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { cartApi } from "./cart/cartApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, cartApi.middleware),
});

setupListeners(store.dispatch);
