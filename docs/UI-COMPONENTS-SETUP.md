# UI Components Setup - Dropdown Menu & Alert Dialog

## 📋 Overview

Custom UI components have been created for the User Management module using Radix UI primitives that are already installed in the project. These components provide accessible, fully-styled dropdown menus and alert dialogs.

## 🎨 Components Created

### 1. Dropdown Menu (`components/ui/dropdown-menu.tsx`)

A fully accessible dropdown menu component built on `@radix-ui/react-dropdown-menu`.

**Features:**

- Accessible keyboard navigation
- Focus management
- Smooth animations (fade in/out, zoom, slide)
- Dark mode support
- Multiple component types:
  - `DropdownMenu` - Root component
  - `DropdownMenuTrigger` - Button to open menu
  - `DropdownMenuContent` - Menu content container
  - `DropdownMenuItem` - Individual menu item
  - `DropdownMenuLabel` - Label for menu sections
  - `DropdownMenuSeparator` - Divider between items
  - `DropdownMenuCheckboxItem` - Checkable menu item
  - `DropdownMenuRadioItem` - Radio group menu item
  - `DropdownMenuGroup` - Group related items
  - `DropdownMenuSub` - Submenu support

**Styling:**

- Neutral color palette for light/dark modes
- Rounded corners (`rounded-md`)
- Shadow effects for depth
- Hover states with background color changes
- Focus states with visual feedback
- Transition animations (200ms duration)

**Usage Example:**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button>Open Menu</button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleAction}>Action Item</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 2. Alert Dialog (`components/ui/alert-dialog.tsx`)

A modal dialog component for important confirmations, built on `@radix-ui/react-alert-dialog`.

**Features:**

- Modal overlay with backdrop
- Focus trap (keeps focus within dialog)
- Escape key to close
- Accessible ARIA attributes
- Smooth animations (fade, zoom, slide)
- Dark mode support
- Multiple component types:
  - `AlertDialog` - Root component
  - `AlertDialogTrigger` - Button to open dialog
  - `AlertDialogContent` - Dialog content container
  - `AlertDialogHeader` - Header section
  - `AlertDialogFooter` - Footer with action buttons
  - `AlertDialogTitle` - Dialog title
  - `AlertDialogDescription` - Description text
  - `AlertDialogAction` - Primary action button
  - `AlertDialogCancel` - Cancel button

**Styling:**

- Black overlay with 80% opacity
- White background (dark in dark mode)
- Centered on screen
- Rounded corners (`rounded-lg`)
- Border and shadow for depth
- Responsive padding
- Action buttons styled appropriately:
  - Cancel: Outlined, subtle
  - Action: Filled, prominent

**Usage Example:**

```tsx
<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## 📁 File Structure

```
components/
└── ui/
    ├── dropdown-menu.tsx    # Dropdown menu component
    ├── alert-dialog.tsx     # Alert dialog component
    └── index.ts             # Barrel export (optional)
```

## 🔧 Dependencies

These components use the following packages that are already installed:

```json
{
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-alert-dialog": "^1.1.15",
  "clsx": "^2.1.1",
  "tailwind-merge": "latest"
}
```

## 🎨 Utility Function

Both components use the `cn()` utility from `@/lib/utils` for merging Tailwind CSS classes:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This utility intelligently merges Tailwind classes, handling conflicts properly.

## 🌙 Dark Mode Support

Both components fully support dark mode using Tailwind's `dark:` prefix:

- **Backgrounds:** `dark:bg-neutral-950`, `dark:bg-neutral-800`
- **Text:** `dark:text-neutral-50`, `dark:text-neutral-400`
- **Borders:** `dark:border-neutral-800`
- **Hover states:** `dark:hover:bg-neutral-800`
- **Focus states:** `dark:focus-visible:ring-neutral-300`

## ♿ Accessibility

Both components are built on Radix UI primitives, which provide:

- **Keyboard Navigation:**

  - Arrow keys for menu navigation
  - Tab/Shift+Tab for focus management
  - Escape to close
  - Enter/Space to activate

- **Screen Reader Support:**

  - Proper ARIA labels and roles
  - Announcement of state changes
  - Focus management

- **Focus Management:**
  - Focus trap in dialogs
  - Return focus to trigger on close
  - Visual focus indicators

## 📱 Responsive Design

The components are fully responsive:

- **Alert Dialog:**

  - Full width on mobile
  - Max width of `512px` on larger screens
  - Stacked buttons on mobile
  - Row layout on desktop

- **Dropdown Menu:**
  - Automatically positions itself to stay in viewport
  - Adjusts alignment based on available space
  - Touch-friendly tap targets

## 🎬 Animations

Both components feature smooth animations using Tailwind's animation utilities:

- **Fade In/Out:** Opacity transitions
- **Zoom In/Out:** Scale transformations
- **Slide In/Out:** Position-based slides
- **Duration:** 200ms for smooth feel

## 🐛 Troubleshooting

### TypeScript Error: "Cannot find module"

If you see this error in your IDE:

```
Cannot find module '@/components/ui/dropdown-menu' or its corresponding type declarations.
```

**Solution:**

1. Restart your IDE's TypeScript language server:
   - **VS Code:** `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
   - **Cursor:** Same as VS Code
2. Restart the Next.js dev server:
   ```bash
   npm run dev
   ```
3. If the issue persists, delete `.next` folder and restart:
   ```bash
   rm -rf .next
   npm run dev
   ```

This is a caching issue with the TypeScript language server. The code will work correctly at runtime.

## 🔮 Future Enhancements

Potential additions for these components:

1. **Dropdown Menu:**

   - Add keyboard shortcuts display
   - Add icons support in menu items
   - Add submenu support
   - Add command palette style search

2. **Alert Dialog:**
   - Add different variants (info, warning, error, success)
   - Add custom icon support
   - Add input fields for prompts
   - Add loading states

## 📚 Related Documentation

- [User Management Implementation](./USER-MANAGEMENT-IMPLEMENTATION.md)
- [Admin Module Guide](./ADMIN-MODULE-GUIDE.md)
- [Radix UI Documentation](https://www.radix-ui.com/)

## ✅ Integration in User Management

These components are used in the User Management module:

**Dropdown Menu:**

- Action menus for each user/admin row
- Status change options
- Delete confirmations trigger
- Role management (admins)

**Alert Dialog:**

- Delete confirmation dialog
- Prevents accidental deletions
- Shows user/admin name
- Destructive action styling

## 🎉 Summary

These custom UI components provide:
✅ Accessible, keyboard-friendly interactions
✅ Beautiful, modern design with animations
✅ Full dark mode support
✅ TypeScript type safety
✅ Responsive across all screen sizes
✅ Consistent with application design system
✅ Built on robust Radix UI primitives
✅ Easy to use and customize

The components are production-ready and integrate seamlessly with the User Management module and the rest of the admin dashboard!
