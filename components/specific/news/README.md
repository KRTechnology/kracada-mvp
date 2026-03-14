# News Page Components

This directory contains the components for the News page implementation.

## Components

### NewsHeroSection

- **File**: `NewsHeroSection.tsx`
- **Type**: Client Component
- **Purpose**: Main hero section with news heading, description, and subscription form
- **Features**:
  - Responsive design for desktop and mobile
  - Theme-aware background colors (peach-600 for dark mode, warm-500 for light mode)
  - Framer Motion animations for smooth entrance effects
  - Left-aligned layout matching the design specifications

### NewsSubscriptionForm

- **File**: `NewsSubscriptionForm.tsx`
- **Type**: Client Component
- **Purpose**: Email subscription form with validation
- **Features**:
  - Zod schema validation for email input
  - React Hook Form integration
  - Loading states and success feedback
  - Simulated API request handling
  - Framer Motion animations for form interactions
  - Error handling with user-friendly messages

### NewsListingHeader

- **File**: `NewsListingHeader.tsx`
- **Type**: Client Component
- **Purpose**: Header section with search, categories, and sort controls
- **Features**:
  - Search bar with magnifying glass icon
  - Categories dropdown
  - Results count display
  - Sort dropdown
  - Responsive layout for desktop and mobile
  - Theme-aware styling

### NewsArticleCard

- **File**: `NewsArticleCard.tsx`
- **Type**: Client Component
- **Purpose**: Individual news article card component
- **Features**:
  - Article image with hover effects
  - Author and date information
  - Article title with external link icon
  - Article description
  - Category tags with different styling
  - Framer Motion animations
  - Responsive design

### NewsListingSection

- **File**: `NewsListingSection.tsx`
- **Type**: Client Component
- **Purpose**: Main news listing section with grid layout
- **Features**:
  - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
  - Sample news data
  - Pagination integration
  - Framer Motion animations
  - Theme-aware background colors

### NewsPagination

- **File**: `NewsPagination.tsx`
- **Type**: Client Component
- **Purpose**: Custom pagination component for news listing
- **Features**:
  - Previous/Next buttons
  - Page number display with ellipsis
  - Current page highlighting
  - Framer Motion hover effects
  - Responsive design

## Usage

The components are used in the main news page (`/app/news/page.tsx`) as a server component that imports the client components.

## Styling

- Uses Tailwind CSS with custom color scheme
- Background colors: white (#FFF) for light mode, dark (#0D0D0D) for dark mode
- Form styling includes backdrop blur effects
- Responsive breakpoints for mobile and desktop
- Consistent with the application's design system
- Pixel-perfect match to provided design images

## Dependencies

- `framer-motion` for animations
- `react-hook-form` for form handling
- `zod` for validation
- `next-themes` for theme management
- `lucide-react` for icons
- `next/image` for optimized images
