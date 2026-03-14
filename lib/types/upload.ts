// Upload-related types

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface BaseUploadResult {
  success: boolean;
  error?: string;
}

export interface SuccessfulUploadResult extends BaseUploadResult {
  success: true;
  url: string;
  key: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface FailedUploadResult extends BaseUploadResult {
  success: false;
  error: string;
  code?: string;
}

export type UploadResult = SuccessfulUploadResult | FailedUploadResult;

// File type constraints
export interface FileTypeConstraint {
  mimeTypes: string[];
  extensions: string[];
  maxSize: number; // in bytes
  description: string;
}

export const FILE_TYPE_CONSTRAINTS = {
  PROFILE_PICTURE: {
    mimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ],
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    maxSize: 5 * 1024 * 1024, // 5MB
    description: "Profile picture",
  },
  CV_DOCUMENT: {
    mimeTypes: ["application/pdf"],
    extensions: [".pdf"],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: "CV document",
  },
} as const satisfies Record<string, FileTypeConstraint>;

// Upload context types
export interface UploadContext {
  userId: string;
  folder: string;
  purpose: "profile-picture" | "cv" | "document" | "other";
}

// Server action response types
export interface ProfilePictureUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  key?: string;
}

export interface CVUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  key?: string;
}

// File metadata for database storage
export interface FileMetadata {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  key: string; // R2 object key
  folder: string;
  purpose: UploadContext["purpose"];
  uploadedAt: Date;
  deletedAt?: Date;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Upload service configuration
export interface CloudflareR2Config {
  apiToken: string;
  accountId: string;
  bucketName: string;
  publicUrl: string;
  region?: string;
}

// Utility types for component props
export interface UploadComponentProps {
  userId: string;
  onUploadSuccess?: (result: SuccessfulUploadResult) => void;
  onUploadError?: (error: FailedUploadResult) => void;
  onUploadProgress?: (progress: FileUploadProgress) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
}

// Status types for upload state management
export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadState {
  status: UploadStatus;
  progress?: FileUploadProgress;
  result?: UploadResult;
  error?: string;
}
