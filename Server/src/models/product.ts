import { pgTable } from "drizzle-orm/pg-core";

import * as t from "drizzle-orm/pg-core";
import { seller } from "./seller.js";
import { user } from "./user.js";

export const product = pgTable("product", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.text("name").notNull(),
  description: t.text("description"),
  price: t
    .numeric("price", { precision: 10, scale: 2, mode: "number" })
    .notNull(),
  stock: t.integer("stock").notNull().default(0),
  category: t.text("category").array(),
  image: t.text("image").array(),
  isActive: t.boolean("is_active").default(true).notNull(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sellerId: t
    .uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "cascade" }),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
