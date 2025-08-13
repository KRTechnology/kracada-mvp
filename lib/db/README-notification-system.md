# Notification Preferences System

## Overview

This system manages user notification preferences for different types of activities across the application. It's designed to be scalable and differentiate from future in-app notifications.

## Database Schema

### Tables

#### 1. `default_notification_preferences`

Stores the default notification preferences that new users inherit.

**Columns:**

- `id`: Primary key (CUID2)
- `category`: Notification category (alerts, jobs, articles, news)
- `event`: Specific notification event
- `none_enabled`: Whether "none" is enabled by default
- `in_app_enabled`: Whether in-app notifications are enabled by default
- `email_enabled`: Whether email notifications are enabled by default
- `event_description`: Human-readable description for UI
- `category_description`: Category description for UI
- `display_order`: Order for UI display
- `created_at`, `updated_at`: Timestamps

#### 2. `user_notification_preferences`

Stores individual user's notification preferences.

**Columns:**

- `id`: Primary key (CUID2)
- `user_id`: Foreign key to users table
- `category`: Notification category
- `event`: Specific notification event
- `none_enabled`, `in_app_enabled`, `email_enabled`: User's preferences
- `created_at`, `updated_at`: Timestamps

#### 3. `user_notification_overrides`

Stores user-specific overrides for notification preferences (future use).

**Columns:**

- `id`: Primary key (CUID2)
- `user_id`: Foreign key to users table
- `category`: Notification category
- `event`: Specific notification event
- `none_enabled`, `in_app_enabled`, `email_enabled`: Override values (nullable)
- `created_at`, `updated_at`: Timestamps

### Enums

#### `notification_category`

- `alerts`: Critical security and account activity
- `jobs`: Job-related notifications
- `articles`: Content and article updates
- `news`: News and general updates

#### `notification_event`

- **Alerts**: `password_change`, `new_browser_signin`, `new_device_linked`
- **Jobs**: `new_job_post`, `job_application_status`
- **Articles**: `new_topics`, `new_comment_on_article`, `likes_on_article`
- **News**: `news_updates`

#### `notification_type`

- `none`: No notifications
- `in_app`: In-app notifications
- `email`: Email notifications

## Architecture

### Data Flow

1. **Default Preferences**: Stored in `default_notification_preferences`
2. **User Preferences**: Stored in `user_notification_preferences`
3. **Merging**: User preferences override defaults when present
4. **Fallback**: If no user preference exists, use default

### Scalability Features

- **Event-based**: Easy to add new notification events
- **Category-based**: Logical grouping for UI and management
- **User-specific**: Each user can have custom preferences
- **Override system**: Future flexibility for advanced use cases
- **Unique constraints**: Prevents duplicate preferences

## API Actions

### `getUserNotificationPreferencesAction()`

Fetches user's notification preferences, merging with defaults.

### `updateUserNotificationPreferencesAction(category, event, preferences)`

Updates a specific notification preference for a user.

### `bulkUpdateNotificationPreferencesAction(category, preferences)`

Updates all notification preferences for a category.

### `initializeUserNotificationPreferencesAction()`

Creates default preferences for a new user.

### `seedDefaultNotificationPreferencesAction()`

Seeds the default preferences table (admin function).

## Usage Examples

### Frontend Component

```typescript
import { getUserNotificationPreferencesAction } from "@/app/(dashboard)/actions/notification-actions";

// Fetch preferences
const result = await getUserNotificationPreferencesAction();
if (result.success) {
  setNotificationSettings(result.data);
}
```

### Update Individual Preference

```typescript
import { updateUserNotificationPreferencesAction } from "@/app/(dashboard)/actions/notification-actions";

// Update preference
const result = await updateUserNotificationPreferencesAction(
  "alerts",
  "password_change",
  {
    noneEnabled: false,
    inAppEnabled: true,
    emailEnabled: true,
  }
);
```

### Bulk Update Category

```typescript
import { bulkUpdateNotificationPreferencesAction } from "@/app/(dashboard)/actions/notification-actions";

// Enable all notifications for a category
const result = await bulkUpdateNotificationPreferencesAction("jobs", {
  noneEnabled: false,
  inAppEnabled: true,
  emailEnabled: true,
});
```

## Future Enhancements

### In-App Notifications

- Separate table for actual notification instances
- Different from preferences (this system manages what users want to receive)
- Can reference user preferences to determine delivery method

### Advanced Overrides

- Time-based preferences
- Frequency controls
- Channel-specific settings

### Notification Templates

- Dynamic content based on user preferences
- Localization support
- A/B testing capabilities

## Migration

Run the SQL migration file to create the tables and seed default data:

```bash
# Apply the migration
psql -d your_database -f lib/db/migrations/0003_notification_preferences.sql
```

## Testing

### Seed Data

The system includes default notification preferences that match the current UI implementation.

### User Initialization

New users automatically get default preferences when they first access the notifications tab.

### Error Handling

All actions include proper error handling and user feedback via toast notifications.

## Security

- **Authentication Required**: All actions require valid user session
- **User Isolation**: Users can only access their own preferences
- **Input Validation**: Proper type checking and validation
- **SQL Injection Protection**: Uses Drizzle ORM with parameterized queries
