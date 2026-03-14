# CV Review Admin Implementation

## Overview

This document outlines the complete implementation of the CV Review functionality in the admin dashboard.

## Features Implemented

### 1. Admin Layout Updates

- **Removed Header/Footer**: Admin routes now use a clean, dedicated layout without the main site header and footer
- **Full Screen Layout**: The admin dashboard uses the full viewport with the AdminSidebar handling all navigation

### 2. CV Review Page (`/admin/dashboard/cv-review`)

#### Display Features

- **Live Data Table**: Shows all CV optimization orders from the database
- **Statistics Dashboard**:

  - Total Orders count
  - In Progress count
  - Completed count
  - Pending (In Review) count

- **Order Information Displayed**:
  - User's Full Name
  - User's Email
  - Package Type (Deluxe, Supreme, Premium)
  - Revisions (Used/Max)
  - Submission Date
  - Current Status
  - Action Buttons

#### Search & Filter

- **Search**: By user name, email, or order ID
- **Status Filter**: Filter by order status
  - All Statuses
  - In Review (cv_uploaded)
  - In Progress
  - Completed
  - Cancelled

#### Status Management

The system supports 6 order statuses:

1. **pending_payment** - Order created but payment not verified
2. **payment_verified** - Payment successful, awaiting CV upload
3. **cv_uploaded** - User uploaded CV, ready for review (shows as "In Review")
4. **in_progress** - Admin is working on optimization
5. **completed** - Optimized CV uploaded and delivered
6. **cancelled** - Order cancelled

#### Actions Available

##### 1. Download Original CV

- **Icon**: Download icon
- **Action**: Downloads the user's original uploaded CV
- **Enabled**: Only when `cvFileUrl` exists

##### 2. Upload Optimized CV

- **Icon**: Upload icon
- **Action**: Opens modal to upload the optimized CV
- **Process**:
  1. Click upload button
  2. Select file (PDF or DOCX)
  3. Upload to Cloudflare
  4. Automatically sets order status to "completed"
  5. User can now download their optimized CV

##### 3. View Optimized CV

- **Icon**: Eye icon (green)
- **Action**: Opens optimized CV in new tab
- **Visible**: Only after optimized CV is uploaded

##### 4. Status Menu (3-dot menu)

Options:

- Set as In Progress
- Mark as Completed
- Cancel Order

## Database Schema

The implementation uses the existing `cv_optimization_orders` table with these key fields:

```typescript
{
  id: string;
  userId: string;
  packageType: "deluxe" | "supreme" | "premium";
  packageName: string;
  packagePrice: string;
  paymentStatus: "pending" | "successful" | "failed" | "refunded";
  orderStatus: "pending_payment" |
    "payment_verified" |
    "cv_uploaded" |
    "in_progress" |
    "completed" |
    "cancelled";
  cvFileUrl: string | null; // Original CV from user
  cvFileKey: string | null; // Cloudflare key for original CV
  optimizedCvUrl: string | null; // Optimized CV uploaded by admin
  maxRevisions: number;
  revisionsUsed: number;
  estimatedDeliveryDays: number;
  customerNotes: string | null; // Notes from user
  adminNotes: string | null; // Notes from admin
  createdAt: Date;
  updatedAt: Date;
}
```

## Server Actions

### 1. `getAllCVOrdersAction()`

- **Purpose**: Fetch all CV orders with user details
- **Authorization**: Requires admin authentication
- **Returns**: Array of orders with user information
- **Includes**: JOIN with users table for email and full name

### 2. `updateOrderStatusAction(orderId, status, adminNotes?)`

- **Purpose**: Update order status and admin notes
- **Authorization**: Requires admin authentication
- **Revalidates**: CV review page for immediate UI update
- **Parameters**:
  - `orderId`: Order to update
  - `status`: New status
  - `adminNotes`: Optional admin notes

### 3. `uploadOptimizedCVAction(orderId, formData)`

- **Purpose**: Upload optimized CV to Cloudflare
- **Process**:
  1. Validate admin authentication
  2. Extract file from formData
  3. Upload to Cloudflare under `optimized-cvs/` directory
  4. Update order with `optimizedCvUrl`
  5. Set order status to "completed"
