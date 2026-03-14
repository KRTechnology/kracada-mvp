# Admin Module Implementation Guide

## Overview

This document describes the implementation of the Admin Module for the Kracada MVP application. The module provides a separate administrative interface for managing the platform.

## Features Implemented

### 1. Database Schema

- **Admins Table**: Separate table for admin users with the following fields:
  - `id`: Unique identifier
  - `firstName`: Admin's first name
  - `lastName`: Admin's last name
  - `email`: Unique email address
  - `passwordHash`: Encrypted password
  - `role`: Admin role (Super Admin or Admin)
  - `createdAt`: Timestamp of creation
  - `updatedAt`: Timestamp of last update
  - `lastLoginAt`: Timestamp of last login

### 2. Authentication

- **Separate Admin Authentication**: Admins authenticate using the same NextAuth setup but with a special flag (`isAdmin: true`)
- **Role-Based Access Control**: Two admin roles:
  - **Super Admin**: Can create new admins
  - **Admin**: Standard admin privileges
- **Session Management**: Admin sessions are tracked separately from regular users

### 3. Admin Login

- **Route**: `/admin/login`
- **Features**:
  - Clean, centered login form
  - Email and password fields
  - "Remember for 30 days" checkbox
  - Show/hide password toggle
  - Form validation with Zod
  - Loading states during authentication
  - Dark mode support

### 4. Admin Dashboard

- **Route**: `/admin/dashboard/*`
- **Layout**: Fixed sidebar with main content area
- **Features**:
  - Responsive design (desktop and mobile)
  - Dark mode support
  - Mobile hamburger menu with slide-in navigation
  - User profile section with online indicator
  - Quick sign-out button

### 5. Sidebar Navigation

The admin dashboard includes the following sections:

1. **Admin Management** - Create and manage admin accounts
2. **CV Review** - Review CV submissions (placeholder)
3. **User Management** - Manage platform users (placeholder)
4. **Content Management** - Moderate content (placeholder, shows badge: 8)
5. **Payment & Transactions** - View payments (placeholder)
6. **Business Listings** - Manage listings (placeholder)
7. **Customer Support** - Handle support requests (placeholder)
8. **Analytics & Report** - View analytics (placeholder)
9. **Hotel, Restaurant, or Travel Agency** - Hospitality listings (placeholder)
10. **Mailing List** - Manage subscribers (placeholder)
11. **Quizzes** - Manage quizzes (placeholder)

### 6. Admin Management Page

- **Route**: `/admin/dashboard/admin-management`
- **Features**:
  - Create new admin accounts (Super Admin only)
  - Form fields: First Name, Last Name, Company Email
  - Auto-generated temporary passwords
  - Copy-to-clipboard functionality for credentials
  - Success dialog displaying credentials
  - Form validation and error handling
  - Dark mode support

## Access Control

### Route Protection

1. **Non-logged-in users accessing `/admin/*`**:

   - Redirected to `/admin/login`
   - Exception: `/admin/login` is accessible

2. **Logged-in regular users accessing `/admin/*`**:

   - Redirected to home page (`/`)

3. **Logged-in admins**:
   - Full access to all admin routes
   - If trying to access `/admin/login`, redirected to `/admin/dashboard`

### Middleware Configuration

The middleware protects the following routes:

- `/admin/:path*` (all admin routes)
- Admin login is handled separately

## Super Admin Credentials

A super admin is seeded in the database with the following credentials:

- **Email**: `super-admin@kimberly-ryan.net`
- **Password**: `Password@123`
- **Role**: Super Admin

### Seeding Super Admin

To seed the super admin, run:

```bash
npm run db:seed:super-admin
```

## Technical Implementation

### Server Actions

Located at `app/admin/dashboard/actions.ts`:

- `createAdminAction`: Creates a new admin (Super Admin only)
- `getAllAdminsAction`: Retrieves all admins

### Components

1. **AdminSidebar** (`components/layout/AdminSidebar.tsx`):

   - Desktop and mobile navigation
   - Theme toggle (toggle button variant)
   - User profile section
   - Sign-out functionality

2. **AdminLoginForm** (`app/admin/login/AdminLoginForm.tsx`):

   - Admin login form with validation
   - NextAuth integration with admin flag

