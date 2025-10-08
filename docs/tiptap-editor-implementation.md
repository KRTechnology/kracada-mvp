# Tiptap Rich Text Editor Implementation Guide

## Overview

This document provides detailed information about the Tiptap rich text editor implementation in the Kracada application. Tiptap is a headless, framework-agnostic rich text editor that provides a flexible and customizable editing experience.

## Table of Contents

1. [What is Tiptap?](#what-is-tiptap)
2. [Installation](#installation)
3. [Architecture](#architecture)
4. [Component Structure](#component-structure)
5. [Extensions Used](#extensions-used)
6. [Image Upload Implementation](#image-upload-implementation)
7. [Styling and Theming](#styling-and-theming)
8. [Content Storage](#content-storage)
9. [Security Considerations](#security-considerations)
10. [Customization Guide](#customization-guide)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## What is Tiptap?

Tiptap is a renderless and extendable rich-text editor framework for React (and other frameworks). Unlike traditional WYSIWYG editors:

- **Headless**: You have full control over the UI and styling
- **Extensible**: Add or remove features as needed
- **Framework-agnostic**: Works with React, Vue, Svelte, and vanilla JavaScript
- **Accessible**: Built with accessibility in mind
- **Performant**: Fast and lightweight

### Why Tiptap?

1. **Full Control**: Complete control over UI and user experience
2. **TypeScript Support**: Fully typed for better developer experience
3. **Modern**: Built for modern web applications
4. **Flexible**: Easy to add custom functionality
5. **Active Development**: Well-maintained with regular updates

## Installation

### Required Packages

The following packages are required and already in `package.json`:

```json
{
  "@tiptap/react": "^3.4.4",
  "@tiptap/starter-kit": "^3.4.4",
  "@tiptap/pm": "^3.4.4"
}
```

### Additional Extensions

If you need more extensions in the future:

```bash
# For tables
npm install @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header

# For mentions
npm install @tiptap/extension-mention @tiptap/suggestion

# For collaboration
npm install @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor

# For YouTube embeds
npm install @tiptap/extension-youtube

# For code highlighting
npm install @tiptap/extension-code-block-lowlight lowlight
```

## Architecture

### Component Hierarchy

```
TiptapEditor (components/specific/lifestyle/TiptapEditor.tsx)
├── useEditor Hook (from @tiptap/react)
│   ├── StarterKit Extension
│   ├── Image Extension
│   ├── Link Extension
│   └── Placeholder Extension
├── Toolbar (Custom)
│   ├── Text Formatting Buttons
│   ├── Heading Buttons
│   ├── List Buttons
│   ├── Insert Buttons (Image, Link)
│   └── Undo/Redo Buttons
└── EditorContent (from @tiptap/react)
```

### Data Flow

```
User Input → Tiptap Editor → HTML Output → State Management → Form Submission → Database
```

## Component Structure

### TiptapEditor Component

Location: `components/specific/lifestyle/TiptapEditor.tsx`

```typescript
interface TiptapEditorProps {
  content: string; // Initial HTML content
  onChange: (content: string) => void; // Callback on content change
  userId: string; // Required for image uploads
  postId?: string; // Optional, for organizing images
  placeholder?: string; // Editor placeholder
  editable?: boolean; // Control editability
}
```

### Editor Initialization

```typescript
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3], // Only H1, H2, H3
      },
    }),
    Image.configure({
      inline: true,
      allowBase64: false, // Security: Don't allow base64 images
      HTMLAttributes: {
        class: "rounded-lg max-w-full h-auto my-4",
      },
    }),
    Link.configure({
      openOnClick: false, // Don't open links while editing
      HTMLAttributes: {
        class: "text-orange-500 hover:text-orange-600 underline",
      },
    }),
    Placeholder.configure({
      placeholder: "Start writing...",
    }),
  ],
  content,
  editable,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  },
});
```

## Extensions Used

### 1. StarterKit

The StarterKit extension bundles commonly used extensions:

- **Bold**: `Ctrl/Cmd + B`
- **Italic**: `Ctrl/Cmd + I`
- **Strike**: `Ctrl/Cmd + Shift + X`
- **Code**: `` Ctrl/Cmd + ` ``
- **Paragraph**: Basic paragraph formatting
- **Heading**: H1-H6 (we limit to H1-H3)
- **Bullet List**: Unordered lists
- **Ordered List**: Numbered lists
- **Blockquote**: Quote blocks
- **Code Block**: Multi-line code
- **Horizontal Rule**: `---`
- **Hard Break**: `Shift + Enter`
- **History**: Undo/Redo functionality

**Configuration**:

```typescript
StarterKit.configure({
  heading: {
    levels: [1, 2, 3], // Limit to H1, H2, H3 only
  },
});
```

### 2. Image Extension

Handles image insertion and display.

**Features**:

- Insert images by URL
- Configurable sizing
- Custom styling via HTMLAttributes
- Integration with upload system

**Configuration**:

```typescript
Image.configure({
  inline: true, // Allow inline images
  allowBase64: false, // Don't allow base64 (security)
  HTMLAttributes: {
    class: "rounded-lg max-w-full h-auto my-4",
  },
});
```

**Usage**:

```typescript
editor.chain().focus().setImage({ src: imageUrl }).run();
```

### 3. Link Extension

Enables hyperlink functionality.

**Features**:

- Insert links
- Edit existing links
- Remove links
- Custom link styling

**Configuration**:

```typescript
Link.configure({
  openOnClick: false, // Don't follow links while editing
  HTMLAttributes: {
    class: "text-orange-500 hover:text-orange-600 underline",
  },
});
```

**Usage**:

```typescript
// Add link
editor.chain().focus().setLink({ href: url }).run();

// Remove link
editor.chain().focus().unsetLink().run();
```

### 4. Placeholder Extension

Shows placeholder text when editor is empty.

**Configuration**:

```typescript
Placeholder.configure({
  placeholder: "Start writing your post...",
});
```

## Image Upload Implementation

### Upload Flow

1. User clicks image button in toolbar
2. File input opens
3. User selects image file
4. Client-side validation (type, size)
5. Upload to Cloudflare R2 via server action
6. URL returned
7. Image inserted into editor at cursor position

### Implementation Details

```typescript
const handleImageUpload = useCallback(
  async (file: File) => {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Validate file size (3MB limit for editor images)
    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Image size exceeds 3MB limit");
      return;
    }

    try {
      toast.loading("Uploading image...");

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      if (postId) {
        formData.append("postId", postId);
      }

      // Upload via server action
      const result = await uploadLifestyleEditorImage(formData);

      toast.dismiss();

      if (result.success && result.url) {
        // Insert image into editor
        editor?.chain().focus().setImage({ src: result.url }).run();
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.dismiss();
      toast.error("An unexpected error occurred");
    }
  },
  [editor, userId, postId]
);
```

### Security Measures

1. **Client-side validation**: File type and size checks
2. **Server-side validation**: Double-check in server action
3. **No base64 images**: Only URLs allowed (prevents large payloads)
4. **Authenticated uploads**: User ID required
5. **Organized storage**: Images stored by user and post

## Styling and Theming

### Prose Styling

The editor content uses Tailwind's typography plugin:

```typescript
editorProps: {
  attributes: {
    class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 dark:prose-invert prose-headings:font-bold prose-p:text-neutral-700 dark:prose-p:text-neutral-300"
  }
}
```

### Dark Mode Support

- Uses `dark:prose-invert` for automatic dark mode styling
- Toolbar buttons adapt to theme
- Custom color classes for brand consistency

### Toolbar Styling

```typescript
className={`p-2 ${
  editor.isActive("bold")
    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
    : ""
}`}
```

## Content Storage

### Format

Content is stored as HTML in the database:

```html
<h2>Heading</h2>
<p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
<img src="https://..." alt="" class="rounded-lg max-w-full h-auto my-4" />
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>
```

### Rendering

On the frontend, use `dangerouslySetInnerHTML`:

```typescript
<div
  className="prose prose-lg max-w-none dark:prose-invert"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>
```

### Alternative: JSON Storage

For more control, you can store as JSON:

```typescript
// When saving
const json = editor.getJSON();
await savePost({ content: JSON.stringify(json) });

// When loading
const json = JSON.parse(post.content);
editor.commands.setContent(json);
```

## Security Considerations

### XSS Prevention

1. **Sanitize HTML**: Consider using a library like DOMPurify
2. **Content Security Policy**: Set appropriate CSP headers
3. **Input Validation**: Validate on both client and server
4. **No Script Tags**: Tiptap doesn't allow script tags by default

### Example Sanitization

```typescript
import DOMPurify from "isomorphic-dompurify";

// Before rendering
const cleanHTML = DOMPurify.sanitize(post.content, {
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "p",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "blockquote",
    "code",
    "pre",
  ],
  ALLOWED_ATTR: ["href", "src", "alt", "class"],
});
```

### Upload Security

1. **File Type Validation**: Both client and server
2. **File Size Limits**: Prevent large uploads
3. **Authenticated Uploads**: Require user login
4. **Virus Scanning**: Consider integrating virus scanning for uploads
5. **Rate Limiting**: Limit upload frequency per user

## Customization Guide

### Adding New Toolbar Buttons

```typescript
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => editor.chain().focus().toggleStrike().run()}
  className={`p-2 ${editor.isActive("strike") ? "bg-orange-100" : ""}`}
  title="Strikethrough"
>
  <Strikethrough className="w-4 h-4" />
</Button>
```

### Adding Custom Extensions

```typescript
import Underline from "@tiptap/extension-underline";

const editor = useEditor({
  extensions: [
    // ... existing extensions
    Underline,
  ],
});
```

### Custom Keyboard Shortcuts

```typescript
import { Extension } from "@tiptap/core";

const CustomShortcuts = Extension.create({
  name: "customShortcuts",
  addKeyboardShortcuts() {
    return {
      "Mod-s": () => {
        // Save post
        return true;
      },
      "Mod-Enter": () => {
        // Publish post
        return true;
      },
    };
  },
});
```

### Custom Node

```typescript
import { Node } from "@tiptap/core";

const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "callout" }, 0];
  },
});
```

## Troubleshooting

### Common Issues

#### 1. Editor Not Rendering

**Symptoms**: Blank screen where editor should be

**Solutions**:

- Check that all Tiptap packages are installed
- Verify no JavaScript errors in console
- Ensure `content` prop is a string (not undefined)
- Check React version compatibility

#### 2. Content Not Updating

**Symptoms**: Changes in editor don't reflect in parent component

**Solutions**:

- Verify `onChange` prop is provided and working
- Check that parent component state is updating
- Ensure no conflicting state management

#### 3. Toolbar Buttons Not Working

**Symptoms**: Clicking toolbar buttons has no effect

**Solutions**:

- Check `editor.chain().focus()` is called
- Verify button `onClick` handlers are correct
- Ensure editor is initialized (`if (!editor) return`)

#### 4. Images Not Uploading

**Symptoms**: Upload fails or images don't appear

**Solutions**:

- Check Cloudflare R2 environment variables
- Verify file size and type
- Check server action is being called
- Review network tab for errors

#### 5. Styling Issues

**Symptoms**: Editor looks broken or unstyled

**Solutions**:

- Verify Tailwind CSS is configured
- Check prose plugin is installed
- Ensure custom classes are in Tailwind config
- Check dark mode classes are applied

### Debug Mode

Enable debug mode to see what's happening:

```typescript
const editor = useEditor({
  extensions: [...],
  onUpdate: ({ editor }) => {
    console.log('Content updated:', editor.getHTML());
    onChange(editor.getHTML());
  },
  onCreate: ({ editor }) => {
    console.log('Editor created');
  },
  onSelectionUpdate: ({ editor }) => {
    console.log('Selection updated');
  },
});
```

## Best Practices

### Performance

1. **Debounce onChange**: Prevent excessive updates

```typescript
const debouncedOnChange = useMemo(
  () => debounce((html: string) => onChange(html), 300),
  [onChange]
);
```

2. **Lazy Load Extensions**: Only load what you need
3. **Optimize Images**: Compress before upload
4. **Limit History Size**: Configure history extension

### User Experience

1. **Auto-save**: Implement periodic auto-saving
2. **Loading States**: Show loading during uploads
3. **Error Handling**: Provide clear error messages
4. **Keyboard Shortcuts**: Show shortcut hints in tooltips
5. **Mobile Support**: Test on mobile devices

### Content Quality

1. **Character Limits**: Warn users about very long content
2. **Image Optimization**: Compress images automatically
3. **Alt Text**: Encourage/require alt text for images
4. **Heading Structure**: Guide users to use headings properly
5. **Link Validation**: Validate URLs before insertion

### Accessibility

1. **Keyboard Navigation**: Ensure all features work with keyboard
2. **Screen Reader Support**: Use proper ARIA labels
3. **Focus Management**: Manage focus states properly
4. **Color Contrast**: Ensure sufficient contrast
5. **Alt Text**: Always include alt text for images

### Code Organization

1. **Separate Concerns**: Keep editor logic separate from form logic
2. **Reusable**: Make editor component reusable
3. **Type Safety**: Use TypeScript for all props and states
4. **Error Boundaries**: Wrap editor in error boundary
5. **Testing**: Write tests for critical functionality

## Advanced Features

### Auto-save Implementation

```typescript
useEffect(() => {
  if (!editor || !editorContent) return;

  const saveTimeout = setTimeout(() => {
    // Auto-save logic
    saveDraft(editorContent);
  }, 3000); // Save after 3 seconds of inactivity

  return () => clearTimeout(saveTimeout);
}, [editor, editorContent]);
```

### Word Count

```typescript
const wordCount = editor?.storage.characterCount?.words() || 0;
```

### Character Count

```typescript
import CharacterCount from '@tiptap/extension-character-count';

const editor = useEditor({
  extensions: [
    // ... other extensions
    CharacterCount.configure({
      limit: 10000,
    }),
  ],
});

// Display count
<div>{editor?.storage.characterCount?.characters()} characters</div>
```

### Collaboration (Future)

```typescript
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

const ydoc = new Y.Doc();
const provider = new WebrtcProvider("document-name", ydoc);

const editor = useEditor({
  extensions: [
    Collaboration.configure({
      document: ydoc,
    }),
  ],
});
```

## Resources

### Official Documentation

- [Tiptap Docs](https://tiptap.dev/)
- [Tiptap Examples](https://tiptap.dev/examples)
- [Tiptap API Reference](https://tiptap.dev/api)

### Community

- [GitHub Repository](https://github.com/ueberdosis/tiptap)
- [Discord Server](https://discord.gg/WtJ49jGshW)
- [GitHub Discussions](https://github.com/ueberdosis/tiptap/discussions)

### Tutorials

- [Building a Rich Text Editor](https://tiptap.dev/guide/custom-extensions)
- [Image Upload Tutorial](https://tiptap.dev/api/nodes/image)
- [Collaborative Editing](https://tiptap.dev/guide/collaborative-editing)

## Conclusion

The Tiptap editor provides a powerful, flexible, and customizable rich text editing experience. This implementation balances features with simplicity, providing everything needed for lifestyle blog posts while maintaining performance and security.

For questions or improvements, refer to the official Tiptap documentation or contact the development team.
