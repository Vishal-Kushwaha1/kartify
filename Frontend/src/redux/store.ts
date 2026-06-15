import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./user/userApi";
import { cartApi } from "./cart/cartApi";
import { wishlistApi } from "./wishlist/wishlistApi";
import { addressApi } from "./address/addressApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, cartApi.middleware, wishlistApi.middleware, addressApi.middleware),
});

setupListeners(store.dispatch);
