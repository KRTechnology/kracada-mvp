# User Management Module - Implementation Guide

## 📋 Overview

The User Management module is a comprehensive admin dashboard feature that allows administrators to view, manage, and perform actions on both regular users and admin accounts. This module features a beautiful, modern UI consistent with the rest of the admin dashboard.

## 🎨 Visual Design

### Design Consistency

- **Gradient Headers**: Warm gradient from `warm-200` to `warm-800` with decorative floating circles
- **Tabs**: Modern tab interface with badges showing counts
- **Tables**: Clean, responsive tables with gradient headers
- **Filters**: Styled search and filter inputs with warm color focus states
- **Action Buttons**: Gradient buttons and dropdown menus
- **Status Badges**: Color-coded badges for Active, Suspended, and Inactive states
- **Mobile Responsive**: Fully responsive design for all screen sizes
- **Dark Mode**: Complete dark mode support

## 🚀 Features

### 1. **Multi-Tab Interface**

#### For All Admins:

- **All Users**: View all registered users
- **Businesses**: Filter for Business Owner accounts
- **Reported & Flagged Accounts**: (Placeholder for future implementation)

#### For Super Admins Only:

- **Admin Management**: View and manage admin accounts

### 2. **User Table Features**

#### Displayed Information:

- Full Name
- Email Address
- Creation Date (formatted as "11th May 2025")
- Account Type (Job Seeker, Recruiter, Business Owner, Contributor)
- Status (Active, Suspended, Inactive)
- Actions Menu

#### Available Actions (All Admins):

- **Activate**: Set user status to Active
- **Suspend**: Set user status to Suspended
- **Deactivate**: Set user status to Inactive

#### Available Actions (Super Admins Only):

- **Delete User**: Permanently remove user from the system (with confirmation dialog)

### 3. **Admin Table Features**

#### Displayed Information:

- Admin Name (First + Last Name)
- Email Address
- Role (Super Admin or Admin)
- Status (Active, Suspended, Inactive)
- Last Login Date
- Actions Menu

#### Available Actions:

- **Activate/Suspend**: Change admin status
- **Promote to Super Admin**: Upgrade regular admin to Super Admin
- **Demote to Admin**: Downgrade Super Admin to regular Admin
- **Delete Admin**: Permanently remove admin (with confirmation dialog)

#### Safety Features:

- Super Admins cannot delete themselves
- Super Admins cannot change their own role
- Only Super Admins can manage other admins

### 4. **Search & Filter**

#### Search:

- Real-time search across:
  - **Users**: Full Name and Email
  - **Admins**: First Name, Last Name, and Email

#### Filters:

- **Status Filter**: All Status, Active, Suspended, Inactive
- **Account Type Filter** (Users only): All Types, Job Seeker, Recruiter, Business Owner, Contributor

### 5. **Pagination**

- 10 results per page (configurable)
- Previous/Next navigation
- Page number buttons (up to 5 pages shown)
- Total count display
- Current page tracking

### 6. **Export Functionality**

- Export button with download icon
- Ready for CSV/Excel export implementation

## 📊 Database Schema

### Users Table Enhancement

```typescript
// Added to users.ts
export const userStatusEnum = pgEnum("user_status", [
  "Active",
  "Suspended",
  "Inactive",
]);

// Added to users table
status: userStatusEnum("status").default("Active").notNull(),
```

### Admins Table Enhancement

```typescript
// Added to admins.ts
export const adminStatusEnum = pgEnum("admin_status", [
  "Active",
  "Suspended",
  "Inactive",
]);

// Added to admins table
status: adminStatusEnum("status").default("Active").notNull(),
```

## 🔒 Security & Authorization

### Access Levels

1. **Regular Admin**:

   - Can view and manage regular users
   - Can change user status (Active, Suspended, Inactive)
   - **Cannot** delete users
   - **Cannot** access Admin Management tab

2. **Super Admin**:
   - All Regular Admin permissions
   - Can delete users
   - Can view, create, and manage admin accounts
   - Can promote/demote admin roles
   - Can delete other admins (not themselves)
   - Cannot change their own role or delete themselves

### Authorization Helpers

