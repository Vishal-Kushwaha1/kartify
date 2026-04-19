import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const seller = pgTable("seller", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  storeName: t.text("store_name").notNull().unique(),
  storeDescription: t.text("store_description"),
  storeLocation: t.text("store_location"),
  isActive: t.boolean("is_active").notNull().default(true),
  userId: t
    .text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: t
    .timestamp("created_at", {
      precision: 6,
      withTimezone: true,
    })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp("updated_at", {
      precision: 6,
      withTimezone: true,
    })
    .notNull()
    .defaultNow(),
});
