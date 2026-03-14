CREATE TYPE "public"."bookmark_content_type" AS ENUM('job', 'article', 'video', 'hotel');--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"content_type" "bookmark_content_type" NOT NULL,
	"content_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_user_id_content_type_content_id_unique" UNIQUE("user_id","content_type","content_id")
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;