# CV Optimization Feature Implementation

## Overview

This document outlines the complete implementation of the CV optimization feature with integrated Paystack payment processing, secure file uploads, and order management.

## Features

### 🎯 Core Functionality

- **Package Selection**: Three-tier pricing with distinct service offerings
- **Secure Payment Processing**: Paystack integration with webhook verification
- **Protected Upload System**: Payment verification before CV upload access
- **Order Tracking**: Complete order lifecycle management
- **File Management**: Secure CV upload to Cloudflare R2 storage

### 📦 Package Tiers

| Package     | Price   | Revisions | Delivery       | Includes                                              |
| ----------- | ------- | --------- | -------------- | ----------------------------------------------------- |
| **Deluxe**  | ₦20,000 | Up to 2   | 3 working days | Professional CV Writing                               |
| **Supreme** | ₦30,000 | Up to 3   | 5 working days | CV Writing + Cover Letter                             |
| **Premium** | ₦45,000 | Up to 5   | 7 working days | CV + Cover Letter + LinkedIn Profile + Interview Prep |

## Architecture

### Database Schema

#### CV Optimization Orders (`cv_optimization_orders`)

```sql
- id (varchar, primary key)
- userId (varchar, foreign key to users)
- packageType (enum: deluxe, supreme, premium)
- packageName (varchar)
- packagePrice (decimal)
- packageDescription (text)
- paymentReference (varchar, unique)
- paystackTransactionId (varchar)
- paymentStatus (enum: pending, successful, failed, refunded)
- orderStatus (enum: pending_payment, payment_verified, cv_uploaded, in_progress, completed, cancelled)
- cvFileUrl (varchar)
- cvFileKey (varchar)
- optimizedCvUrl (varchar)
- maxRevisions (integer)
- revisionsUsed (integer)
- estimatedDeliveryDays (integer)
- customerNotes (text)
- adminNotes (text)
- createdAt (timestamp)
- updatedAt (timestamp)
```

#### Payment Transactions (`cv_payment_transactions`)

```sql
- id (varchar, primary key)
- orderId (varchar, foreign key to cv_optimization_orders)
- userId (varchar, foreign key to users)
- paystackReference (varchar, unique)
- paystackTransactionId (varchar)
- paystackStatus (varchar)
- amount (decimal)
- currency (varchar)
- customerEmail (varchar)
- customerPhone (varchar)
- channel (varchar)
- gatewayResponse (text)
- paymentMethod (varchar)
- webhookData (text, JSON)
- verifiedAt (timestamp)
- verificationStatus (varchar)
```

### File Structure

```
app/
├── cv-optimization/
│   ├── page.tsx                          # Package selection page
│   ├── CVOptimizationContent.tsx         # Main pricing component with Paystack
│   ├── upload/
│   │   ├── page.tsx                      # Upload page wrapper
│   │   └── CVUploadContent.tsx           # Secure upload component
│   └── success/
│       ├── page.tsx                      # Success page wrapper
│       └── CVSuccessContent.tsx          # Order confirmation component
├── api/
│   └── webhooks/
│       └── paystack/
│           └── route.ts                  # Paystack webhook handler
└── (dashboard)/
    └── actions/
        └── cv-optimization-actions.ts   # Server actions

lib/
└── db/
    └── schema/
        └── cv-optimization.ts           # Database schema
```

## Implementation Details

### 1. Payment Flow

#### Package Selection & Payment

```typescript
// CVOptimizationContent.tsx
const handlePaymentSuccess = async (reference: any) => {
  const result = await createCVOptimizationOrder(
    selectedPackage as "deluxe" | "supreme" | "premium",
    reference.reference
  );

  if (result.success) {
    router.push(`/cv-optimization/upload?ref=${reference.reference}`);
  }
};

const getPaystackConfig = (pkg: PricingPackage) => ({
  reference: `cv_opt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
  email: session.user.email,
  amount: pkg.priceInKobo, // Amount in kobo
  currency: "NGN",
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  onSuccess: handlePaymentSuccess,
  onClose: handlePaymentClose,
});
```

#### Webhook Processing

```typescript
// app/api/webhooks/paystack/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  // Verify webhook signature
  if (!verifyPaystackSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  switch (event.event) {
    case "charge.success":
      await handleChargeSuccess(event.data);
      break;
    case "charge.failed":
      await handleChargeFailed(event.data);
      break;
  }
}
```

### 2. Secure Upload System

#### Payment Verification

```typescript
// CVUploadContent.tsx
useEffect(() => {
  async function verifyPayment() {
    if (!paymentReference || !session?.user?.id) {
      setVerificationStatus("unauthorized");
      return;
    }

    const orderResult = await getOrderByPaymentReference(paymentReference);

    if (
      orderResult.success &&
      orderResult.order.paymentStatus === "successful"
    ) {
      setVerificationStatus("verified");
    } else {
      // Try to verify with Paystack API
      const verificationResult =
        await verifyPaymentAndUpdateOrder(paymentReference);
      setVerificationStatus(
        verificationResult.verified ? "verified" : "failed"
      );
    }
  }
}, [paymentReference, session]);
```

#### File Upload & Order Update

```typescript
const handleSubmit = async () => {
  // Upload CV to Cloudflare R2
  const uploadResult = await uploadCV(formData);

  // Update order with CV details
  const updateResult = await updateOrderWithCV(
    orderDetails.id,
    uploadResult.url!,
    uploadResult.key!,
    customerNotes.trim() || undefined
  );

  if (updateResult.success) {
    router.push(`/cv-optimization/success?orderId=${orderDetails.id}`);
  }
};
```

### 3. Order Management

#### Server Actions

```typescript
// cv-optimization-actions.ts
export async function createCVOptimizationOrder(
  packageType: "deluxe" | "supreme" | "premium",
  paymentReference: string
): Promise<CreateOrderResult> {
  const session = await auth();
  const packageInfo = packages[packageType];

  await db.insert(cvOptimizationOrders).values({
    id: createId(),
    userId: session.user.id,
    packageType,
    packageName: packageInfo.name,
    packagePrice: (packageInfo.price / 100).toString(),
    paymentReference,
    orderStatus: "pending_payment",
    paymentStatus: "pending",
  });
}
```

## Environment Variables

### Required Environment Variables

```env
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here

