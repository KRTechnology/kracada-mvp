# Session Management System

This document explains the session management system implemented for tracking active user sessions across different devices.

## 🏗️ Architecture Overview

The session system consists of:

- **Database Schema**: `userSessions` table to store session data
- **Server Actions**: Functions to manage sessions (get, logout, etc.)
- **NextAuth Integration**: Automatic session tracking on login/logout
- **UI Components**: Settings page showing active sessions

## 📊 Database Schema

### `userSessions` Table

| Field           | Type         | Description               |
| --------------- | ------------ | ------------------------- |
| `id`            | varchar(128) | Unique session identifier |
| `user_id`       | varchar(128) | Reference to user         |
| `session_token` | varchar(255) | NextAuth session token    |
| `refresh_token` | varchar(255) | Optional refresh token    |
| `user_agent`    | text         | Browser/OS information    |
| `ip_address`    | varchar(45)  | Client IP address         |
| `is_active`     | boolean      | Whether session is active |
| `last_active`   | timestamp    | Last activity timestamp   |
| `expires_at`    | timestamp    | Session expiration time   |
| `created_at`    | timestamp    | Session creation time     |
| `updated_at`    | timestamp    | Last update time          |

### Indexes

- `user_active_session_unique_idx`: Ensures one active session per user per device
- `user_sessions_user_id_active_idx`: Performance for user queries
- `user_sessions_expires_at_idx`: Performance for expiration queries
- `user_sessions_last_active_idx`: Performance for activity queries

## 🔧 Key Functions

### Session Actions (`session-actions.ts`)

- `getUserActiveSessionsAction()`: Fetch user's active sessions
- `forceLogoutSessionAction()`: Logout a specific session
- `logoutAllOtherSessionsAction()`: Logout all other sessions

### Session Utils (`session-utils.ts`)

- `createUserSession()`: Create/update session record
- `updateSessionLastActive()`: Update activity timestamp
- `validateSession()`: Check if session is valid
- `invalidateSession()`: Mark session as inactive
- `cleanupExpiredSessions()`: Remove expired sessions

## 🌐 NextAuth Integration

The system automatically:

1. **Creates sessions** when users sign in
2. **Updates activity** on each request
3. **Invalidates sessions** when users sign out

### Headers Captured

- `User-Agent`: Browser and OS information
- `X-Forwarded-For`: Client IP address
- `X-Real-IP`: Real client IP (fallback)

## 📱 UI Features

### Settings Page - Password Tab

- **Active Sessions List**: Shows all active sessions
- **Device Information**: Browser, OS, device type
- **Location**: Basic geographic information
- **Last Activity**: Relative time (e.g., "2 hours ago")
- **Force Logout**: Individual session logout
- **Logout All Others**: Bulk logout functionality

### Device Detection

- **Desktop**: Windows, macOS, Linux computers
- **Mobile**: Android, iOS phones
- **Tablet**: iPads, Android tablets

## 🚀 Getting Started

### 1. Run Migration

```bash
npm run db:generate
npm run db:migrate
```

### 2. Seed Test Data (Optional)

```bash
npm run db:seed:sessions
```

### 3. Test Functionality

1. Sign in from multiple devices/browsers
2. Check settings page for active sessions
3. Test force logout functionality

## 🔒 Security Features

- **Session Validation**: Automatic validation on each request
- **Expiration Management**: Sessions expire after 30 days
- **Device Tracking**: One session per device per user
- **Force Logout**: Users can logout specific sessions remotely

## 📊 Data Reliability

### ✅ What We Can Reliably Get

- **User Agent**: Browser type, OS, device category
- **IP Address**: Basic network information
- **Session Metadata**: Login time, activity, expiration
- **Device Type**: Desktop, mobile, tablet

### ❌ What We Cannot Reliably Get

- **Exact Location**: City, state, precise coordinates
- **Device Model**: "2022 MacBook Pro" vs generic "MacBook"
- **Browser Version**: Exact version numbers
- **Real-time Location**: GPS coordinates

## 🛠️ Customization

### Session Duration

Modify the expiration time in `auth.ts`:

```typescript
expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
```

### Location Detection

Enhance `getLocationFromIP()` in `session-actions.ts`:

```typescript
// Integrate with MaxMind or similar service
const location = await getLocationFromService(ipAddress);
```

### Device Parsing

Customize `parseUserAgent()` in `session-actions.ts` for specific device detection.

## 🐛 Troubleshooting

### Common Issues

1. **Sessions Not Showing**

   - Check if user is authenticated
   - Verify database connection
   - Check migration status

2. **Force Logout Not Working**

   - Verify session ID exists
   - Check user permissions
   - Review database constraints

3. **Performance Issues**
   - Ensure indexes are created
   - Check query performance
   - Monitor session cleanup

### Debug Mode

Enable logging in session actions:

```typescript
console.log("Session data:", sessionData);
```

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket notifications for session changes
- **Advanced Analytics**: Session patterns and security insights
- **Geographic Restrictions**: Location-based access control
- **Device Fingerprinting**: More accurate device identification
- **Session History**: Complete login/logout audit trail

## 📚 Related Files

- `lib/db/schema/sessions.ts` - Database schema
- `lib/db/migrations/0004_user_sessions.sql` - Migration file
- `app/(dashboard)/actions/session-actions.ts` - Server actions
- `lib/auth/session-utils.ts` - Utility functions
- `components/specific/dashboard/settings/PasswordTabContent.tsx` - UI component
- `auth.ts` - NextAuth configuration
