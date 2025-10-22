# Quiz Module Components

This directory contains the components for the Quiz module implementation.

## Components

### QuizHeroSection

- **File**: `QuizHeroSection.tsx`
- **Type**: Client Component
- **Purpose**: Main hero section with quiz heading, description, and stats
- **Features**:
  - Responsive design for desktop and mobile
  - Theme-aware background colors (peach-600 for dark mode, warm-500 for light mode)
  - Framer Motion animations for smooth entrance effects
  - Statistics display (quizzes available, questions answered, difficulty levels)

### QuizListingHeader

- **File**: `QuizListingHeader.tsx`
- **Type**: Client Component
- **Purpose**: Header section with search, categories, and sort controls
- **Features**:
  - Search bar with magnifying glass icon
  - Categories dropdown for filtering quizzes
  - Results count display
  - Sort dropdown for organizing quizzes
  - Responsive layout for desktop and mobile
  - Theme-aware styling

### QuizCard

- **File**: `QuizCard.tsx`
- **Type**: Client Component
- **Purpose**: Individual quiz card component
- **Features**:
  - Quiz image with hover effects
  - Category and difficulty level badges
  - Quiz title with external link icon
  - Quiz description
  - Quiz stats (questions count, estimated time)
  - Author information with avatar
  - Framer Motion animations
  - Responsive design
  - Difficulty-based color coding

### QuizListingSection

- **File**: `QuizListingSection.tsx`
- **Type**: Client Component
- **Purpose**: Main quiz listing section with grid layout
- **Features**:
  - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
  - Sample quiz data
  - Pagination integration
  - Framer Motion animations
  - Theme-aware background colors
  - Loading states

### QuizDetailClient

- **File**: `QuizDetailClient.tsx`
- **Type**: Client Component
- **Purpose**: Individual quiz detail and taking interface
- **Features**:
  - Quiz information display
  - Interactive quiz taking interface
  - Progress tracking
  - Score calculation
  - Question navigation
  - Completion screen
  - Responsive design
  - Theme-aware styling

## Usage

The components are used in the main quiz page (`/app/quiz/page.tsx`) as a server component that imports the client components.

## Styling

- Uses Tailwind CSS with custom color scheme
- Background colors: white (#FFF) for light mode, dark (#0D0D0D) for dark mode
- Orange accent color (#FF6F00) for primary actions
- Difficulty-based color coding (green for beginner, yellow for intermediate, red for advanced)
- Responsive breakpoints for mobile and desktop
- Consistent with the application's design system

## Dependencies

- `framer-motion` for animations
- `next-themes` for theme management
- `lucide-react` for icons
- `next/image` for optimized images
- `next/link` for navigation

## Quiz Data Structure

```typescript
interface Quiz {
  id: string | number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  questionsCount: number;
  estimatedTime: string;
  questions?: Question[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}
```
