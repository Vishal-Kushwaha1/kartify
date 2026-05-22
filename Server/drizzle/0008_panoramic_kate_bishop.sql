CREATE TYPE "public"."payment_method" AS ENUM('COD', 'STRIPE', 'RAZORPAY');--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "payment_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "payment_status" SET DEFAULT 'pending'::text;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."payment_status";--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "payment_status" SET DEFAULT 'pending'::"public"."payment_status";--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "payment_status" SET DATA TYPE "public"."payment_status" USING "payment_status"::"public"."payment_status";--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."payment_status";--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "status" SET DATA TYPE "public"."payment_status" USING "status"::"public"."payment_status";--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_method" "payment_method" NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_status" "payment_status" DEFAULT 'pending' NOT NULL;