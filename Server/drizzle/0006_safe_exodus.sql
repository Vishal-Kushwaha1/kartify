ALTER TABLE "seller_document" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "seller_document" CASCADE;--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_seller_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "country" SET DEFAULT 'India';--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "is_active" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "seller_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "formatted_address" text;--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "latitude" numeric(10, 7) NOT NULL;--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "longitude" numeric(10, 7) NOT NULL;--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "seller" ADD COLUMN "pan_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "seller" ADD COLUMN "aadhar_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "seller" ADD COLUMN "gst_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "seller" ADD COLUMN "gst_certificate" text;--> statement-breakpoint
ALTER TABLE "seller" ADD COLUMN "shop_image" text;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;