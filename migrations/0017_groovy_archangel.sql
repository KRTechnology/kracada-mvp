CREATE TABLE "hotels" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"full_description" text NOT NULL,
	"location" varchar(255) NOT NULL,
	"address" text,
	"price_per_night" integer NOT NULL,
	"currency" varchar(10) DEFAULT '₦' NOT NULL,
	"category" varchar(100) NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured_image" varchar(500),
	"amenities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"policies" jsonb NOT NULL,
	"contact" jsonb NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"review_count" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"full_description" text NOT NULL,
	"location" varchar(255) NOT NULL,
	"address" text,
	"price_range" varchar(10) NOT NULL,
	"cuisine" varchar(100) NOT NULL,
	"category" varchar(100) NOT NULL,
	"opening_hours" varchar(100) NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured_image" varchar(500),
	"contact" jsonb NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ambiance" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"menu_highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"policies" jsonb NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"review_count" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;