# Database
DATABASE_URL=your_database_connection_string

# Cloudflare R2 (for file uploads)
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_ENDPOINT=your_endpoint_url
```

## Paystack Configuration

### Webhook URL Setup

#### 1. **Webhook URL** (Required)

```
https://yourdomain.com/api/webhooks/paystack
```

**Purpose**: Receives real-time payment notifications from Paystack
**Events to Subscribe**:

- `charge.success`
- `charge.failed`

#### 2. **Callback URL** (Optional but Recommended)

```
https://yourdomain.com/cv-optimization/upload
```

**Purpose**: Fallback URL where users are redirected after payment
**Note**: Our implementation handles success via the `onSuccess` callback in the PaystackButton component, but this serves as a backup.

### Paystack Dashboard Configuration

1. **Login to Paystack Dashboard**
2. **Navigate to Settings → Webhooks**
3. **Add Webhook URL**: `https://yourdomain.com/api/webhooks/paystack`
4. **Select Events**:
   - ✅ `charge.success`
   - ✅ `charge.failed`
5. **Save Configuration**

### Testing with Paystack

#### Test Card Details

```
Card Number: 4084 0840 8408 4081
Expiry: Any future date
CVV: Any 3-digit number
```

## Security Features

### 1. **Payment Verification**

- Webhook signature verification using HMAC SHA512
- Double verification: webhook + API verification
- Payment reference uniqueness validation

### 2. **Access Control**

- User authentication required
- Order ownership validation
- Payment status verification before upload access

### 3. **File Upload Security**

- File type validation (PDF, DOCX only)
- File size limits (10MB max)
- Secure storage in Cloudflare R2
- Unique file paths per user

## API Endpoints

### Webhook Endpoint

```
POST /api/webhooks/paystack
Content-Type: application/json
Headers:
  - x-paystack-signature: HMAC signature
```

### Server Actions

- `createCVOptimizationOrder(packageType, paymentReference)`
- `verifyPaymentAndUpdateOrder(paymentReference)`
- `getOrderByPaymentReference(paymentReference)`
- `getOrderById(orderId)`
- `updateOrderWithCV(orderId, cvFileUrl, cvFileKey, customerNotes)`

## Migration & Deployment

### 1. **Database Migration**

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

### 2. **Environment Setup**

- Configure Paystack keys
- Set up Cloudflare R2 bucket
- Configure webhook URL in Paystack dashboard

### 3. **Testing Checklist**

- [ ] Package selection displays correctly
- [ ] Paystack payment modal opens
- [ ] Test payment completes successfully
- [ ] Webhook receives payment notification
- [ ] Upload page verifies payment
- [ ] CV upload works correctly
- [ ] Success page displays order details
- [ ] Order status updates properly

## Error Handling

### Payment Verification Failures

- **Invalid Payment Reference**: Redirect to package selection
- **Payment Not Found**: Show payment verification failed message
- **Webhook Signature Invalid**: Return 400 error

### Upload Failures

- **File Validation Errors**: Show specific error messages
- **Upload to Cloudflare Fails**: Retry mechanism built-in
- **Order Update Fails**: Roll back file upload

## Monitoring & Logging

### Key Metrics to Monitor

- Payment success/failure rates
- Upload completion rates
- Order status progression
- Webhook delivery success

### Log Points

- Payment verification attempts
- File upload attempts
- Order status changes
- Webhook processing results

## Future Enhancements

### Potential Features

- **Email Notifications**: Order confirmations and status updates
- **Admin Dashboard**: Order management and CV optimization workflow
- **Progress Tracking**: Real-time order status updates
- **Review System**: Customer feedback and ratings
- **Bulk Discounts**: Multiple CV optimization packages

### Technical Improvements

- **Queue System**: Background job processing for file uploads
- **Redis Caching**: Order status and payment verification caching
- **Analytics**: Payment funnel and conversion tracking
- **Testing**: Comprehensive test suite for payment flows

## Support & Troubleshooting

### Common Issues

#### 1. **Payment not verifying**

- Check webhook URL is reachable
- Verify webhook signature validation
- Confirm environment variables are correct

#### 2. **Upload page access denied**

- Verify payment reference in URL
- Check order exists in database
- Confirm user authentication

#### 3. **File upload failures**

- Check Cloudflare R2 configuration
- Verify file size and type restrictions
- Review network connectivity

### Contact Information

For technical support or questions about this implementation, contact the development team.

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: Development Team
