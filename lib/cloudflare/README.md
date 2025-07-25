# Cloudflare R2 Upload Service Setup

This guide will help you set up Cloudflare R2 for file uploads in your application using the AWS S3 SDK (since R2 is S3-compatible).

## Prerequisites

1. A Cloudflare account
2. Access to Cloudflare R2 (requires a paid plan or R2 subscription)

## Setup Steps

### 1. Create an R2 Bucket

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage** in the sidebar
3. Click **Create bucket**
4. Choose a unique bucket name (e.g., `your-app-uploads`)
5. Select your preferred region
6. Click **Create bucket**

### 2. Configure Bucket Public Access

To serve uploaded files publicly, you need to configure your bucket:

1. Go to your bucket settings
2. Navigate to **Settings** > **Public access**
3. Configure a custom domain or use the R2.dev subdomain
4. Note the public URL - this will be your `CLOUDFLARE_R2_PUBLIC_URL`

### 3. Get R2 API Credentials

1. In your R2 dashboard, click **Manage R2 API tokens**
2. Click **Create API Token**
3. Configure the token with these permissions:
   - **Permissions**: Object Read & Write
   - **Resources**: Include the specific bucket(s) you want to access
4. Copy the **Access Key ID** and **Secret Access Key** (NOT the API token)
5. Also note your **Account ID** from the R2 dashboard

### 4. Configure Environment Variables

Add these variables to your `.env.local` file:

```env
CLOUDFLARE_ACCOUNT_ID="your-account-id-here"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id-here"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-access-key-here"
CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name-here"
CLOUDFLARE_R2_PUBLIC_URL="https://your-bucket-public-url.com"
```

### 5. Set Up CORS (Optional)

If you plan to upload files directly from the browser to R2, configure CORS:

1. Go to your bucket settings
2. Navigate to **Settings** > **CORS policy**
3. Add a CORS policy similar to:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Technical Implementation

This service uses the AWS S3 SDK (@aws-sdk/client-s3) to interact with Cloudflare R2 because:

1. **S3 Compatibility**: R2 provides an S3-compatible API
2. **Mature Ecosystem**: AWS SDK is well-maintained and feature-rich
3. **Easy Migration**: If you ever need to switch between S3 and R2, the code changes are minimal

## File Organization

The upload service organizes files in this structure:

```
bucket/
├── profile-pictures/
│   └── {userId}/
│       └── profile-picture-{timestamp}
└── cvs/
    └── {userId}/
        └── cv-{timestamp}.pdf
```

## Supported File Types

- **Profile Pictures**: JPEG, JPG, PNG, WebP, GIF (max 5MB)
- **CV Files**: PDF only (max 10MB)

## Usage

The upload service is automatically configured when you provide the required environment variables. The `ProfilePictureCard` component uses server actions to handle uploads securely.

## Security Features

- File type validation
- File size limits
- User-specific folders
- Server-side upload handling
- Unique filename generation
- S3-compatible metadata storage

## Cost Considerations

Cloudflare R2 pricing (as of 2024):

- Storage: $0.015 per GB per month
- Class A operations (writes): $4.50 per million requests
- Class B operations (reads): $0.36 per million requests
- **No egress fees** (major advantage over AWS S3)

This makes R2 very cost-effective for file storage, especially for applications with high download traffic.

## Troubleshooting

### Upload Fails

1. Check that all environment variables are correctly set
2. Verify your R2 API credentials have the correct permissions
3. Ensure your bucket name is correct
4. Check Cloudflare dashboard for any service issues

### Files Not Accessible

1. Verify bucket public access is configured
2. Check that your public URL is correct
3. Ensure CORS is configured if accessing from browser

### AWS SDK Errors

1. Make sure you're using the correct endpoint format: `https://{account-id}.r2.cloudflarestorage.com`
2. Verify the region is set to 'auto'
3. Check that your credentials are properly formatted

### Large File Uploads

For files larger than the current limits, you may need to:

1. Increase the limits in the upload service
2. Implement multipart upload for very large files
3. Consider using presigned URLs for direct browser uploads

## Next Steps

- Implement database updates to store file URLs
- Add file deletion functionality
- Set up image optimization/transformation
- Implement presigned URLs for direct uploads
- Add support for additional file types
