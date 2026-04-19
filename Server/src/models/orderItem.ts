import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { order } from "./order.js";
import { product } from "./product.js";

export const orderItem = pgTable("order_item", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  quantity: t.integer("quantity").notNull().default(1),
  price: t.numeric("price",{precision:10, scale:2}).notNull(),
  orderId: t
    .uuid("order_id")
    .notNull()
    .references(() => order.id,{onDelete: "cascade"}),
  productId: t
    .uuid("product_id")
    .notNull()
    .references(() => product.id,{onDelete: "restrict"}),
});
