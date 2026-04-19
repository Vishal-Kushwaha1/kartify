import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const cart = pgTable("cart", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});