```typescript
// Check if user is an admin (any level)
async function requireAdmin() {
  const session = await auth();
  if (!session || !(session.user as any)?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

// Check if user is a Super Admin
async function requireSuperAdmin() {
  const session = await auth();
  if (
    !session ||
    !(session.user as any)?.isAdmin ||
    (session.user as any)?.adminRole !== "Super Admin"
  ) {
    throw new Error("Unauthorized: Super Admin access required");
  }
  return session;
}
```

## 🛠️ Server Actions

### User Management Actions

#### `getAllUsersAction(filters: UserFilters)`

Fetches paginated list of users with optional filters.

**Parameters**:

```typescript
{
  search?: string;        // Search by name or email
  status?: string;        // Filter by status
  accountType?: string;   // Filter by account type
  page?: number;          // Current page (default: 1)
  limit?: number;         // Items per page (default: 10)
}
```

**Returns**:

```typescript
{
  success: boolean;
  users: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  counts: {
    total: number;
    jobSeekers: number;
    recruiters: number;
    businessOwners: number;
    contributors: number;
  };
}
```

#### `updateUserStatusAction(userId: string, newStatus: "Active" | "Suspended" | "Inactive")`

Updates the status of a user.

#### `deleteUserAction(userId: string)`

Permanently deletes a user. Requires Super Admin access.

### Admin Management Actions

#### `getAllAdminsAction(filters: AdminFilters)`

Fetches paginated list of admins with optional filters.

**Parameters**:

```typescript
{
  search?: string;   // Search by name or email
  status?: string;   // Filter by status
  role?: string;     // Filter by role
  page?: number;     // Current page
  limit?: number;    // Items per page
}
```

**Returns**:

```typescript
{
  success: boolean;
  admins: Admin[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  counts: {
    total: number;
    superAdmins: number;
    regularAdmins: number;
  };
}
```

#### `updateAdminStatusAction(adminId: string, newStatus: "Active" | "Suspended" | "Inactive")`

Updates the status of an admin.

#### `updateAdminRoleAction(adminId: string, newRole: "Super Admin" | "Admin")`

Changes an admin's role. Prevents self-demotion.

#### `deleteAdminAction(adminId: string)`

Permanently deletes an admin. Prevents self-deletion.

## 📁 File Structure

```
app/admin/dashboard/user-management/
├── page.tsx                    # Server component with gradient header
├── UserManagementContent.tsx   # Client component with full UI
└── actions.ts                  # Server actions for data fetching and mutations

lib/db/schema/
├── users.ts                    # Enhanced with status enum
└── admins.ts                   # Enhanced with status enum

docs/
└── USER-MANAGEMENT-IMPLEMENTATION.md  # This file
```

## 🎯 Component Breakdown

### `page.tsx` (Server Component)

- Gradient header with icon
- Suspense boundary with loading state
- Renders `UserManagementContent`

### `UserManagementContent.tsx` (Client Component)

#### State Management:

- `activeTab`: Current tab selection
- `users/admins`: Data arrays
- `loading`: Loading state
- `search`: Search query
- `statusFilter`: Status filter value
- `accountTypeFilter`: Account type filter value
- `currentPage`: Current pagination page
- `deleteDialogOpen`: Delete confirmation dialog state

#### Sub-Components:

- `UsersTable`: Displays user data with actions
- `AdminsTable`: Displays admin data with actions

#### Features:

- Real-time search with debouncing
- Dynamic filtering
- Pagination controls
- Action dropdowns
- Delete confirmation dialogs
- Toast notifications for feedback

## 🎨 UI Components Used

### shadcn/ui Components:

- `DropdownMenu`: Action menus
- `AlertDialog`: Delete confirmations
- Custom styled inputs and selects

### Icons (lucide-react):

- `Users`: All Users tab
- `Briefcase`: Businesses tab
- `Flag`: Reported accounts tab
- `UserCog`: Admin Management tab
- `Search`: Search input
- `Download`: Export button
- `MoreVertical`: Actions menu
- `CheckCircle`: Active status / Activate action
- `XCircle`: Inactive/Suspended status
- `Trash2`: Delete action
- `Shield`: Super Admin role indicator
- `ChevronLeft/Right`: Pagination arrows

## 🔄 Data Flow

