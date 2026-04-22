import type { User, UserSession } from "../utils/auth.ts";
import type { CartItemsType, CartType, ProductType } from "./type.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: UserSession;
      product?: ProductType;
      cart?: CartType;
      cartItems?: CartItemsType[];
    }
  }
}