3. **CreateAdminForm** (`app/admin/dashboard/admin-management/CreateAdminForm.tsx`):
   - Form to create new admins
   - Password generation and display
   - Copy-to-clipboard functionality

### Theme Toggle Enhancement

Added new `toggle` variant to `ThemeToggle` component:

- Toggle button for light/dark mode
- Used in admin sidebar
- Maintains consistency with existing theme system

## Mobile Responsiveness

- **Desktop**: Fixed sidebar (256px width) with scrollable main content
- **Mobile**:
  - Top header with logo and hamburger menu
  - Slide-in sidebar with backdrop
  - Full-height mobile menu
  - Touch-friendly interface
  - Animated transitions using Framer Motion

## Dark Mode Support

- All admin pages support dark mode
- Toggle switch in sidebar settings section
- Consistent color scheme with the main application:
  - Light backgrounds: `bg-white`, `bg-neutral-50`
  - Dark backgrounds: `bg-neutral-900`, `bg-neutral-800`
  - Borders: `border-neutral-200` / `border-neutral-800`
  - Text: `text-neutral-900` / `text-neutral-100`

## Security Considerations

1. **Separate Authentication**: Admins use a separate authentication flow
2. **Role-Based Permissions**: Super Admin vs Admin distinction
3. **Password Security**: Bcrypt hashing with salt
4. **Session Isolation**: Admin sessions don't interfere with user sessions
5. **Middleware Protection**: All admin routes are protected at the middleware level

## Future Enhancements

The following sections are currently placeholders and can be implemented:

1. CV Review system

2. User management (view, edit, suspend users)
3. Content moderation tools
4. Payment transaction logs
5. Business listing management
6. Customer support ticketing system
7. Analytics dashboard with charts
8. Hospitality listing management
9. Email campaign management
10. Quiz creation and management

## Development Notes

- All page components are server components by default
- Client components are used only when necessary (forms, interactive elements)
- Server actions are preferred over API routes
- Consistent styling using Tailwind CSS
- Animations using Framer Motion
- Form validation using React Hook Form + Zod
- UI components from shadcn/ui

## Testing the Implementation

1. **Login as Super Admin**:

   ```text
   Email: super-admin@kimberly-ryan.net
   Password: Password@123
   ```

2. **Create a New Admin**:

   - Navigate to Admin Management
   - Fill in the form (First Name, Last Name, Email)
   - Submit and copy the generated credentials
   - Use those credentials to log in as the new admin

3. **Test Access Control**:
   - Try accessing admin routes as a regular user (should redirect to home)
   - Try accessing admin routes while logged out (should redirect to login)
   - Verify mobile menu works on small screens
   - Test dark mode toggle

## Files Created/Modified

### New Files

- `lib/db/schema/admins.ts` - Admin schema
- `lib/auth/admin-auth-service.ts` - Admin authentication service
- `lib/db/seed/seed-super-admin.ts` - Super admin seed script
- `app/admin/login/page.tsx` - Admin login page
- `app/admin/login/AdminLoginForm.tsx` - Admin login form
- `app/admin/dashboard/layout.tsx` - Admin dashboard layout
- `app/admin/dashboard/page.tsx` - Admin dashboard root
- `app/admin/dashboard/actions.ts` - Admin server actions
- `app/admin/dashboard/admin-management/page.tsx` - Admin management page
- `app/admin/dashboard/admin-management/CreateAdminForm.tsx` - Create admin form
- `app/admin/dashboard/*/page.tsx` - Placeholder pages (10 routes)
- `components/layout/AdminSidebar.tsx` - Admin sidebar component

### Modified Files

- `auth.ts` - Added admin authentication logic
- `auth.config.ts` - Added admin route protection
- `middleware.ts` - Added admin routes to matcher
- `lib/db/schema/index.ts` - Exported admin schema
- `components/common/ThemeToggle.tsx` - Added toggle variant
- `package.json` - Added seed script
- `migrations/0014_ordinary_rocket_racer.sql` - Admin table migration

## Conclusion

The admin module is now fully functional with authentication, role-based access control, and a comprehensive dashboard structure. The implementation follows Next.js 15 best practices, maintains consistency with the existing codebase, and provides a solid foundation for future administrative features.
