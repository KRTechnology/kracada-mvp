CREATE TYPE "public"."subscription_source" AS ENUM('news_page', 'homepage', 'footer', 'popup', 'other');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'unsubscribed', 'bounced');--> statement-breakpoint
CREATE TABLE "email_campaigns" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"content" varchar(10000) NOT NULL,
	"sent_count" varchar(50) DEFAULT '0',
	"opened_count" varchar(50) DEFAULT '0',
	"clicked_count" varchar(50) DEFAULT '0',
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mailing_list_subscribers" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"source" "subscription_source" DEFAULT 'other' NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp,
	"last_email_sent_at" timestamp,
	"emails_sent_count" varchar(50) DEFAULT '0',
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_token" varchar(128),
	"ip_address" varchar(45),
	"user_agent" varchar(500),
	"tags" varchar(500),
	"metadata" varchar(1000),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mailing_list_subscribers_email_unique" UNIQUE("email")
);
