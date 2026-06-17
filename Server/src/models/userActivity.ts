import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { user } from "./user.js";
import { product } from "./product.js";

export const actionEnum = t.pgEnum("action_type", ["view", "cart", "wishlist"]);

export const userActivity = pgTable("user_activity", {
  id: t.uuid("id").defaultRandom().primaryKey(),
  userId: t.text("user_id").references(() => user.id, { onDelete: "cascade" }),
  productId: t
    .uuid("product_id")
    .references(() => product.id, { onDelete: "no action" }),
  actionType: actionEnum("action_type").notNull(),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .defaultNow(),
});
