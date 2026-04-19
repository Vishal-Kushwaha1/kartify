import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const discountTypeEnum = t.pgEnum("discount_type", [
  "percentage",
  "flat",
]);

export const discount = pgTable("discount", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  code: t.text("code").notNull(),
  description: t.text("description"),
  discountType: discountTypeEnum("discount_type").notNull(),
  value: t.integer("value").notNull(),
  minOrderAmount: t.numeric("min_order_amount", { precision: 10, scale: 2 }).notNull(),
  startDate: t.timestamp("start_date", { precision: 6, withTimezone: true }),
  endDate: t.timestamp("end_date", { precision: 6, withTimezone: true }),
  usageLimit: t.integer("usage_limit"),
  usedCount: t.integer("used_count").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
});
