ALTER TABLE "jobs" ADD COLUMN "requirements" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "company_name";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "company_logo";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "company_website";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "company_email";