import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { product } from "./product.js";
import { user } from "./user.js";

export const wishlist = pgTable("wishlist", {
  id: t.uuid().primaryKey().defaultRandom(),
  productId: t
    .uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
