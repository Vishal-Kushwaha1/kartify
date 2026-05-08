ALTER TABLE "product" DROP CONSTRAINT "product_discount_id_discount_id_fk";
--> statement-breakpoint
ALTER TABLE "discount" ALTER COLUMN "min_order_amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "is_active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "seller" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;