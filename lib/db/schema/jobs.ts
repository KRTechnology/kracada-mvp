import { createId } from "@paralleldrive/cuid2";
import {
  pgEnum,
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Define job status enum
export const jobStatusEnum = pgEnum("job_status", ["active", "closed"]);

// Define job type enum
export const jobTypeEnum = pgEnum("job_type", [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
]);

// Define job location type enum
export const jobLocationTypeEnum = pgEnum("job_location_type", [
  "remote",
  "onsite",
  "hybrid",
]);

// Jobs table
export const jobs = pgTable("jobs", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  // Basic job information
  title: varchar("job_title", { length: 255 }).notNull(),
  description: text("job_description").notNull(),
  location: varchar("job_location", { length: 255 }).notNull(),
  locationType: jobLocationTypeEnum("job_location_type").notNull(),
  industry: varchar("industry", { length: 255 }).notNull(),
  jobType: jobTypeEnum("job_type").notNull(),

  // Salary information
  salaryRange: varchar("salary_range", { length: 255 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("NGN"),

  // Deadline and status
  deadline: timestamp("deadline").notNull(),
  status: jobStatusEnum("status").notNull().default("active"),

  // Company information
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyLogo: varchar("company_logo", { length: 500 }),
  companyWebsite: varchar("company_website", { length: 255 }),
  companyEmail: varchar("company_email", { length: 255 }),

  // Additional content
  multimediaContent: varchar("multimedia_content", { length: 500 }),

  // Skills required for the job (stored as JSON array)
  requiredSkills: text("required_skills").notNull(), // JSON array of strings

  // Tracking metrics
  viewsCount: integer("views_count").default(0).notNull(),
  applicantsCount: integer("applicants_count").default(0).notNull(),

  // Relationships
  employerId: varchar("employer_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Job applications table
export const jobApplications = pgTable("job_applications", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  // Job and applicant relationship
  jobId: varchar("job_id", { length: 128 })
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  applicantId: varchar("applicant_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Application status
  status: varchar("status", { length: 50 })
    .notNull()
    .default("Submitted")
    .$type<
      | "Submitted"
      | "Under review"
      | "Shortlisted"
      | "Rejected"
      | "Interviewed"
      | "Offer"
    >(),

  // Application details
  coverLetter: text("cover_letter"),
  resumeUrl: varchar("resume_url", { length: 500 }),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Ensure unique application per user per job
  // This will be handled at the application level
});

// Types
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

// Job status type
export type JobStatus = "active" | "closed";

// Job type
export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";

// Job location type
export type JobLocationType = "remote" | "onsite" | "hybrid";

// Application status type
export type ApplicationStatus =
  | "Submitted"
  | "Under review"
  | "Shortlisted"
  | "Rejected"
  | "Interviewed"
  | "Offer";
