CREATE TYPE "public"."shipment_status" AS ENUM('processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed');--> statement-breakpoint
CREATE TABLE "seller_document" (
	"Id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"pan_number" text NOT NULL,
	"aadhar_number" text NOT NULL,
	"gst_number" text NOT NULL,
	"gst_certificate" text,
	"shop_image" text,
	"createdAt" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seller_document_seller_id_unique" UNIQUE("seller_id")
);
--> statement-breakpoint
CREATE TABLE "shipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_number" text NOT NULL,
	"status" "shipment_status" DEFAULT 'processing' NOT NULL,
	"order_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"shipped_at" timestamp (6) with time zone,
	"delivered_at" timestamp (6) with time zone,
	CONSTRAINT "shipment_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
ALTER TABLE "seller" DROP CONSTRAINT "seller_store_name_unique";--> statement-breakpoint
ALTER TABLE "seller_document" ADD CONSTRAINT "seller_document_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;