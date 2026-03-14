CREATE TYPE "public"."video_status" AS ENUM('draft', 'published', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."video_type" AS ENUM('kracada_tv', 'trending');--> statement-breakpoint
CREATE TABLE "videos" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"video_url" varchar(1000) NOT NULL,
	"thumbnail_image" varchar(1000) NOT NULL,
	"duration" varchar(20) NOT NULL,
	"type" "video_type" NOT NULL,
	"categories" text NOT NULL,
	"author" varchar(255) NOT NULL,
	"status" "video_status" DEFAULT 'draft' NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_by" varchar(128) NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;