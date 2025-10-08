# Next.js Dev Server Restart Guide

## When to Restart

You **MUST** restart the Next.js dev server after making changes to:

- `next.config.ts` or `next.config.js`
- `.env` files (environment variables)
- `middleware.ts`
- Any configuration files in the root directory

## How to Restart

### Method 1: Graceful Restart (Recommended)

1. In the terminal where your dev server is running
2. Press `Ctrl+C` to stop the server
3. Run `npm run dev` (or `yarn dev`) to start again

### Method 2: Force Kill Processes

If the server doesn't stop gracefully:

```bash
# Find processes on port 3000
lsof -ti:3000

# Kill them
kill -9 $(lsof -ti:3000)

# Restart the server
npm run dev
```

## Common Issues

### Issue: "Body exceeded 1 MB limit" Error

**Cause**: Made changes to `serverActions.bodySizeLimit` in `next.config.ts` but didn't restart the server.

**Solution**: Restart the dev server using the methods above.

### Issue: Environment Variables Not Loading

**Cause**: Changed `.env` files but server is still using old values.

**Solution**: Restart the dev server using the methods above.

### Issue: Port 3000 Already in Use

**Cause**: Previous server process didn't terminate properly.

**Solution**:

```bash
kill -9 $(lsof -ti:3000)
npm run dev
```

## Current Configuration

The current `next.config.ts` has:

```typescript
serverActions: {
  bodySizeLimit: "6mb", // Supports up to 6MB uploads
}
```

This allows:

- Featured images: up to 5MB
- Editor images: up to 3MB
- Metadata overhead: ~1MB buffer