- **Authorization**: Requires admin authentication
- **Revalidates**: CV review page

### 4. `getOrderDetailsAction(orderId)`

- **Purpose**: Get single order details with user info
- **Authorization**: Requires admin authentication
- **Returns**: Complete order information

## User Flow

### Admin Workflow

1. **Review Queue**: Admin sees all orders in "In Review" status (cv_uploaded)
2. **Download CV**: Admin downloads user's original CV
3. **Optimize**: Admin makes improvements offline
4. **Upload**: Admin uploads the optimized CV through the UI
5. **Completion**: System automatically marks order as completed
6. **User Notification**: User can now download their optimized CV

### User Workflow

1. **Purchase Package**: User selects and pays for a package
2. **Upload CV**: User uploads their CV with optional notes
3. **Wait**: Order shows as "In Review"
4. **Download**: Once completed, user can download optimized CV from success page or dashboard

## File Upload Configuration

### Accepted File Types

- PDF (`.pdf`)
- Microsoft Word (`.docx`)

### File Size Limit

- Maximum 10MB per file

### Storage

- **Service**: Cloudflare R2
- **Original CVs**: Stored with user ID prefix
- **Optimized CVs**: Stored in `optimized-cvs/` directory with format:
  ```
  optimized-cvs/{orderId}_{timestamp}_{filename}
  ```

## UI Components Used

### From shadcn/ui

- `Dialog` - For upload modal
- `DropdownMenu` - For status actions
- `Button` - Various CTAs
- `Input` - File upload and search
- `Spinner` - Loading states

### Custom Components

- `CVReviewContent` - Main table and logic
- Status badges with colored indicators
- Responsive table layout

## Responsive Design

- **Mobile**: Single column layout with horizontal scroll for table
- **Tablet**: Optimized grid for stats cards
- **Desktop**: Full table view with all columns visible

## Security

### Authorization

- All actions require admin authentication
- `requireAdmin()` helper function redirects non-admins
- User-specific order access in user actions

### Data Validation

- File type validation on upload
- File size limits enforced
- Admin status verified on all mutations

## Error Handling

- Toast notifications for all actions
- Graceful error messages
- Console logging for debugging
- Fallback UI for empty states

## Performance Optimizations

- Server-side data fetching
- Revalidation only on mutations
- Efficient JOIN queries
- Background file uploads

## Future Enhancements (Recommended)

1. **Email Notifications**: Notify users when CV is completed
2. **Revision System**: Track and manage revision requests
3. **Admin Notes**: Add notes visible only to admins
4. **Batch Actions**: Bulk status updates
5. **Analytics**: Track average completion time
6. **File Preview**: In-browser CV preview
7. **Chat System**: Direct communication with users
8. **Template Management**: Save and reuse CV templates

## Testing Checklist

- [ ] Admin can view all CV orders
- [ ] Search and filter work correctly
- [ ] Download original CV works
- [ ] Upload optimized CV works
- [ ] Status updates reflect immediately
- [ ] User can download optimized CV after completion
- [ ] File type validation works
- [ ] Only admins can access
- [ ] Mobile responsive layout works
- [ ] Dark mode styling is correct

## Related Files

- `/app/admin/dashboard/cv-review/page.tsx` - Page wrapper
- `/app/admin/dashboard/cv-review/CVReviewContent.tsx` - Main component
- `/app/admin/dashboard/cv-review/actions.ts` - Server actions
- `/lib/db/schema/cv-optimization.ts` - Database schema
- `/components/layout/ConditionalLayout.tsx` - Layout routing
- `/app/(dashboard)/actions/cv-optimization-actions.ts` - User actions

## Environment Variables Required

```env
# Cloudflare R2 (already configured)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET_NAME=your_bucket_name
CLOUDFLARE_PUBLIC_URL=your_public_url

# Paystack (already configured)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_public_key
PAYSTACK_SECRET_KEY=your_secret_key
```

## Maintenance Notes

- Regularly monitor completed orders
- Archive old orders periodically
- Monitor Cloudflare storage usage
- Review and update package pricing as needed
