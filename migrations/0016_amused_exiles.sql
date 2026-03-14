CREATE TYPE "public"."news_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "news_comments" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"post_id" varchar(128) NOT NULL,
	"user_id" varchar(128),
	"user_name" varchar(255),
	"user_avatar" varchar(500),
	"comment_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_post_likes" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"post_id" varchar(128) NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_posts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(550) NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"featured_image" varchar(500),
	"featured_image_key" varchar(500),
	"categories" text,
	"status" "news_status" DEFAULT 'published' NOT NULL,
	"author_id" varchar(128) NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "news_comments" ADD CONSTRAINT "news_comments_post_id_news_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."news_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_comments" ADD CONSTRAINT "news_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_post_likes" ADD CONSTRAINT "news_post_likes_post_id_news_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."news_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_post_likes" ADD CONSTRAINT "news_post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_author_id_admins_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;