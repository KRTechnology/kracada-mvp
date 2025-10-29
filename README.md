# Kracada MVP

A comprehensive lifestyle blog and platform built with Next.js 15, featuring job listings, news articles, lifestyle posts, CV optimization services, quizzes, hotels & restaurants, and more. Kracada serves as a one-stop destination for everything important to users in Nigeria.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Database Seeding](#database-seeding)
- [Project Structure](#project-structure)
- [User Account Types](#user-account-types)
- [Admin System](#admin-system)
- [Database Schema](#database-schema)
- [Key Modules](#key-modules)
- [Authentication & Authorization](#authentication--authorization)
- [Third-Party Integrations](#third-party-integrations)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

## Overview

Kracada is a multi-featured platform that combines:

- **Job Listings**: Job seekers can browse and apply for jobs; recruiters and business owners can post job listings
- **News**: Admin-published news articles with comments and likes
- **Lifestyle Posts**: Contributor-authored blog posts with rich text editing
- **CV Optimization**: Paid CV writing services with Paystack integration
- **Quizzes**: Admin-created quizzes for entertainment and engagement
- **Hotels & Restaurants**: Business owners can list their hospitality businesses
- **Entertainment**: Video content and entertainment features
- **Travel & Tourism**: Travel-related content and listings

The platform uses role-based access control with separate admin and user authentication systems, comprehensive file uploads via Cloudflare R2, and email notifications via Resend.

## Features

### Core Features

#### 👔 Job Management

- Job posting by Recruiters and Business Owners
- Job applications with cover letters and CV uploads
- Application status tracking (Submitted, Under review, Shortlisted, Rejected, Interviewed, Offer)
- Job bookmarks and saved searches
- Job filtering by location, type, industry, and salary

#### 📰 News & Articles

- Admin-published news articles
- Rich text content with Tiptap editor
- Featured images and categories
- Comments and likes
- View tracking

#### ✍️ Lifestyle Posts

- Contributor-authored blog posts
- Rich text editor with image uploads
- Category system with 20+ predefined categories
- Draft, Published, Flagged, and Archived statuses
- Comments (guest and logged-in users)
- Like functionality
- View counting

#### 📝 CV Optimization Service

- Three package tiers (Deluxe, Supreme, Premium)
- Paystack payment integration
- Secure CV file uploads to Cloudflare R2
- Order tracking and status management
- Revision system (2-5 revisions depending on package)
- Admin review and delivery workflow
- Payment webhook handling

#### 🎯 Quizzes

- Admin-created quizzes with multiple-choice questions
- Difficulty levels (Beginner, Intermediate, Advanced)
- Guest and authenticated user support
- Score tracking and attempt history
- Comments on quizzes
- Featured images

#### 🏨 Hotels & Restaurants

- Business owners can list hotels and restaurants
- Detailed information (amenities, features, pricing, contact)
- Image galleries
- Reviews and ratings system
- Booking information

#### 📧 Mailing List

- Newsletter subscription system
- Source tracking (homepage, news page, footer, popup)
- Subscription status management
- Admin dashboard for subscriber management
- CSV export functionality

#### 👥 User Management

- Profile management with skills, preferences, CV uploads
- Notification preferences system
- Session tracking and management
- Bookmarks across different content types

### Technical Features

- **Server-Side Rendering** with Next.js 15 App Router
- **Type-Safe Database Operations** with Drizzle ORM
- **PostgreSQL Database** (Neon for production)
- **JWT-based Authentication** with NextAuth v5
- **Email Notifications** with Resend and React Email templates
- **File Storage** with Cloudflare R2 (S3-compatible)
- **Payment Processing** with Paystack
- **Modern UI** with Tailwind CSS and shadcn/ui components
- **Smooth Animations** with Framer Motion
- **Theme Support** with next-themes (light/dark mode)
- **Form Validation** with React Hook Form + Zod
- **Rich Text Editing** with Tiptap
- **Responsive Design** for mobile and desktop

## Tech Stack

### Core Framework

- **Next.js**: 15.3.2 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Node.js**: 18+

### Database & ORM

- **PostgreSQL**: Database (Neon for production)
- **Drizzle ORM**: 0.43.1
- **Neon Serverless**: PostgreSQL driver

### Authentication

- **NextAuth**: 5.0.0-beta.28
- **bcryptjs**: Password hashing

### Styling & UI

- **Tailwind CSS**: 3.4.17
- **shadcn/ui**: UI component library (Radix UI primitives)
- **Framer Motion**: 12.12.0 (animations)
- **next-themes**: 0.4.6 (theme management)
- **Lucide React**: 0.510.0 (icons)
- **Sonner**: 2.0.3 (toast notifications)

### Forms & Validation

- **React Hook Form**: 7.56.4
- **Zod**: 3.24.4
- **@hookform/resolvers**: 5.0.1

### Rich Text Editing

- **@tiptap/react**: 3.4.4
- **@tiptap/starter-kit**: 3.4.4
- **@tiptap/extension-image**: 3.6.5
- **@tiptap/extension-link**: 3.6.5
- **@tiptap/extension-placeholder**: 3.6.5

### File Storage

- **Cloudflare R2**: S3-compatible storage
- **@aws-sdk/client-s3**: 3.850.0
- **@aws-sdk/s3-request-presigner**: 3.850.0

### Payments

- **react-paystack**: 6.0.0 (Paystack integration)

### Email

- **Resend**: 4.5.1
- **@react-email/components**: 0.0.41

### Utilities

- **date-fns**: 4.1.0 (date manipulation)
- **@paralleldrive/cuid2**: 2.2.2 (ID generation)
- **clsx**: 2.1.1 (CSS class utilities)
- **tailwind-merge**: 3.3.0

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or Neon)
- npm or yarn package manager
- Git
- Cloudflare R2 account (for file uploads)
- Paystack account (for payments)
- Resend account (for emails)

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd kracada-mvp
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment files:**

Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables) section)

4. **Set up the database:**

See [Database Setup](#database-setup) section

5. **Seed the database:**

See [Database Seeding](#database-seeding) section

6. **Run the development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@neon.tech/kracada_db

# NextAuth Configuration
AUTH_SECRET=your-secret-key-here-min-32-characters-long
AUTH_URL=http://localhost:3000  # or your production URL

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Resend Email Configuration
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Cloudflare R2 Configuration (for file uploads)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket-public-url.r2.dev

# Paystack Configuration (for payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
```

**Important Notes:**

- `DATABASE_URL` is your PostgreSQL connection string (Neon for production, local for development)
- `AUTH_SECRET` should be a strong, random string (minimum 32 characters). Generate one with: `openssl rand -base64 32`
- `RESEND_API_KEY` can be obtained from [resend.com](https://resend.com)
- `RESEND_FROM_EMAIL` should be a verified domain email in Resend
- `NEXT_PUBLIC_APP_URL` is used for email links and should match your deployment URL
- Cloudflare R2 credentials can be obtained from your Cloudflare dashboard
- Paystack keys can be obtained from your [Paystack dashboard](https://dashboard.paystack.com)

### Database Setup

#### Neon Database Setup (Recommended for Production)

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string and add it to your `.env.local` as `DATABASE_URL`
4. The connection string format: `postgresql://user:password@hostname.neon.tech/dbname?sslmode=require`

#### Local PostgreSQL Setup (Development)

1. **Install PostgreSQL** (if not already installed)

2. **Create a database:**

```bash
createdb kracada_mvp
```

3. **Update your `.env.local`** with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/kracada_mvp
```

#### Run Migrations

After setting up your database connection:

```bash
# Generate migrations from schema changes
npm run db:generate

# Apply migrations to the database
npm run db:migrate

# Or push schema directly (development only, faster for prototyping)
npm run db:push

# Open Drizzle Studio (database GUI) to view/edit data
npm run db:studio
```

### Database Seeding

The project includes seed scripts to populate initial data:

1. **Seed Notification Preferences** (for existing users):

```bash
npm run db:seed:notifications
```

This creates default notification preferences for all existing users.

2. **Seed Super Admin** (must be first admin):

```bash
npm run db:seed:super-admin
```

This creates the default super admin user:

- **Email**: `admin@kracada.com` (or as configured in seed script)
- **Password**: Check the seed script for the default password
- **Role**: Super Admin

**⚠️ IMPORTANT:** Change the super admin credentials immediately after first login in production!

## Project Structure

```text
kracada-mvp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (group)
│   │   ├── login/                # User login page
│   │   ├── signup/               # User registration
│   │   ├── signup-confirmation/  # Email verification confirmation
│   │   ├── verify-email/         # Email verification handler
│   │   ├── forgot-password/      # Password reset request
│   │   ├── reset-password/       # Password reset form
│   │   └── actions.ts            # Auth server actions
│   ├── (dashboard)/              # Protected dashboard routes (group)
│   │   ├── dashboard/            # User dashboard
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── applications/     # Job applications
│   │   │   ├── job-posts/       # Job postings management
│   │   │   ├── bookmarks/       # User bookmarks
│   │   │   ├── hotels-restaurants/ # Hospitality management
│   │   │   └── my-cv-orders/    # CV optimization orders
│   │   └── actions/              # Dashboard server actions
│   │       ├── job-actions.ts
│   │       ├── cv-optimization-actions.ts
│   │       ├── lifestyle-management-actions.ts
│   │       └── ... (20+ action files)
│   ├── admin/                    # Admin dashboard routes
│   │   ├── login/               # Admin login
│   │   └── dashboard/           # Admin dashboard
│   │       ├── page.tsx         # Admin home
│   │       ├── users/           # User management
│   │       ├── admins/          # Admin management
│   │       ├── cv-review/       # CV optimization review
│   │       ├── payments/        # Payment management
│   │       ├── quizzes/         # Quiz management
│   │       ├── news/            # News management
│   │       └── content/         # Content moderation
│   ├── api/                     # API routes
│   │   ├── [...nextauth]/       # NextAuth API route
│   │   ├── auth/                # Auth-related endpoints
│   │   └── webhooks/            # Webhook handlers
│   │       └── paystack/        # Paystack webhook
│   ├── jobs/                    # Public job pages
│   ├── news/                    # Public news pages
│   ├── lifestyle/               # Lifestyle posts pages
│   ├── quiz/                    # Quiz pages
│   ├── cv-optimization/         # CV service pages
│   ├── hotels-restaurants/      # Hospitality pages
│   ├── entertainment/           # Entertainment pages
│   ├── travel-tourism/          # Travel pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── common/                  # Shared UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ... (shadcn/ui components)
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ConditionalLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── AuthSidebar.tsx
│   ├── providers/               # Context providers
│   │   ├── SessionProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── specific/                # Feature-specific components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── jobs/                # Job-related components
│   │   ├── lifestyle/           # Lifestyle post components
│   │   ├── news/                # News components
│   │   ├── quiz/                # Quiz components
│   │   └── ... (other feature components)
│   └── ui/                      # Additional UI components
├── lib/                          # Core libraries and utilities
│   ├── auth/                    # Authentication services
│   │   ├── auth-service.ts      # User authentication
│   │   ├── admin-auth-service.ts # Admin authentication
│   │   └── session-utils.ts     # Session management
│   ├── cloudflare/               # Cloudflare R2 upload service
│   │   └── upload-service.ts
│   ├── db/                       # Database configuration
│   │   ├── drizzle.ts           # Drizzle instance
│   │   ├── schema/              # Database schema files
│   │   │   ├── index.ts         # Schema exports
│   │   │   ├── users.ts
│   │   │   ├── admins.ts
│   │   │   ├── jobs.ts
│   │   │   ├── news.ts
│   │   │   ├── lifestyle-posts.ts
│   │   │   ├── quizzes.ts
│   │   │   ├── cv-optimization.ts
│   │   │   ├── hotels.ts
│   │   │   ├── restaurants.ts
│   │   │   └── ... (other schemas)
│   │   └── seed/                # Database seed scripts
│   ├── email/                   # Email service and templates
│   │   ├── email.service.ts
│   │   └── templates/           # React Email templates
│   ├── utils/                   # Utility functions
│   │   └── ... (utility files)
│   └── utils.ts                 # Shared utilities (cn, etc.)
├── migrations/                  # Database migrations
│   └── meta/                    # Migration metadata
├── docs/                        # Documentation files
│   ├── ADMIN-MODULE-GUIDE.md
│   ├── CV-REVIEW-ADMIN-IMPLEMENTATION.md
│   ├── CV-REVISION-FLOW.md
│   ├── lifestyle-posts-system.md
│   ├── QUIZ-SYSTEM-IMPLEMENTATION.md
│   ├── USER-MANAGEMENT-IMPLEMENTATION.md
│   └── ... (other docs)
├── public/                      # Static assets
│   └── images/                  # Public images
├── auth.ts                      # NextAuth configuration
├── auth.config.ts               # Auth config
├── middleware.ts                # Next.js middleware
├── drizzle.config.ts            # Drizzle configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## User Account Types

The platform supports four user account types:

### 1. **Job Seeker**

- Browse and apply for jobs
- Upload CV and cover letters
- Save/bookmark jobs
- Receive job notifications
- Create profile with skills and preferences

### 2. **Recruiter**

- Post job listings
- Manage job applications
- Review applications
- Update application statuses
- Access analytics (views, applicants)

### 3. **Business Owner**

- Post job listings (same as Recruiter)
- List hotels and restaurants
- Manage hospitality listings
- Receive reviews and ratings
- Manage business profile

### 4. **Contributor**

- Create lifestyle blog posts
- Use rich text editor (Tiptap)
- Upload images for posts
- Manage post status (draft, published, archived)
- Receive likes and comments on posts

## Admin System

The platform has a separate admin authentication system with two roles:

### **Super Admin**

- All admin permissions plus:
- Create new admin accounts
- Delete users
- Full system access

### **Admin**

- Manage users (activate, suspend, deactivate)
- Review CV optimization orders
- Create and manage quizzes
- Create and manage news posts
- Moderate content (flag/unflag posts)
- View payments and transactions
- Manage mailing list subscribers

### Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard home
- `/admin/dashboard/users` - User management
- `/admin/dashboard/admins` - Admin management (Super Admin only)
- `/admin/dashboard/cv-review` - CV optimization review
- `/admin/dashboard/payments` - Payment management
- `/admin/dashboard/quizzes` - Quiz management
- `/admin/dashboard/news` - News management
- `/admin/dashboard/content` - Content moderation

## Database Schema

### Core Tables

#### Users & Authentication

- **users**: User accounts with profiles, skills, CVs
- **admins**: Admin accounts (separate from users)
- **sessions**: User session tracking
- **password_reset_tokens**: Password reset tokens
- **email_verification_tokens**: Email verification tokens

#### Jobs

- **jobs**: Job postings
- **job_applications**: Job applications with status tracking
- **experiences**: User work experiences

#### Content

- **news_posts**: Admin-published news articles
- **news_post_likes**: News likes
- **news_comments**: News comments
- **lifestyle_posts**: Contributor blog posts
- **lifestyle_post_likes**: Lifestyle post likes
- **lifestyle_comments**: Lifestyle post comments

#### CV Optimization

- **cv_optimization_orders**: CV service orders
- **cv_payment_transactions**: Payment transaction details
- **cvs**: User CV files

#### Quizzes

- **quizzes**: Quiz definitions
- **quiz_questions**: Quiz questions
- **quiz_question_options**: Question options
- **quiz_attempts**: User quiz attempts
- **quiz_comments**: Quiz comments

#### Hospitality

- **hotels**: Hotel listings
- **restaurants**: Restaurant listings
- **reviews**: Reviews for hotels/restaurants

#### Other

- **bookmarks**: User bookmarks across content types
- **mailing_list_subscribers**: Newsletter subscribers
- **notification_preferences**: User notification settings
- **videos**: Video content

### Key Relationships

- Users → Jobs (employer relationship)
- Users → Job Applications (applicant relationship)
- Users → Lifestyle Posts (author relationship)
- Admins → News Posts (author relationship)
- Admins → Quizzes (creator relationship)
- Users → CV Optimization Orders (customer relationship)
- Users → Hotels/Restaurants (owner relationship)

### Important Enums

- **account_type**: `Job Seeker`, `Recruiter`, `Business Owner`, `Contributor`
- **user_status**: `Active`, `Suspended`, `Inactive`
- **admin_role**: `Super Admin`, `Admin`
- **admin_status**: `Active`, `Suspended`, `Inactive`
- **job_status**: `active`, `closed`
- **job_type**: `full-time`, `part-time`, `contract`, `internship`, `freelance`
- **job_location_type**: `remote`, `onsite`, `hybrid`
- **post_status**: `draft`, `published`, `flagged`, `archived`
- **news_status**: `draft`, `published`, `archived`
- **quiz_status**: `draft`, `published`, `archived`
- **quiz_difficulty**: `Beginner`, `Intermediate`, `Advanced`
- **package_type**: `deluxe`, `supreme`, `premium`
- **payment_status**: `pending`, `successful`, `failed`, `refunded`
- **order_status**: `pending_payment`, `payment_verified`, `cv_uploaded`, `in_progress`, `completed`, `cancelled`

## Key Modules

### Jobs Module

- **Files**: `app/(dashboard)/actions/job-actions.ts`, `components/specific/jobs/`
- **Features**: Job posting, applications, status tracking, bookmarks
- **Database**: `jobs`, `job_applications`, `experiences`

### Lifestyle Posts Module

- **Files**: `app/(dashboard)/actions/lifestyle-management-actions.ts`, `components/specific/lifestyle/`
- **Features**: Rich text editing, image uploads, categories, comments, likes
- **Database**: `lifestyle_posts`, `lifestyle_post_likes`, `lifestyle_comments`
- **Documentation**: `docs/lifestyle-posts-system.md`

### CV Optimization Module

- **Files**: `app/(dashboard)/actions/cv-optimization-actions.ts`, `app/cv-optimization/`
- **Features**: Package selection, Paystack payment, file uploads, order tracking
- **Database**: `cv_optimization_orders`, `cv_payment_transactions`, `cvs`
- **Documentation**: `docs/cv-optimization-implementation.md`, `docs/CV-REVIEW-ADMIN-IMPLEMENTATION.md`

### Quiz Module

- **Files**: `app/(dashboard)/actions/quiz-actions.ts`, `components/specific/quiz/`
- **Features**: Quiz creation, multiple-choice questions, scoring, attempts
- **Database**: `quizzes`, `quiz_questions`, `quiz_question_options`, `quiz_attempts`
- **Documentation**: `docs/QUIZ-SYSTEM-IMPLEMENTATION.md`

### News Module

- **Files**: `app/actions/news-actions.ts`, `components/specific/news/`
- **Features**: Admin-published articles, comments, likes, categories
- **Database**: `news_posts`, `news_post_likes`, `news_comments`

### Hotels & Restaurants Module

- **Files**: `app/(dashboard)/actions/hotels-restaurants-actions.ts`, `components/specific/hotels-restaurants/`
- **Features**: Business listings, amenities, reviews, image galleries
- **Database**: `hotels`, `restaurants`, `reviews`

### Mailing List Module

- **Files**: `app/(dashboard)/actions/mailing-list-actions.ts`
- **Features**: Newsletter subscriptions, source tracking, admin management
- **Database**: `mailing_list_subscribers`, `email_campaigns`
- **Documentation**: `docs/MAILING-LIST-IMPLEMENTATION.md`

## Authentication & Authorization

### Authentication Flow

The platform uses **NextAuth v5** with JWT strategy:

1. **User Login**:

   - User submits email and password at `/login`
   - Credentials validated against database (bcrypt password verification)
   - JWT token created with user payload (includes account type, email verified status)
   - Token stored in HTTP-only cookie

2. **Admin Login**:

   - Admin logs in at `/admin/login`
   - Separate authentication flow using `adminAuthService`
   - Session includes `isAdmin: true` and `adminRole`

3. **Session Management**:
   - User sessions tracked in `sessions` table
   - Session includes: user ID, user agent, IP address, expiry date
   - Last active timestamp updated on each request

### Middleware

The `middleware.ts` file handles:

- Route protection (redirects unauthenticated users)
- Admin route protection (redirects non-admins from `/admin/*`)
- Public route access (home, individual job/news/lifestyle pages)
- Auth page redirects (logged-in users redirected from login/signup)

### Protected Routes

**User Routes** (require authentication):

- `/dashboard/*` - User dashboard and actions

**Admin Routes** (require admin authentication):

- `/admin/*` - Admin dashboard and management

**Public Routes**:

- `/` - Home page
- `/jobs/*` - Job listings (individual pages)
- `/news/*` - News articles
- `/lifestyle/*` - Lifestyle posts
- `/quiz/*` - Quizzes
- `/cv-optimization` - CV service information

### Getting User Session

**Server Components/Server Actions**:

```typescript
import { auth } from "@/auth";

const session = await auth();
const userId = session?.user?.id;
const accountType = (session?.user as any)?.accountType;
const isAdmin = (session?.user as any)?.isAdmin;
```

**Client Components**:

```typescript
import { useSession } from "next-auth/react";

const { data: session } = useSession();
```

## Third-Party Integrations

### Cloudflare R2 (File Storage)

- **Purpose**: Store uploaded files (images, CVs, documents)
- **Service**: `lib/cloudflare/upload-service.ts`
- **Environment Variables**:
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_R2_ACCESS_KEY_ID`
  - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
  - `CLOUDFLARE_R2_BUCKET_NAME`
  - `CLOUDFLARE_R2_PUBLIC_URL`
- **Usage**: Images for posts, featured images, CV files, profile pictures
- **Documentation**: `lib/cloudflare/README.md`

### Paystack (Payments)

- **Purpose**: Process CV optimization payments
- **Integration**: `react-paystack` package
- **Webhook**: `/api/webhooks/paystack`
- **Environment Variables**:
  - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
  - `PAYSTACK_SECRET_KEY`
- **Events Handled**:
  - `charge.success` - Payment successful
  - `charge.failed` - Payment failed
- **Webhook URL**: `https://yourdomain.com/api/webhooks/paystack`

### Resend (Email)

- **Purpose**: Send transactional emails
- **Service**: `lib/email/email.service.ts`
- **Environment Variables**:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- **Email Types**:
  - Welcome/verification emails
  - Password reset emails
  - Password changed notifications
  - Order confirmations (future)

## Development Workflow

### Making Schema Changes

1. **Modify schema files** in `lib/db/schema/`
2. **Generate migration:**

```bash
npm run db:generate
```

3. **Review generated migration** in `migrations/` directory
4. **Apply migration:**

```bash
npm run db:migrate
```

**Note**: For development, you can use `npm run db:push` to push schema directly without creating migration files (faster, but not recommended for production).

### Creating New Features

1. **Create database schema** (if needed) in `lib/db/schema/[feature].ts`
2. **Export from schema/index.ts**
3. **Generate and run migration**
4. **Create server actions** in `app/(dashboard)/actions/[feature]-actions.ts`
5. **Create UI components** in `components/specific/[feature]/`
6. **Create pages** in `app/[feature]/` or `app/(dashboard)/dashboard/[feature]/`
7. **Add routes to middleware** if authentication is required

### Code Style

- Use TypeScript for all new code
- Follow existing file structure patterns
- Use server actions for data mutations (no API routes unless necessary)
- Use React Server Components by default, Client Components only when needed
- Use Zod for form validation
- Use Drizzle ORM for all database operations

### File Upload Pattern

```typescript
import { cloudflareUploadService } from "@/lib/cloudflare/upload-service";

// Upload file
const result = await cloudflareUploadService.uploadFile({
  file: formData.get("file") as File,
  folder: "featured-images", // folder path in R2
  allowedTypes: ["image/jpeg", "image/png"],
  maxSize: 5 * 1024 * 1024, // 5MB
});

// Delete file
await cloudflareUploadService.deleteFile(fileKey);
```

## Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (if configured)

### Database Scripts

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply migrations to database
- `npm run db:push` - Push schema directly (development only, faster)
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:drop` - Drop database (use with caution)

### Seeding Scripts

- `npm run db:seed:notifications` - Seed notification preferences for users
- `npm run db:seed:super-admin` - Seed super admin user

## Troubleshooting

### Database Connection Issues

**Error**: "Database URL not found"

- Ensure `.env.local` has `DATABASE_URL` set
- Check PostgreSQL is running (local) or Neon connection is valid
- Verify connection string format

**Error**: "Connection timeout"

- Verify database credentials
- Check network connectivity
- For Neon, ensure you're using the correct connection string

### Migration Issues

**Error**: "Migration conflicts"

- Review migration files in `migrations/` directory
- Ensure database is up to date: `npm run db:migrate`
- For development, you can reset: `npm run db:drop` (then recreate and migrate)

### Authentication Issues

**Error**: "Invalid token" or session not working

- Clear browser cookies
- Check `AUTH_SECRET` is set in environment variables
- Ensure token hasn't expired
- Verify `AUTH_URL` matches your deployment URL
- **Restart dev server** after changing environment variables

### File Upload Issues

**Error**: "Cloudflare R2 is not configured"

- Verify all Cloudflare R2 environment variables are set
- Check `CLOUDFLARE_R2_PUBLIC_URL` is accessible
- Verify bucket permissions and CORS settings
- See `lib/cloudflare/README.md` for setup guide

### Payment Issues

**Error**: "Paystack payment failed"

- Verify Paystack keys are correct (test vs live)
- Check webhook URL is configured in Paystack dashboard
- Ensure webhook handler is accessible: `/api/webhooks/paystack`
- Review webhook logs in Paystack dashboard

### Email Issues

**Error**: "Failed to send email"

- Verify `RESEND_API_KEY` is correct
- Check `RESEND_FROM_EMAIL` is verified in Resend dashboard
- Ensure domain is verified in Resend
- Check Resend API quota/limits

### Build Issues

**Error**: TypeScript errors

- Run `npm run build` to see specific errors
- Ensure all environment variables are set
- Check `tsconfig.json` paths are correct
- Verify all imports are valid

### Server Actions Body Size Limit

**Error**: "Body exceeded 1 MB limit"

- Current limit is 6MB (configured in `next.config.ts`)
- For larger uploads, consider client-side upload to R2 instead
- **Restart dev server** after changing `next.config.ts`

### Port Already in Use

**Error**: "Port 3000 already in use"

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

## Documentation

Comprehensive documentation for specific features is available in the `docs/` directory:

- **ADMIN-MODULE-GUIDE.md** - Admin dashboard implementation
- **ADMIN-AESTHETICS-UPDATE.md** - Admin UI styling guide
- **CV-REVIEW-ADMIN-IMPLEMENTATION.md** - CV optimization admin features
- **CV-REVISION-FLOW.md** - CV revision process documentation
- **cv-optimization-implementation.md** - CV optimization feature guide
- **lifestyle-posts-system.md** - Lifestyle posts system documentation
- **LIFESTYLE-SETUP-GUIDE.md** - Lifestyle posts setup instructions
- **QUIZ-SYSTEM-IMPLEMENTATION.md** - Quiz system documentation
- **USER-MANAGEMENT-IMPLEMENTATION.md** - User management guide
- **MAILING-LIST-IMPLEMENTATION.md** - Mailing list system guide
- **tiptap-editor-implementation.md** - Rich text editor guide
- **UI-COMPONENTS-SETUP.md** - UI components setup
- **RESTART-DEV-SERVER.md** - When to restart dev server

## Additional Notes

### Image Upload Limits

- **Featured images**: Up to 5MB
- **Editor images**: Up to 3MB
- **Profile pictures**: Up to 2MB
- **CV files**: Up to 10MB (for CV optimization)

### Session Management

- User sessions expire after 30 days
- Admin sessions use same expiry (configurable)
- Session activity tracked in `sessions` table
- Last active timestamp updated on authenticated requests

### Notification System

- Users can customize notification preferences
- Notification types: in-app, email, or none
- Categories: alerts, jobs, articles, news
- Events: password changes, new sign-ins, job updates, article interactions

### Environment-Specific Behavior

- Development: Uses `.env.local` file
- Production: Uses environment variables from hosting platform
- **Important**: Always restart dev server after changing environment variables

### Security Considerations

- Passwords hashed with bcryptjs
- JWT tokens stored in HTTP-only cookies
- File uploads validated for type and size
- CSRF protection via NextAuth
- SQL injection protection via Drizzle ORM
- XSS protection via React's built-in escaping

### Performance Optimizations

- Server-side rendering for SEO
- Image optimization via Next.js Image component
- Database indexes on frequently queried columns
- Pagination for large datasets
- Caching strategy (can be enhanced)

## Support & Contributing

When adding new features:

1. Follow the existing project structure
2. Update TypeScript types as needed
3. Add proper error handling
4. Include permission checks for protected operations
5. Write documentation for complex features
6. Update this README if adding major features
7. Test with both user and admin accounts
8. Ensure mobile responsiveness

## License

[Add your license information here]

---

**Note**: This README is comprehensive and should provide all necessary context for new developers joining the project. For specific feature details, refer to the documentation in the `docs/` directory or reach out to the development team.

**Last Updated**: [Current Date]
