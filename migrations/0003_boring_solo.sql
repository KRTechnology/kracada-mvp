CREATE TYPE "public"."notification_category" AS ENUM('alerts', 'jobs', 'articles', 'news');--> statement-breakpoint
CREATE TYPE "public"."notification_event" AS ENUM('password_change', 'new_browser_signin', 'new_device_linked', 'new_job_post', 'job_application_status', 'new_topics', 'new_comment_on_article', 'likes_on_article', 'news_updates');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('none', 'in_app', 'email');--> statement-breakpoint
CREATE TABLE "default_notification_preferences" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"category" "notification_category" NOT NULL,
	"event" "notification_event" NOT NULL,
	"none_enabled" boolean DEFAULT false NOT NULL,
	"in_app_enabled" boolean DEFAULT false NOT NULL,
	"email_enabled" boolean DEFAULT false NOT NULL,
	"event_description" text NOT NULL,
	"category_description" text NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_notification_overrides" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"category" "notification_category" NOT NULL,
	"event" "notification_event" NOT NULL,
	"none_enabled" boolean,
	"in_app_enabled" boolean,
	"email_enabled" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_notification_preferences" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"category" "notification_category" NOT NULL,
	"event" "notification_event" NOT NULL,
	"none_enabled" boolean DEFAULT false NOT NULL,
	"in_app_enabled" boolean DEFAULT false NOT NULL,
	"email_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_notification_overrides" ADD CONSTRAINT "user_notification_overrides_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "event_unique_idx" ON "default_notification_preferences" USING btree ("event");--> statement-breakpoint
CREATE UNIQUE INDEX "user_event_override_unique_idx" ON "user_notification_overrides" USING btree ("user_id","event");--> statement-breakpoint
CREATE UNIQUE INDEX "user_event_unique_idx" ON "user_notification_preferences" USING btree ("user_id","event");