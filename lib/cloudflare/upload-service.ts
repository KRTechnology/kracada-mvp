import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";

// Types
export interface UploadOptions {
  file: File;
  folder?: string;
  filename?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface CloudflareR2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

class CloudflareR2UploadService {
  private s3Client: S3Client;
  private config: CloudflareR2Config;

  constructor(config: CloudflareR2Config) {
    this.config = config;

    // Validate account ID format (should be 32 characters)
    if (!config.accountId || config.accountId.length !== 32) {
      console.error(
        "Invalid account ID format. Account ID should be 32 characters long."
      );
      console.log("Current account ID length:", config.accountId?.length);
    }

    // Try different endpoint formats for better compatibility
    const possibleEndpoints = [
      `https://${config.accountId}.r2.cloudflarestorage.com`,
      `https://r2.cloudflarestorage.com`,
    ];

    const endpoint = possibleEndpoints[0]; // Start with the standard format

    // Log configuration for debugging (without sensitive data)
    console.log("Initializing R2 client with config:", {
      accountId: config.accountId,
      accountIdLength: config.accountId?.length,
      bucketName: config.bucketName,
      publicUrl: config.publicUrl,
      endpoint: endpoint,
      accessKeyIdLength: config.accessKeyId?.length,
      secretKeyLength: config.secretAccessKey?.length,
    });

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // Use path-style addressing for R2 compatibility
      forcePathStyle: true,
      // Add proper SSL configuration for Node.js v22
      requestHandler: {
        requestTimeout: 30000,
        connectionTimeout: 5000,
      },
    });
  }

  /**
   * Upload a file to Cloudflare R2
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    try {
      const { file, folder = "uploads", filename } = options;

      // Validate file
      if (!file || file.size === 0) {
        return {
          success: false,
          error: "No file provided or file is empty",
        };
      }

      // Validate file size (50MB limit)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: "File size exceeds 50MB limit",
        };
      }

      // Generate unique filename if not provided
      const fileExtension = file.name.split(".").pop() || "";
      const uniqueFilename = filename || `${createId()}.${fileExtension}`;
      const key = `${folder}/${uniqueFilename}`;

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to R2 using the AWS S3 SDK
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          "original-name": file.name,
          "upload-timestamp": new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);

      // Construct public URL
      const publicUrl = `${this.config.publicUrl}/${key}`;

      return {
        success: true,
        url: publicUrl,
        key: key,
      };
    } catch (error) {
      console.error("Cloudflare R2 upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  /**
   * Delete a file from Cloudflare R2
   */
  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return { success: true };
    } catch (error) {
      console.error("Cloudflare R2 delete error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      };
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      console.error("Get metadata error:", error);
      return null;
    }
  }
}

// Create singleton instance
function createCloudflareR2UploadService(): CloudflareR2UploadService {
  const requiredEnvVars = {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  };

  // Validate environment variables with detailed logging
  const missingVars: string[] = [];
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      const envVarName = `CLOUDFLARE_R2_${key.toUpperCase()}`;
      missingVars.push(envVarName);
      console.error(`Missing required environment variable: ${envVarName}`);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables for Cloudflare R2: ${missingVars.join(", ")}. Please add these to your .env.local file.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  console.log("Cloudflare R2 service initialized successfully");
  return new CloudflareR2UploadService(requiredEnvVars as CloudflareR2Config);
}

export const cloudflareUploadService = createCloudflareR2UploadService();
export { CloudflareR2UploadService };
