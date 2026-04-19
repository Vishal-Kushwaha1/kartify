import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { user } from "./user.js";
import { product } from "./product.js";

export const review = pgTable("review", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  rating: t.integer("rating").notNull(),
  comment: t.text("comment"),
  userId: t
    .text("user_id")
    .references(() => user.id, { onDelete: "set null" }),
  productId: t
    .uuid("product_id")
    .notNull()
    .references(() => product.id,{onDelete:"cascade"}),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull().defaultNow(),
});
