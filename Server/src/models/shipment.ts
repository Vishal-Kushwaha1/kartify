import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { order } from "./order.js";

export const shipmentStatusEnum = t.pgEnum("shipment_status", [
  "processing",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed"
]);

export const shipment = pgTable("shipment", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  trackingNumber: t.text("tracking_number").notNull().unique(),
  status: shipmentStatusEnum("status").notNull().default("processing"),
  orderId: t
    .text("order_id")
    .references(() => order.id, { onDelete: "cascade" }),
  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  shippedAt: t.timestamp("shipped_at", {
    precision: 6,
    withTimezone: true,
  }),
  deliveredAt: t.timestamp("delivered_at", {
    precision: 6,
    withTimezone: true,
  }),
});
