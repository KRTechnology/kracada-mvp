-- First, convert account_type column to text to allow data manipulation
ALTER TABLE "users" ALTER COLUMN "account_type" SET DATA TYPE text;--> statement-breakpoint

-- Update existing 'Employer' records to 'Recruiter'
UPDATE "users" SET "account_type" = 'Recruiter' WHERE "account_type" = 'Employer';--> statement-breakpoint

-- Drop the old enum type
DROP TYPE "public"."account_type";--> statement-breakpoint

-- Create new enum type with 'Recruiter' instead of 'Employer'
CREATE TYPE "public"."account_type" AS ENUM('Job Seeker', 'Recruiter', 'Business Owner', 'Contributor');--> statement-breakpoint

-- Convert the column back to use the new enum type
ALTER TABLE "users" ALTER COLUMN "account_type" SET DATA TYPE "public"."account_type" USING "account_type"::"public"."account_type";