1. **Component Mount**: `useEffect` triggers `fetchData()`
2. **Fetch Data**: Calls appropriate action based on `activeTab`
3. **Display Data**: Populates table with results
4. **User Interaction**: Search, filter, or action triggered
5. **State Update**: React state updates
6. **Re-fetch**: `useEffect` dependency triggers new fetch
7. **UI Update**: Table refreshes with new data
8. **Feedback**: Toast notification confirms action

## 🚦 Status Management

### User/Admin Statuses:

1. **Active** (Green badge with checkmark):

   - User/Admin can access the platform
   - Full functionality enabled

2. **Suspended** (Red badge with X):

   - Temporary restriction
   - Account blocked but data retained
   - Can be reactivated

3. **Inactive** (Grey badge with X):
   - Account disabled
   - May indicate voluntary deactivation
   - Can be reactivated

## 📱 Responsive Design

### Mobile Optimizations:

- Horizontal scrolling for tables on small screens
- Stacked filter controls
- Hidden text on small export button (icon only)
- Responsive padding and spacing
- Touch-friendly button sizes

## 🌙 Dark Mode Support

All components fully support dark mode:

- Background colors: `dark:bg-neutral-800`, `dark:bg-neutral-900`
- Text colors: `dark:text-neutral-100`, `dark:text-neutral-400`
- Border colors: `dark:border-neutral-700`
- Hover states: `dark:hover:bg-neutral-800`
- Gradient adjustments for dark backgrounds

## 🔮 Future Enhancements

1. **Reported & Flagged Accounts**:

   - Add `isReported` flag to users table
   - Implement reporting system
   - Show count in "Reported & Flagged Accounts" tab

2. **Export Functionality**:

   - CSV export implementation
   - Excel export with formatting
   - PDF reports

3. **Bulk Actions**:

   - Select multiple users/admins
   - Bulk status changes
   - Bulk delete (with confirmation)

4. **Advanced Filters**:

   - Date range filters
   - Email verification status
   - Profile completion status
   - Last login date

5. **User Details Modal**:

   - Click on user to view full details
   - Edit user information
   - View user activity logs

6. **Analytics**:

   - User growth charts
   - Account type distribution
   - Status distribution charts

7. **Email Notifications**:
   - Notify users when status changes
   - Send suspension/reactivation emails

## ✅ Testing Checklist

### Functionality:

- [ ] All users display correctly
- [ ] Search works across name and email
- [ ] Status filter updates results
- [ ] Account type filter updates results
- [ ] Pagination navigates correctly
- [ ] Status changes save and reflect immediately
- [ ] Delete confirmation shows before deletion
- [ ] Super Admin can access Admin Management tab
- [ ] Regular Admin cannot access Admin Management tab
- [ ] Super Admin cannot delete themselves
- [ ] Super Admin cannot change their own role

### UI/UX:

- [ ] Gradient header displays correctly
- [ ] Tabs highlight active state
- [ ] Badges show correct counts
- [ ] Tables are responsive on mobile
- [ ] Action dropdowns work correctly
- [ ] Toast notifications appear after actions
- [ ] Loading states show during data fetch
- [ ] Dark mode renders correctly

### Security:

- [ ] Non-admin users cannot access the page
- [ ] Regular admins have limited permissions
- [ ] Super Admins have full permissions
- [ ] Authorization errors are handled gracefully

## 📚 Related Documentation

- [Admin Module Guide](./ADMIN-MODULE-GUIDE.md)
- [Admin Aesthetics Update](./ADMIN-AESTHETICS-UPDATE.md)
- [CV Review Implementation](./CV-REVIEW-ADMIN-IMPLEMENTATION.md)

## 🎉 Summary

The User Management module is a fully-featured admin dashboard page that enables comprehensive user and admin account management. It maintains the beautiful warm aesthetic established in other admin pages, provides robust search and filtering capabilities, and implements proper role-based access control for security.

Key highlights:
✅ Beautiful, modern UI with warm gradients
✅ Responsive design for all devices
✅ Full dark mode support
✅ Role-based access control
✅ Real-time search and filtering
✅ Pagination for large datasets
✅ Comprehensive action menus
✅ Safety features to prevent accidental deletions
✅ Toast notifications for user feedback
✅ Consistent with existing admin aesthetic
