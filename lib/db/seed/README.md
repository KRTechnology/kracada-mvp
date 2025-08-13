# Database Seeding

This directory contains scripts to seed your database with initial data.

## Available Scripts

### Run All Seeds

```bash
npm run db:seed:notifications
```

### Run Specific Seed

```bash
npm run db:seed:notifications notification-preferences
```

## Current Seeds

### 1. Notification Preferences (`notification-preferences`)

- **Description**: Default notification preferences for all users
- **Data**: 9 notification events across 4 categories (alerts, jobs, articles, news)
- **Purpose**: Ensures new users have sensible default notification settings

## Adding New Seeds

To add a new seed operation:

1. **Create the seed action** in your actions file:

```typescript
export async function seedUsersAction() {
  // Your seeding logic here
  return { success: true, message: "Users seeded successfully" };
}
```

2. **Add it to the seed operations** in `lib/db/seed/index.ts`:

```typescript
const seedOperations: SeedOperation[] = [
  {
    name: "notification-preferences",
    description: "Default notification preferences for all users",
    run: seedDefaultNotificationPreferencesAction,
  },
  {
    name: "users",
    description: "Default user accounts",
    run: seedUsersAction, // Add your new seed action here
  },
];
```

3. **Run the specific seed**:

```bash
npm run db:seed:notifications users
```

## Seed Data Structure

### Notification Preferences

The notification preferences seed creates the following structure:

```
alerts (3 preferences)
├── password_change: in-app + email
├── new_browser_signin: none
└── new_device_linked: email only

jobs (2 preferences)
├── new_job_post: in-app only
└── job_application_status: in-app only

articles (3 preferences)
├── new_topics: email only
├── new_comment_on_article: none
└── likes_on_article: none

news (1 preference)
└── news_updates: email only
```

## Safety Features

- **Idempotent**: Running the seed multiple times won't create duplicates
- **Error Handling**: Comprehensive error handling with detailed logging
- **Graceful Shutdown**: Proper cleanup on process termination
- **Verification**: Confirms seeded data after each operation

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Ensure your database is running
   - Check your environment variables
   - Verify database credentials

2. **Permission Errors**

   - Ensure your database user has INSERT permissions
   - Check if tables exist (run migrations first)

3. **Duplicate Key Errors**
   - Seeds are idempotent, but check for conflicting data
   - Clear existing data if needed: `npm run db:drop`

### Debug Mode

For more verbose logging, you can modify the seed scripts to include additional console.log statements.

## Best Practices

1. **Always test seeds** in development before running in production
2. **Backup your database** before running seeds in production
3. **Use transactions** for complex seeds that modify multiple tables
4. **Keep seeds idempotent** - they should be safe to run multiple times
5. **Document your seeds** with clear descriptions and data structures
