CREATE TYPE "public"."admin_role" AS ENUM('Super Admin', 'Admin');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "admin_role" DEFAULT 'Admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
