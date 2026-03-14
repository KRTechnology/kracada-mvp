CREATE TYPE "public"."quiz_difficulty" AS ENUM('Beginner', 'Intermediate', 'Advanced');--> statement-breakpoint
CREATE TYPE "public"."quiz_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"quiz_id" varchar(128) NOT NULL,
	"user_id" varchar(128),
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_comments" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"quiz_id" varchar(128) NOT NULL,
	"user_id" varchar(128),
	"user_name" varchar(255),
	"user_avatar" varchar(500),
	"comment_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_question_options" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"question_id" varchar(128) NOT NULL,
	"option_text" text NOT NULL,
	"option_order" integer NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"quiz_id" varchar(128) NOT NULL,
	"question_text" text NOT NULL,
	"question_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(550) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(255) NOT NULL,
	"difficulty" "quiz_difficulty" DEFAULT 'Beginner' NOT NULL,
	"featured_image" varchar(500),
	"featured_image_key" varchar(500),
	"estimated_time" varchar(50) NOT NULL,
	"status" "quiz_status" DEFAULT 'draft' NOT NULL,
	"admin_id" varchar(128) NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quizzes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_comments" ADD CONSTRAINT "quiz_comments_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_comments" ADD CONSTRAINT "quiz_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_question_options" ADD CONSTRAINT "quiz_question_options_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;