# Lifestyle Posts System Documentation

## Overview

The Lifestyle Posts System is a comprehensive content management feature that allows Contributors to create, edit, and manage lifestyle blog posts. The system includes a rich text editor (Tiptap), image uploads, categories, comments, and likes functionality.

## Table of Contents

1. [Architecture](#architecture)
2. [Database Schema](#database-schema)
3. [User Roles](#user-roles)
4. [Features](#features)
5. [File Structure](#file-structure)
6. [Server Actions](#server-actions)
7. [Client Components](#client-components)
8. [Setup Instructions](#setup-instructions)
9. [Usage Guide](#usage-guide)
10. [API Reference](#api-reference)

---

## Architecture

The system follows Next.js 15 App Router patterns with a clear separation between server and client components:

- **Server Components**: Handle data fetching, authentication, and authorization
- **Client Components**: Handle user interactions, rich text editing, and dynamic UI updates
- **Server Actions**: Manage all data mutations (CRUD operations)
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations

## Database Schema

### Tables

#### 1. `lifestyle_posts`

Stores all lifestyle blog posts.

```sql
CREATE TABLE lifestyle_posts (
  id VARCHAR(128) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(550) UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  featured_image_key VARCHAR(500),
  categories TEXT, -- JSON array
  status post_status DEFAULT 'published' NOT NULL,
  author_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0 NOT NULL,
  like_count INTEGER DEFAULT 0 NOT NULL,
  comment_count INTEGER DEFAULT 0 NOT NULL,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Status Enum Values**:

- `draft`: Post is being worked on but not visible to public
- `published`: Post is live and visible to everyone
- `flagged`: Post has been flagged by admin for review (not visible to public)
- `archived`: Post is archived and not visible

#### 2. `lifestyle_post_likes`

Tracks which users have liked which posts.

```sql
CREATE TABLE lifestyle_post_likes (
  id VARCHAR(128) PRIMARY KEY,
  post_id VARCHAR(128) NOT NULL REFERENCES lifestyle_posts(id) ON DELETE CASCADE,
  user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(post_id, user_id)
);
```

#### 3. `lifestyle_comments`

Stores comments on lifestyle posts (supports both logged-in and guest users).

```sql
CREATE TABLE lifestyle_comments (
  id VARCHAR(128) PRIMARY KEY,
  post_id VARCHAR(128) NOT NULL REFERENCES lifestyle_posts(id) ON DELETE CASCADE,
  user_id VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(255),
  user_avatar VARCHAR(500),
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Indexes

Recommended indexes for optimal performance:

```sql
CREATE INDEX idx_lifestyle_posts_status ON lifestyle_posts(status);
CREATE INDEX idx_lifestyle_posts_author ON lifestyle_posts(author_id);
CREATE INDEX idx_lifestyle_posts_published ON lifestyle_posts(published_at DESC);
CREATE INDEX idx_lifestyle_comments_post ON lifestyle_comments(post_id);
CREATE INDEX idx_lifestyle_likes_post ON lifestyle_post_likes(post_id);
CREATE INDEX idx_lifestyle_likes_user ON lifestyle_post_likes(user_id);
```

## User Roles

### Contributor

- Can create lifestyle posts
- Can edit their own posts
- Can delete their own posts
- Can view drafts of their own posts
- All posts are published by default but can be saved as drafts

### Non-Contributors (Job Seekers, Recruiters, Business Owners)

- Can view published posts
- Can like posts (when logged in)
- Can comment on posts (logged in or guest)
- Cannot create, edit, or delete posts

### Admin (Future)

- Can flag posts
- Can view all posts regardless of status
- Can edit or delete any post

## Features

### 1. Rich Text Editor (Tiptap)

- **Bold**, _Italic_, and `Code` text formatting
- Headings (H1, H2, H3)
- Bullet and numbered lists
- Block quotes
- Links with preview
- Image uploads (within content)
- Undo/Redo functionality

### 2. Featured Image

- Required for all posts
- **Max size: 5MB** (enforced on both client and server)
- **Editor images max size: 3MB** (for images within post content)
- Supported formats: JPEG, PNG, WebP, GIF
- Automatically optimized and stored in Cloudflare R2
- Organized in folders: `lifestyle-posts/{userId}/{sanitized-title}/` for featured images
- Editor images stored in: `lifestyle-posts/{userId}/content/{postId}/`

### 3. Categories

- 20 predefined categories (e.g., Health, Wellness, Productivity)
- Support for custom categories
- Multiple categories per post
- Displayed as tags on posts

### 4. Post Management

- Create new posts
- Edit existing posts (with owner-only Edit button on post page)
- Delete posts (with confirmation)
- Draft, Published, and Archived status
- URL-friendly slugs (auto-generated or custom)
- SEO-friendly descriptions
- Owner-only Edit button visible on published posts

### 5. Social Features

- **Like/Unlike posts**: Logged-in users can like and unlike posts. The system tracks likes per user and updates the post's like count.
- **Comment on posts**: Both logged-in and guest users can comment. Guest users must provide their name. Comments display with user avatars and relative timestamps.
- **View counts**: Each post view increments the view counter automatically.
- **Share functionality**: Copy link, Twitter, Facebook, and LinkedIn share buttons.

### 6. Search & Discovery

- Paginated post listings
- Filter by status (for authors)
- Filter by categories (future)
- Sort by published date

## File Structure

```
app/
├── actions/
│   └── lifestyle-actions.ts       # Server actions for posts, comments, likes
├── lifestyle/
│   ├── page.tsx                   # Listing page (server component)
│   ├── layout.tsx                 # Lifestyle section layout
│   ├── create/
│   │   └── page.tsx              # Create post page (server component)
│   ├── edit/
│   │   └── [id]/
│   │       └── page.tsx          # Edit post page (server component)
│   └── [id]/
│       └── page.tsx              # Individual post page (server component)
├── (dashboard)/
│   └── actions/
│       └── upload-actions.ts     # Upload actions for images

components/specific/lifestyle/
├── TiptapEditor.tsx              # Rich text editor component
├── CreateLifestylePostForm.tsx   # Create post form (client)
├── EditLifestylePostForm.tsx     # Edit post form (client)
├── LifestyleListingSection.tsx   # Post listing with pagination
├── LifestyleArticleCard.tsx      # Post card for listings
├── LifestyleHeader.tsx           # Lifestyle section header with create button
├── LifestyleArticlePageClient.tsx # Article page wrapper (client)
├── LifestyleArticleHeaderDynamic.tsx # Article header with metadata
├── LifestyleArticleContentDynamic.tsx # Article content renderer
├── LifestyleArticleFooter.tsx    # Comments and social actions
└── LifestyleAuthorSidebar.tsx    # Author info sidebar

lib/
├── db/
│   └── schema/
│       └── lifestyle-posts.ts    # Database schema definitions
└── cloudflare/
    └── upload-service.ts         # File upload service
```

## Server Actions

### Post Actions

#### `createLifestylePostAction(data: CreatePostData)`

Creates a new lifestyle post. Requires user to be a Contributor.

**Parameters**:

```typescript
{
  title: string;
  slug: string;
  description?: string;
  content: string;
  featuredImage?: string;
  featuredImageKey?: string;
  categories?: string[];
  status?: "draft" | "published";
}
```

**Returns**: `{ success: boolean; message: string; data?: LifestylePost }`

#### `updateLifestylePostAction(data: UpdatePostData)`

Updates an existing post. User must own the post.

#### `deleteLifestylePostAction(postId: string)`

Deletes a post and all associated comments and likes. User must own the post.

#### `getLifestylePostsAction(params?)`

Fetches posts with pagination and filtering.

**Parameters**:

```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 6
  authorId?: string;    // Filter by author
  status?: "draft" | "published" | "flagged" | "archived";
  categories?: string[];
}
```

#### `getLifestylePostAction(identifier: string)`

Fetches a single post by ID or slug. Increments view count.

### Like Actions

#### `toggleLifestylePostLikeAction(postId: string)`

Toggles like status for current user on a post.

#### `checkPostLikedAction(postId: string)`

Checks if current user has liked a post.

### Comment Actions

#### `createLifestyleCommentAction(data: CreateCommentData)`

Creates a comment on a post. Supports both logged-in and guest users.

**Parameters**:

```typescript
{
  postId: string;
  commentText: string;
  userName?: string;  // Required for guest users
}
```

#### `getLifestyleCommentsAction(postId: string)`

Fetches all comments for a post.

### Helper Actions

#### `generateUniqueSlugAction(title: string)`

Generates a unique URL slug from a post title.

## Client Components

### LifestyleAuthorSidebar

The author sidebar component that displays author information on post pages.

**Props**:

```typescript
{
  isOpen: boolean;           // Controls sidebar visibility
  onClose: () => void;       // Callback to close sidebar
  author?: any;              // Author data from database
  postId?: string;           // Current post ID
}
```

**Features**:

- Displays author profile picture, name, bio
- Shows author's website if available
- Links to author's profile page
- Lists other articles by the author
- Copy author profile link
- Responsive design with mobile overlay

**Author Data Used**:

- `firstName`, `lastName`, `fullName` - Author name
- `profilePicture` - Author avatar
- `bio` - Author description
- `website` - Author website URL
- `id` - For linking to author page

---

### LifestyleArticleFooter

The footer component for article pages with social features and comments.

**Props**:

```typescript
{
  postId: string; // Post ID for fetching/posting comments and likes
}
```

**Features**:

- **Like functionality**: Toggle like/unlike (logged-in users only)
- **Comments system**:
  - Fetch and display all comments from database
  - Post new comments (logged-in and guest users)
  - Guest users must provide their name
  - Real-time comment count
  - Avatar generation from initials
  - Relative timestamps (e.g., "5m ago", "2h ago")
  - Loading and empty states
- **Social sharing**: Copy link, Twitter, Facebook, LinkedIn buttons

**Comment Data Structure**:

```typescript
{
  id: string;
  postId: string;
  userId: string | null; // Null for guest comments
  userName: string; // Display name
  userAvatar: string | null; // Profile picture URL
  commentText: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### LifestyleArticleHeaderDynamic

The header component for individual post pages displaying post title, metadata, and actions.

**Props**:

```typescript
{
  post: any; // Post data from database
}
```

**Features**:

- Back navigation button to lifestyle listing
- Display post title, author name, and published date
- Show view count and like count (if > 0)
- Display post description
- **Edit Post button** (owner-only):
  - Only visible when logged-in user is the post owner
  - Compares `session.user.id` with `post.authorId`
  - Styled with orange accent matching app theme
  - Includes Edit icon for better UX
  - Navigates to `/lifestyle/edit/{postId}`
- Responsive design for mobile and desktop
- Animated entrance effects

**Authorization Logic**:

```typescript
const isOwner = session?.user?.id && session.user.id === post.authorId;
```

---

### TiptapEditor

Rich text editor component built with Tiptap.

**Props**:

```typescript
{
  content: string;          // Initial HTML content
  onChange: (html: string) => void;  // Callback when content changes
  userId: string;          // For image uploads
  postId?: string;         // For organizing uploaded images
  placeholder?: string;    // Editor placeholder text
  editable?: boolean;      // Whether editor is editable
}
```

**Features**:

- Toolbar with formatting options
- Image upload with drag & drop
- Link insertion
- Auto-save capability (when integrated)
- Dark mode support

### CreateLifestylePostForm

Form for creating new lifestyle posts.

**Props**:

```typescript
{
  userId: string;
  authorName: string;
}
```

**Features**:

- Form validation with Zod
- Featured image upload
- Category selection (predefined + custom)
- Slug auto-generation
- Draft/Published status selection
- Loading states and error handling

### EditLifestylePostForm

Form for editing existing posts.

**Props**:

```typescript
{
  userId: string;
  authorName: string;
  post: LifestylePost;
}
```

**Additional Features**:

- Pre-populated with existing post data
- Delete post functionality
- Featured image replacement
- Archive post option

## Setup Instructions

### 1. Install Dependencies

The required packages are already in `package.json`:

```json
{
  "@tiptap/react": "^3.4.4",
  "@tiptap/starter-kit": "^3.4.4",
  "@tiptap/extension-image": "included in starter-kit",
  "@tiptap/extension-link": "included in starter-kit",
  "@tiptap/extension-placeholder": "included in starter-kit"
}
```

If not installed, run:

```bash
npm install
```

### 2. Generate Database Migration

```bash
npm run db:generate
```

This will create a new migration file in `migrations/` folder.

### 3. Apply Database Migration

```bash
npm run db:migrate
```

Or push directly to database:

```bash
npm run db:push
```

### 4. Verify Database

Open Drizzle Studio to verify tables were created:

```bash
npm run db:studio
```

Navigate to `http://localhost:4983` and verify:

- `lifestyle_posts` table exists
- `lifestyle_post_likes` table exists
- `lifestyle_comments` table exists

### 5. Test the Feature

1. **Login as a Contributor**:

   - Go to `/login`
   - Ensure your user account has `accountType = "Contributor"`

2. **Create a Post**:

   - Navigate to `/lifestyle`
   - Click "Create a lifestyle post" button (visible only to Contributors)
   - Fill in the form and publish

3. **View the Post**:

   - Navigate back to `/lifestyle`
   - Click on your newly created post
   - Verify all content renders correctly

4. **Edit the Post**:
   - On the post page, add an edit button (future enhancement)
   - Or navigate to `/lifestyle/edit/[post-id]`
   - Make changes and save

## Usage Guide

### For Contributors

#### Creating a Post

1. Navigate to `/lifestyle`
2. Click "Create a lifestyle post" button
3. Upload a featured image (required, max 5MB)
4. Enter a compelling title
5. Generate or customize the URL slug
6. Add a brief description (optional but recommended)
7. Select relevant categories
8. Write your content using the rich text editor:
   - Use headings to structure your content
   - Add images by clicking the image icon
   - Format text with bold, italic, lists, etc.
   - Add links to external resources
9. Choose status (Published or Draft)
10. Click "Publish Post" or "Save as Draft"

#### Editing a Post

1. Navigate to `/lifestyle/edit/[post-id]`
2. Make your changes
3. Click "Save Changes"

**Note**: The slug can be changed, but the system will check for uniqueness.

#### Deleting a Post

1. Go to edit post page
2. Click "Delete Post" button
3. Confirm the deletion

**Warning**: This action cannot be undone. All comments and likes will also be deleted.

### For All Users

#### Viewing Posts

1. Navigate to `/lifestyle`
2. Browse posts in the listing
3. Click on a post to read full content
4. Use pagination to navigate through posts

#### Liking a Post

1. View a post
2. Click the "Like" button in the footer
3. Like count updates in real-time

**Note**: Must be logged in to like posts.

#### Commenting on a Post

1. View a post
2. Scroll to comments section
3. Enter your comment
4. Click "Post Comment"

**Note**: If logged in, your name and avatar are automatically used. If not logged in, you can provide a name.

## API Reference

### Upload Actions

#### `uploadLifestyleFeaturedImage(formData: FormData)`

Uploads a featured image for a lifestyle post.

**FormData Fields**:

- `file`: File object
- `userId`: string
- `postTitle`: string

**Returns**: `{ success: boolean; url?: string; key?: string; error?: string }`

#### `uploadLifestyleEditorImage(formData: FormData)`

Uploads an image from within the Tiptap editor.

**FormData Fields**:

- `file`: File object
- `userId`: string
- `postId`: string (optional)

**Returns**: `{ success: boolean; url?: string; key?: string; error?: string }`

### Image Storage Structure

Images are stored in Cloudflare R2 with the following structure:

```
lifestyle-posts/
├── {userId}/
│   ├── {sanitized-title}/
│   │   └── featured-{timestamp}.jpg
│   └── content/
│       ├── {postId}/
│       │   └── editor-{timestamp}.jpg
│       └── temp/
│           └── editor-{timestamp}.jpg
```

## Best Practices

### Content Creation

1. **Titles**: Keep titles under 60 characters for SEO
2. **Descriptions**: Write 120-160 character descriptions
3. **Images**: Use high-quality images, properly compressed
4. **Slugs**: Use descriptive, keyword-rich slugs
5. **Categories**: Choose 2-4 relevant categories
6. **Content**: Structure content with headings, keep paragraphs short

### Performance

1. **Images**: Compress images before uploading
2. **Content**: Break long articles into sections with headings
3. **Editor**: Save drafts periodically (future: auto-save)
4. **Pagination**: Default 6 posts per page for optimal loading

### SEO

1. **Slug**: Auto-generated from title, but can be customized
2. **Description**: Used in meta description
3. **Title**: Used in page title
4. **Content**: Properly structured with heading hierarchy
5. **Images**: Alt text automatically uses post title

## Troubleshooting

### "Only Contributors can create lifestyle posts"

**Solution**: Check that your user account has `accountType = "Contributor"` in the database.

### "Failed to upload image"

**Solution**:

1. Check image size (max 5MB for featured, 3MB for editor images)
2. Verify Cloudflare R2 environment variables are set
3. Check console for detailed error messages

### "Slug already exists"

**Solution**:

1. Click "Generate" button to create a new unique slug
2. Or manually modify the slug to make it unique

### Editor not loading

**Solution**:

1. Clear browser cache
2. Check console for JavaScript errors
3. Verify Tiptap packages are installed

### Comments not posting

**Solution**:

1. Check that comment text is not empty
2. If not logged in, ensure you provided a name
3. Check network tab for API errors

## Future Enhancements

### Planned Features

1. **Auto-save**: Automatic draft saving every 30 seconds
2. **Image gallery**: Browse and reuse uploaded images
3. **Post templates**: Pre-designed layouts for posts
4. **Scheduled publishing**: Schedule posts for future dates
5. **Post analytics**: View detailed analytics for each post
6. **Related posts**: Auto-suggest related posts
7. **SEO score**: Real-time SEO recommendations
8. **Collaboration**: Co-author support
9. **Version history**: Track post revisions
10. **Post series**: Link multiple posts into a series

### Admin Features (Future)

1. **Post moderation**: Review and approve posts before publishing
2. **Bulk actions**: Edit multiple posts at once
3. **Content guidelines**: Enforce content policies
4. **Analytics dashboard**: Platform-wide statistics
5. **User management**: Manage contributor permissions

## Support

For issues or questions:

1. Check this documentation first
2. Review the code comments in the implementation files
3. Check console for error messages
4. Contact the development team

## Changelog

### Version 1.0.0 (Initial Release)

- Complete lifestyle posts system
- Tiptap rich text editor integration
- Image upload functionality
- Categories and tags
- Comments system
- Likes functionality
- Contributor role restrictions
- Create, Edit, Delete operations
- Responsive design
- Dark mode support
