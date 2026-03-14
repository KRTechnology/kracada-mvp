"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";
import { uploadNewsEditorImage } from "@/app/(dashboard)/actions/upload-actions";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Code,
} from "lucide-react";
import { Button } from "@/components/common/button";

interface NewsTiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  adminId: string;
  postId?: string;
  placeholder?: string;
  editable?: boolean;
}

export function NewsTiptapEditor({
  content,
  onChange,
  adminId,
  postId,
  placeholder = "Start writing your news post...",
  editable = true,
}: NewsTiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-orange-500 hover:text-orange-600 underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 dark:prose-invert prose-headings:font-bold prose-p:text-neutral-700 dark:prose-p:text-neutral-300",
      },
    },
  });

  // Handle image upload
  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Please upload a valid image file (JPEG, PNG, WebP, or GIF)"
        );
        return;
      }

      // Validate file size (3MB limit)
      const MAX_SIZE = 3 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        toast.error("Image size exceeds 3MB limit");
        return;
      }

      try {
        const loadingToast = toast.loading("Uploading image...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("adminId", adminId);
        if (postId) {
          formData.append("postId", postId);
        }

        const result = await uploadNewsEditorImage(formData);

        toast.dismiss(loadingToast);

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

        // Show the actual error message
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during upload";
        toast.error(errorMessage);
      }
    },
    [editor, adminId, postId]
  );

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle link insertion
  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Update link
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  if (!editable) {
    return (
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <EditorContent editor={editor} />
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
        {/* Heading Buttons */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        {/* Text Formatting */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 ${
            editor.isActive("bold")
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 ${
            editor.isActive("italic")
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 ${
            editor.isActive("code")
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 ${
            editor.isActive("bulletList")
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 ${
            editor.isActive("orderedList")
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 ${
            editor.isActive("blockquote")
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        {/* Insert Options */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={setLink}
          className={`p-2 ${
            editor.isActive("link")
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : ""
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="p-2"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
