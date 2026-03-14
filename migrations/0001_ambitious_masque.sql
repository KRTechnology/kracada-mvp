CREATE TYPE "public"."employment_type" AS ENUM('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary');--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"employment_type" "employment_type" NOT NULL,
	"company" varchar(255) NOT NULL,
	"currently_working" boolean DEFAULT false NOT NULL,
	"start_month" varchar(20),
	"start_year" varchar(4),
	"end_month" varchar(20),
	"end_year" varchar(4),
	"description" text,
	"skills" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "years_of_experience" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "skills" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "job_preferences" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_picture" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cv" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "has_completed_profile" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;