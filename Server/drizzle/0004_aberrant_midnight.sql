ALTER TABLE "product" DROP CONSTRAINT "product_seller_id_seller_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "seller_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_seller_id_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;