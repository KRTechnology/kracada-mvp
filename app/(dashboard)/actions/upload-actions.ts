"use server";

import {
  cloudflareUploadService,
  UploadResult,
} from "@/lib/cloudflare/upload-service";
import { z } from "zod";

// Validation schemas
const profilePictureSchema = z.object({
  file: z.instanceof(File),
  userId: z.string().min(1),
});

const cvUploadSchema = z.object({
  file: z.instanceof(File),
  userId: z.string().min(1),
});

// Types for client-side usage
export type ProfilePictureUploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export type CVUploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(
  formData: FormData
): Promise<ProfilePictureUploadResult> {
  try {
    // Extract data from FormData
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    console.log("Upload attempt:", { fileName: file?.name, userId });

    // Validate input
    const validation = profilePictureSchema.safeParse({ file, userId });
    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    // Validate file type (images only)
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      return {
        success: false,
        error:
          "Invalid file type. Please upload a valid image file (JPEG, PNG, WebP, or GIF).",
      };
    }

    // Validate file size (5MB limit for images)
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: "Image size exceeds 5MB limit.",
      };
    }

    // Upload file
    console.log("Starting file upload...");
    const result: UploadResult = await cloudflareUploadService.uploadFile({
      file,
      folder: `profile-pictures/${userId}`,
      filename: `profile-picture-${Date.now()}`,
    });

    console.log("Upload result:", result);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Upload failed",
      };
    }

    // TODO: Update user profile picture in database
    // await updateUserProfilePicture(userId, result.url);

    return {
      success: true,
      url: result.url,
    };
  } catch (error) {
    console.error("Profile picture upload error:", error);

    // Check if it's an environment variable error
    if (
      error instanceof Error &&
      error.message.includes("Missing required environment variable")
    ) {
      return {
        success: false,
        error:
          "Cloudflare R2 is not configured. Please set up environment variables.",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred during upload.",
    };
  }
}

/**
 * Upload CV file
 */
export async function uploadCV(formData: FormData): Promise<CVUploadResult> {
  try {
    // Extract data from FormData
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    console.log("CV upload attempt:", { fileName: file?.name, userId });

    // Validate input
    const validation = cvUploadSchema.safeParse({ file, userId });
    if (!validation.success) {
      console.error("CV validation failed:", validation.error);
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      return {
        success: false,
        error: "Invalid file type. Please upload a PDF file.",
      };
    }

    // Validate file size (10MB limit for CVs)
    const MAX_CV_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_CV_SIZE) {
      return {
        success: false,
        error: "CV file size exceeds 10MB limit.",
      };
    }

    // Upload file
    console.log("Starting CV upload...");
    const result: UploadResult = await cloudflareUploadService.uploadFile({
      file,
      folder: `cvs/${userId}`,
      filename: `cv-${Date.now()}.pdf`,
    });

    console.log("CV upload result:", result);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Upload failed",
      };
    }

    // TODO: Update user CV in database
    // await updateUserCV(userId, result.url);

    return {
      success: true,
      url: result.url,
    };
  } catch (error) {
    console.error("CV upload error:", error);

    // Check if it's an environment variable error
    if (
      error instanceof Error &&
      error.message.includes("Missing required environment variable")
    ) {
      return {
        success: false,
        error:
          "Cloudflare R2 is not configured. Please set up environment variables.",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred during upload.",
    };
  }
}

/**
 * Delete uploaded file
 */
export async function deleteUploadedFile(
  key: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await cloudflareUploadService.deleteFile(key);
    return result;
  } catch (error) {
    console.error("File deletion error:", error);
    return {
      success: false,
      error: "Failed to delete file",
    };
  }
}
