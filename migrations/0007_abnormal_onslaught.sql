CREATE TYPE "public"."job_location_type" AS ENUM('remote', 'onsite', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('active', 'closed');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance');--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"job_id" varchar(128) NOT NULL,
	"applicant_id" varchar(128) NOT NULL,
	"status" varchar(50) DEFAULT 'Submitted' NOT NULL,
	"cover_letter" text,
	"resume_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"job_description" text NOT NULL,
	"job_location" varchar(255) NOT NULL,
	"job_location_type" "job_location_type" NOT NULL,
	"industry" varchar(255) NOT NULL,
	"job_type" "job_type" NOT NULL,
	"salary_range" varchar(255) NOT NULL,
	"currency" varchar(10) DEFAULT 'NGN' NOT NULL,
	"deadline" timestamp NOT NULL,
	"status" "job_status" DEFAULT 'active' NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"company_logo" varchar(500),
	"company_website" varchar(255),
	"company_email" varchar(255),
	"multimedia_content" varchar(500),
	"required_skills" text NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"applicants_count" integer DEFAULT 0 NOT NULL,
	"employer_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;