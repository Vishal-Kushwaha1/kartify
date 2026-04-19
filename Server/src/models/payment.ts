import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { user } from "./user.js";
import { order } from "./order.js";

export const providerEnum = t.pgEnum("provider", [
  "razorpay",
  "stripe",
  "cash",
]);
export const paymentStatusEnum = t.pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
  "cancelled",
  "refunded"
]);

export const payment = pgTable("payment", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  provider: providerEnum("provider").notNull(),
  providerPaymentId: t.text("provider_payment_id").notNull(),
  amount: t.numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: t.text("currency").default("INR").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  orderId: t
    .uuid("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: t
    .timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});
