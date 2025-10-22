# Quiz System Implementation Guide

## Overview

This document provides a comprehensive guide to the quiz management system that has been implemented for the Kracada MVP application. The system allows admins to create, manage, and publish quizzes, while users can take quizzes and view results.

## Architecture

### Database Schema

The quiz system uses **5 main database tables**:

#### 1. `quizzes` - Main quiz information

- **id**: Unique identifier (CUID)
- **title**: Quiz title
- **slug**: URL-friendly slug
- **description**: Quiz description
- **category**: Quiz category (e.g., "Technology", "Programming")
- **difficulty**: Enum ("Beginner", "Intermediate", "Advanced")
- **featuredImage**: Cloudflare R2 image URL
- **featuredImageKey**: Cloudflare R2 key for deletion
- **estimatedTime**: Estimated completion time (e.g., "5 min")
- **status**: Enum ("draft", "published", "archived")
- **adminId**: Foreign key to admins table
- **attemptCount**: Number of quiz attempts
- **viewCount**: Number of quiz views
- **publishedAt**: Publication timestamp
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

#### 2. `quiz_questions` - Questions for each quiz

- **id**: Unique identifier
- **quizId**: Foreign key to quizzes table
- **questionText**: The question text
- **questionOrder**: Order of question in quiz
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

#### 3. `quiz_question_options` - Options for each question

- **id**: Unique identifier
- **questionId**: Foreign key to quiz_questions table
- **optionText**: The option text
- **optionOrder**: Order of option (0-3)
- **isCorrect**: Boolean indicating correct answer
- **createdAt**: Creation timestamp

#### 4. `quiz_attempts` - User quiz attempts

- **id**: Unique identifier
- **quizId**: Foreign key to quizzes table
- **userId**: Foreign key to users table (nullable for guests)
- **score**: Number of correct answers
- **totalQuestions**: Total questions in quiz
- **completedAt**: Completion timestamp

#### 5. `quiz_comments` - Comments on quizzes

- **id**: Unique identifier
- **quizId**: Foreign key to quizzes table
- **userId**: Foreign key to users table (nullable for guests)
- **userName**: Cached username for guests
- **userAvatar**: Cached user avatar URL
- **commentText**: Comment content
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

### File Structure

```
/Users/imehusoro/Documents/Work/KR/kracada-mvp/
├── lib/db/schema/
│   └── quizzes.ts                    # Database schema definitions
├── app/
│   ├── (dashboard)/actions/
│   │   ├── quiz-actions.ts           # Server actions for quiz CRUD
│   │   └── upload-actions.ts         # Updated with quiz image upload
│   ├── admin/dashboard/quizzes/
│   │   ├── page.tsx                  # Server component page
│   │   └── QuizManagementContent.tsx # Client component for admin UI
│   └── quiz/
│       ├── page.tsx                  # Public quiz listing (server)
│       └── [id]/
│           └── page.tsx              # Public quiz detail (server)
└── components/specific/quiz/
    ├── QuizCard.tsx                  # Quiz card component
    ├── QuizDetailClient.tsx          # Quiz taking interface (updated)
    ├── QuizListingHeader.tsx         # Quiz listing header
    ├── QuizListingSection.tsx        # Quiz listing section
    ├── MoreQuizzes.tsx               # Sidebar recommendations
    └── Comments.tsx                  # Comments section
```

## Features

### Admin Features

#### 1. Quiz Management Dashboard (`/admin/dashboard/quizzes`)

**Stats Cards:**

- Total Quizzes
- Published Quizzes
- Draft Quizzes
- Archived Quizzes

**Filtering & Search:**

- Search by title, description, or category
- Filter by status (All, Published, Draft, Archived)
- Pagination support

**Quiz Table Columns:**

- Title (with link to public view)
- Category
- Difficulty
- Status badge
- Statistics (Views & Attempts)
- Publication date
- Actions dropdown

#### 2. Create/Edit Quiz Form

**Basic Information:**

- **Title** (required, min 5 characters)
- **Description** (required, min 20 characters)
- **Category** (required)
- **Difficulty** (Beginner/Intermediate/Advanced)
- **Estimated Time** (e.g., "5 min")
- **Status** (Draft/Published)
- **Featured Image** (optional, max 5MB)

**Questions:**

- Add multiple questions
- Each question must have exactly 4 options
- One option must be marked as correct
- Questions can be reordered
- Questions can be removed (minimum 1 question required)

