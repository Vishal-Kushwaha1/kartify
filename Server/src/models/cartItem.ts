import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { cart } from "./cart.js";
import { product } from "./product.js";

export const cartItem = pgTable("cart_item", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  quantity: t.integer("quantity").notNull().default(1),
  price: t.numeric("price", { precision: 10, scale: 2 }).notNull(),
  cartId: t
    .uuid("cart_id")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: t
    .uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "restrict" }),
});
