# Lifestyle Posts System - Bug Fixes

## Overview

This document details the fixes applied to resolve three critical issues with the lifestyle posts system:

1. Body size limit errors during image upload
2. Generic error messages instead of specific errors
3. Tiptap lists (bullet points and numbered lists) not displaying properly

---

## Issue 1: Body Size Limit Error ✅ FIXED

### Problem

When uploading images larger than 1MB (e.g., 2.4MB), the system threw multiple errors:

```
[Error: Body exceeded 1 MB limit.
To configure the body size limit for Server Actions, see: https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#bodysizelimit] {
  statusCode: 413
}
```

This occurred even though the client and server both claimed to support 5MB featured images and 3MB editor images.

### Root Cause

Next.js Server Actions have a **default 1MB body size limit**. This was not configured in the `next.config.ts` file, causing the server to reject any uploads over 1MB regardless of our validation logic.

### Solution

Updated `next.config.ts` to increase the Server Actions body size limit to **6MB**:

**File Modified**: `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  images: {
    // ... existing config
  },
  serverActions: {
    bodySizeLimit: "6mb", // Increased to support 5MB featured images + metadata
  },
};
```

### Why 6MB?

- Featured images: up to 5MB
- Editor images: up to 3MB
- Additional overhead for FormData and metadata: ~1MB
- Total: 6MB provides adequate headroom

### Result

✅ Users can now upload images up to 5MB (featured) and 3MB (editor) without errors
✅ No more 413 status code errors
✅ Consistent behavior between client and server validation

---

## Issue 2: Generic Error Messages ✅ FIXED

### Problem

When errors occurred during:

- Image uploads
- Slug generation
- Post creation/update
- Post deletion

The system showed a generic message: **"An unexpected error occurred"** instead of the actual error message. This made debugging difficult for users.

### Root Cause

Error handlers were catching exceptions but not extracting the actual error message:

```typescript
catch (error) {
  console.error("Upload error:", error);
  toast.error("An unexpected error occurred");  // ❌ Generic message
}
```

### Solution

Updated all error handlers to extract and display the actual error message:

**Pattern Applied**:

```typescript
catch (error) {
  console.error("Upload error:", error);
  const errorMessage = error instanceof Error
    ? error.message
    : "An unexpected error occurred during upload";
  toast.error(errorMessage);  // ✅ Specific message
}
```

### Files Modified

1. **`components/specific/lifestyle/TiptapEditor.tsx`**

   - Fixed image upload error handling
   - Added specific loading toast dismissal

2. **`components/specific/lifestyle/CreateLifestylePostForm.tsx`**

   - Fixed slug generation error handling
   - Fixed featured image upload error handling
   - Fixed post creation error handling

3. **`components/specific/lifestyle/EditLifestylePostForm.tsx`**
   - Fixed slug generation error handling
   - Fixed featured image upload error handling
   - Fixed post update error handling
   - Fixed post deletion error handling

### Error Messages Now Shown

Users now see specific error messages such as:

- "Body exceeded 1 MB limit" (before the config fix)
- "Image size exceeds 5MB limit"
- "Failed to upload image to Cloudflare R2"
- "Invalid file type"
- "Post with this slug already exists"
- Database connection errors
- Network errors

### Additional Improvement

Changed toast loading to use specific toast IDs for better control:

```typescript
const loadingToast = toast.loading("Uploading image...");
// ... upload logic
toast.dismiss(loadingToast); // Dismisses only this specific toast
```

### Result

✅ Users see specific, actionable error messages
✅ Easier debugging and troubleshooting
✅ Better user experience with clear feedback
✅ No more loading toasts stuck on screen

---

## Issue 3: Tiptap Lists Not Displaying ✅ FIXED

### Problem

When users clicked the bullet list or numbered list buttons in the Tiptap editor:

- The button highlighted (showing it was active)
- But the text didn't appear as a list
- No bullet points or numbers were visible

### Root Cause

The Tiptap editor generates proper HTML list elements (`<ul>`, `<ol>`, `<li>`), but the **Tailwind CSS prose classes** were not properly configured to style these lists. The default prose configuration doesn't always apply list styles correctly.

### Solution

Added explicit list styling classes to all Tiptap editor instances and content display areas.

### Files Modified

1. **`components/specific/lifestyle/TiptapEditor.tsx`**

   **Editable Mode** (Editor):

   ```typescript
   editorProps: {
     attributes: {
       class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 dark:prose-invert prose-headings:font-bold prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-a:text-orange-500 prose-strong:text-neutral-900 dark:prose-strong:text-white prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-neutral-700 dark:prose-li:text-neutral-300",
     },
   }
   ```

   **Read-Only Mode** (Preview):

   ```typescript
   <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-a:text-orange-500 prose-strong:text-neutral-900 dark:prose-strong:text-white prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-neutral-700 dark:prose-li:text-neutral-300">
     <EditorContent editor={editor} />
   </div>
   ```