**Validation:**

- React Hook Form with Zod schema validation
- Real-time error feedback
- Client-side validation before submission

#### 3. Image Upload

**Integration with Cloudflare R2:**

- Upload featured images for quizzes
- Images stored in `/quizzes/{adminId}/{sanitized-title}/`
- Preview before upload
- Remove and re-upload capability
- Automatic key tracking for deletion

### Public Features

#### 1. Quiz Listing Page (`/quiz`)

**Features:**

- Grid layout of quiz cards
- Pagination (6 quizzes per page)
- Displays total quiz count
- Responsive design (mobile-friendly)
- Light/dark mode support

**Quiz Card Information:**

- Featured image
- Title
- Description
- Category badge
- Difficulty badge
- Questions count
- Estimated time
- Author and date

#### 2. Quiz Detail Page (`/quiz/[id]`)

**Features:**

- Quiz header with metadata
- Featured image
- All questions displayed at once
- Radio button selection for answers
- Submit button (enabled when all questions answered)
- Score display after submission
- Correct/incorrect answer feedback
- Action buttons (Take another test, Go to all quizzes)
- More Quizzes sidebar (desktop only)
- Comments section

**Quiz Taking Flow:**

1. User views all questions
2. Selects answers (radio buttons)
3. Clicks Submit (only when all questions answered)
4. Sees score and feedback
5. Green border on correct answers
6. Red border on user's incorrect answers
7. Options to restart or browse other quizzes

**Tracking:**

- Quiz attempts are tracked in database
- View counts are incremented
- Both logged-in and guest users can take quizzes

## Server Actions

### Quiz CRUD Operations

#### `createQuizAction(data: CreateQuizData)`

- Creates a new quiz with questions and options
- Generates unique slug from title
- Sets publication date if status is "published"
- Returns success/error message

#### `updateQuizAction(data: UpdateQuizData)`

- Updates existing quiz
- Deletes old questions and recreates
- Updates slug if title changed
- Returns success/error message

#### `deleteQuizAction(quizId: string)`

- Deletes quiz and all related data (cascade)
- Returns success/error message

#### `getAdminQuizzesAction({ page, limit, status, search })`

- Fetches quizzes for admin dashboard
- Supports filtering by status
- Supports search by title, description, category
- Returns paginated results

#### `getQuizForEditAction(quizId: string)`

- Fetches single quiz with all questions and options
- Used for edit form population
- Returns complete quiz data

#### `getQuizzesAction({ page, limit })`

- Fetches published quizzes for public listing
- Includes question count for each quiz
- Returns paginated results

#### `getQuizAction(quizId: string)`

- Fetches single quiz for quiz taking
- Only returns published quizzes
- Increments view count
- Returns quiz with questions and options

#### `submitQuizAttemptAction({ quizId, score, totalQuestions })`

- Records quiz attempt
- Increments attempt count
- Works for both logged-in and guest users
- Returns success/error message

### Image Upload Action

#### `uploadQuizFeaturedImage(formData: FormData)`

- Uploads quiz featured image to Cloudflare R2
- Validates file type (images only)
- Validates file size (5MB max)
- Creates organized file structure
- Returns image URL and key for deletion

## Form Validation

### Quiz Form Schema (Zod)

```typescript
const quizSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(2, "Category is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  estimatedTime: z.string().min(1, "Estimated time is required"),
  status: z.enum(["draft", "published"]),
  questions: z
    .array(
      z.object({
        questionText: z
          .string()
          .min(5, "Question must be at least 5 characters"),
        options: z
          .array(
            z.object({
              optionText: z.string().min(1, "Option text is required"),
              isCorrect: z.boolean(),
            })
          )
          .length(4, "Each question must have exactly 4 options")
          .refine(
            (options) => options.filter((opt) => opt.isCorrect).length === 1,
            "Each question must have exactly one correct answer"
          ),
      })
    )
    .min(1, "Quiz must have at least 1 question"),
});
```

## UI Consistency

The quiz admin UI follows the same design patterns as other admin modules:

### Design Elements

- **Gradient Header**: Warm orange gradient with decorative circles
- **Stats Cards**: Consistent card design with icons and color coding
- **Table Layout**: Alternating row colors, hover effects
- **Status Badges**: Color-coded badges matching other modules
- **Action Dropdowns**: Consistent dropdown menu style
- **Dialog Modals**: Consistent modal design for create/edit
- **Pagination**: Reuses existing Pagination component
- **Buttons**: Consistent button styling and colors

