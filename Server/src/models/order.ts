import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { user } from "./user.js";
import { address } from "./address.js";
import { discount } from "./discount.js";

export const orderStatusEnum = t.pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "in_transit",
  "delivered",
  "cancelled",
  "returned",
]);

export const order = pgTable("order", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalAmount: t.numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  addressId: t
    .uuid("address_id")
    .notNull()
    .references(() => address.id, { onDelete: "restrict" }),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  discountId: t
    .uuid("discount_id")
    .references(() => discount.id, { onDelete: "set null" }),
  paymentId: t.text("payment_id"),
  shipmentId: t.text("shipment_id"),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});