2. **`components/specific/lifestyle/LifestyleArticleContentDynamic.tsx`**

   Updated the content display div:

   ```typescript
   <motion.div
     className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-a:text-orange-500 prose-strong:text-neutral-900 dark:prose-strong:text-white prose-img:rounded-lg prose-img:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-neutral-700 dark:prose-li:text-neutral-300"
     dangerouslySetInnerHTML={{ __html: post.content }}
   />
   ```

### CSS Classes Added

| Class                            | Purpose                                      |
| -------------------------------- | -------------------------------------------- |
| `prose-ul:list-disc`             | Shows bullet points (•) for unordered lists  |
| `prose-ul:pl-6`                  | Adds left padding to unordered lists         |
| `prose-ol:list-decimal`          | Shows numbers (1, 2, 3...) for ordered lists |
| `prose-ol:pl-6`                  | Adds left padding to ordered lists           |
| `prose-li:text-neutral-700`      | Styles list items in light mode              |
| `dark:prose-li:text-neutral-300` | Styles list items in dark mode               |

### How Lists Now Work

1. **Bullet Lists**:

   - Click the bullet list button
   - Text indents and shows bullet points (•)
   - Each line item has a bullet point
   - Properly styled in both light and dark mode

2. **Numbered Lists**:

   - Click the numbered list button
   - Text indents and shows numbers (1, 2, 3...)
   - Numbers auto-increment
   - Properly styled in both light and dark mode

3. **Nested Lists**:
   - Tab to indent and create sub-lists
   - Proper indentation and styling maintained

### Result

✅ Bullet lists display with visible bullet points
✅ Numbered lists display with visible numbers
✅ Proper indentation and spacing
✅ Works in both light and dark mode
✅ Lists appear correctly in editor, preview, and published posts

---

## Testing Checklist

### Image Upload

- [x] Upload 1MB image → Success
- [x] Upload 2.4MB image → Success
- [x] Upload 5MB image (featured) → Success
- [x] Upload 3MB image (editor) → Success
- [x] Upload 6MB image → Shows "Image size exceeds 5MB limit"
- [x] Specific error messages shown for failures

### Error Messages

- [x] Network errors show specific message
- [x] File size errors show specific message
- [x] Invalid file type errors show specific message
- [x] Slug conflicts show specific message
- [x] No more generic "unexpected error" messages

### Tiptap Lists

- [x] Bullet list button highlights when active
- [x] Bullet points visible when typing
- [x] Numbered list button highlights when active
- [x] Numbers visible and auto-increment
- [x] Lists display correctly in editor
- [x] Lists display correctly in preview
- [x] Lists display correctly in published posts
- [x] Lists work in both light and dark mode
- [x] Nested lists work properly

---

## Performance Impact

### Before Fixes

- ❌ Image uploads failed over 1MB
- ❌ Multiple error toasts appearing
- ❌ Confusing user experience
- ❌ Lists not functional

### After Fixes

- ✅ Image uploads work up to 5MB/3MB
- ✅ Single, specific error messages
- ✅ Clear user feedback
- ✅ All editor features working
- ✅ No performance degradation
- ✅ Consistent behavior across the app

---

## Additional Notes

### Next.js Server Actions Body Size Limit

The `bodySizeLimit` configuration accepts:

- String values: `"1mb"`, `"5mb"`, `"10mb"`, etc.
- Number values: bytes (e.g., `5242880` for 5MB)
- Default if not specified: `1mb`

### Multiple Re-renders Issue

The "multiple error" issue was caused by:

1. Toast loading messages not being properly dismissed
2. Server retrying the request after 413 error
3. Error being logged multiple times in development mode

All resolved by:

- Using specific toast IDs
- Increasing body size limit to prevent 413 errors
- Better error handling preventing cascading errors

### Future Improvements

Consider adding:

1. Image compression on client-side before upload
2. Progress indicators for large file uploads
3. Retry logic for network failures
4. More granular error codes from server

---

## Deployment Notes

### Required Actions

1. ✅ Restart Next.js development server for config changes to take effect
2. ✅ Clear browser cache to ensure new CSS is loaded
3. ✅ Test all upload scenarios before deploying to production

### No Database Changes Required

All fixes are code-level changes only. No schema migrations needed.

### Backward Compatibility

✅ All changes are backward compatible
✅ Existing posts will display correctly
✅ No breaking changes to API

---

## Summary

All three issues have been successfully resolved:

1. ✅ **Body Size Limit**: Increased to 6MB in `next.config.ts`
2. ✅ **Error Messages**: Updated error handlers in 3 components to show specific messages
3. ✅ **Tiptap Lists**: Added explicit prose list styling classes to 2 components

The lifestyle posts system is now fully functional with proper error handling, working lists, and support for the advertised file sizes.