### Color Coding

- **Published**: Green (success)
- **Draft**: Gray (neutral)
- **Archived**: Orange (warning)
- **Action Button**: Orange (brand color)

### Responsive Design

- **Mobile**: Stacked layout, full-width elements
- **Tablet**: 2-column grids where appropriate
- **Desktop**: Full table view, sidebar visible

### Dark Mode Support

- All components support dark mode
- Proper contrast ratios maintained
- Color schemes adapted for readability

## Testing Checklist

### Admin Dashboard

- [ ] Access `/admin/dashboard/quizzes`
- [ ] Verify stats cards display correct counts
- [ ] Test search functionality
- [ ] Test status filtering
- [ ] Test pagination
- [ ] Create a new quiz
- [ ] Upload quiz featured image
- [ ] Add multiple questions with options
- [ ] Mark correct answers
- [ ] Save as draft
- [ ] Publish quiz
- [ ] Edit existing quiz
- [ ] Delete quiz

### Public Quiz Pages

- [ ] Access `/quiz`
- [ ] Verify published quizzes display
- [ ] Test pagination
- [ ] Click on quiz card
- [ ] Verify quiz detail page loads
- [ ] Answer all questions
- [ ] Submit quiz
- [ ] Verify score display
- [ ] Verify correct/incorrect feedback
- [ ] Click "Take another test"
- [ ] Click "Go to all quizzes"

### Mobile Testing

- [ ] Test admin dashboard on mobile
- [ ] Test create/edit form on mobile
- [ ] Test quiz listing on mobile
- [ ] Test quiz taking on mobile

### Dark Mode Testing

- [ ] Test all pages in dark mode
- [ ] Verify contrast and readability
- [ ] Check badge and status colors

## Future Enhancements

### Potential Features

1. **Quiz Analytics**

   - Average scores per quiz
   - Completion rates
   - Time spent per quiz
   - Most popular quizzes

2. **Advanced Quiz Types**

   - Multiple correct answers
   - True/False questions
   - Fill-in-the-blank
   - Image-based questions

3. **User Features**

   - Quiz history for logged-in users
   - Leaderboards
   - Badges/achievements
   - Quiz recommendations

4. **Admin Features**

   - Bulk import questions from CSV
   - Question bank/library
   - Quiz templates
   - Clone existing quizzes
   - Schedule quiz publication

5. **Comment Moderation**
   - Flag inappropriate comments
   - Admin comment management
   - Comment replies

## Troubleshooting

### Common Issues

**Issue:** Quiz not showing on public page after publishing

- **Solution:** Check that status is set to "published" in admin dashboard

**Issue:** Image upload fails

- **Solution:** Verify Cloudflare R2 environment variables are set correctly

**Issue:** Database connection errors

- **Solution:** Check DATABASE_URL in `.env.local` file

**Issue:** Form validation errors

- **Solution:** Ensure all required fields are filled and each question has exactly one correct answer

## Security Considerations

1. **Authentication**: Admin routes protected by auth middleware
2. **Authorization**: Only admins can create/edit/delete quizzes
3. **Input Validation**: Server-side validation with Zod
4. **SQL Injection**: Protected by Drizzle ORM
5. **File Upload**: Validated file types and sizes
6. **XSS Protection**: React automatically escapes user input

## Performance Optimizations

1. **Database Indexing**: Consider adding indexes on frequently queried fields
2. **Image Optimization**: Use Next.js Image component for automatic optimization
3. **Pagination**: Limit query results to improve performance
4. **Caching**: Consider implementing caching for frequently accessed quizzes
5. **Lazy Loading**: Questions loaded only when quiz is accessed

## Maintenance

### Regular Tasks

- Monitor quiz attempt statistics
- Review and moderate comments
- Archive outdated quizzes
- Update quiz content regularly
- Monitor image storage usage

### Database Cleanup

- Consider archiving old quiz attempts after 6 months
- Clean up orphaned images from Cloudflare R2
- Regular database backups

## Support

For issues or questions regarding the quiz system:

1. Check this documentation
2. Review the database schema in `lib/db/schema/quizzes.ts`
3. Review server actions in `app/(dashboard)/actions/quiz-actions.ts`
4. Check admin UI in `app/admin/dashboard/quizzes/`

---

**Implementation Date**: January 2025
**Version**: 1.0.0
**Author**: AI Assistant
**Last Updated**: January 2025
