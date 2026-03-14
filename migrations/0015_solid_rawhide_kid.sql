CREATE TYPE "public"."user_status" AS ENUM('Active', 'Suspended', 'Inactive');--> statement-breakpoint
CREATE TYPE "public"."admin_status" AS ENUM('Active', 'Suspended', 'Inactive');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'Active' NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "status" "admin_status" DEFAULT 'Active' NOT NULL;