import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const address = pgTable("address", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.text("name").default("home"),
  recipientName: t.text("recipient_name").notNull(),
  phone: t.text("phone").notNull(),
  address: t.text("address").notNull(),
  city: t.text("city").notNull(),
  state: t.text("state").notNull(),
  postalCode: t.text("postal_code").notNull(),
  country: t.text("country").notNull(),
  isDefault: t.boolean("is_default").default(false).notNull(),
  userId: t.text("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});
