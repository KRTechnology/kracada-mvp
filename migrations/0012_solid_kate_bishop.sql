CREATE TYPE "public"."order_status" AS ENUM('pending_payment', 'payment_verified', 'cv_uploaded', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."package_type" AS ENUM('deluxe', 'supreme', 'premium');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'successful', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "cv_optimization_orders" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"package_type" "package_type" NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"package_price" numeric(10, 2) NOT NULL,
	"package_description" text,
	"payment_reference" varchar(255),
	"paystack_transaction_id" varchar(255),
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"payment_amount" numeric(10, 2),
	"payment_currency" varchar(10) DEFAULT 'NGN',
	"order_status" "order_status" DEFAULT 'pending_payment' NOT NULL,
	"cv_file_url" varchar(500),
	"cv_file_key" varchar(500),
	"optimized_cv_url" varchar(500),
	"includes_cover_letter" boolean DEFAULT false,
	"includes_linkedin_profile" boolean DEFAULT false,
	"includes_interview_prep" boolean DEFAULT false,
	"max_revisions" integer DEFAULT 2,
	"revisions_used" integer DEFAULT 0,
	"estimated_delivery_days" integer,
	"delivered_at" timestamp,
	"customer_notes" text,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cv_optimization_orders_payment_reference_unique" UNIQUE("payment_reference")
);
--> statement-breakpoint
CREATE TABLE "cv_payment_transactions" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"order_id" varchar(128) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"paystack_reference" varchar(255) NOT NULL,
	"paystack_transaction_id" varchar(255),
	"paystack_status" varchar(50),
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'NGN',
	"customer_email" varchar(255),
	"customer_phone" varchar(50),
	"channel" varchar(50),
	"gateway_response" text,
	"payment_method" varchar(100),
	"webhook_data" text,
	"verified_at" timestamp,
	"verification_status" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cv_payment_transactions_paystack_reference_unique" UNIQUE("paystack_reference")
);
--> statement-breakpoint
ALTER TABLE "cv_optimization_orders" ADD CONSTRAINT "cv_optimization_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_payment_transactions" ADD CONSTRAINT "cv_payment_transactions_order_id_cv_optimization_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."cv_optimization_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_payment_transactions" ADD CONSTRAINT "cv_payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_applications_applicant_id_idx" ON "job_applications" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "job_applications_job_id_idx" ON "job_applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "job_applications_status_idx" ON "job_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_applications_applicant_created_idx" ON "job_applications" USING btree ("applicant_id","created_at");--> statement-breakpoint
CREATE INDEX "jobs_employer_id_idx" ON "jobs" USING btree ("employer_id");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");