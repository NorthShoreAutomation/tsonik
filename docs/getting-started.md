---
layout: default
title: Getting Started
---

# Getting Started with Tsonik
{: .page-title}

Tsonik is a modern TypeScript client library for the Iconik API that makes it easy to manage media assets, collections, jobs, and metadata.
{: .lead}

<div class="callout">
  <strong>💡 Prerequisites:</strong> You'll need Node.js 14+ and an Iconik account with API access.
</div>

## 📦 Installation

```bash
npm install tsonik
```

## Quick Setup

```typescript
import { Tsonik } from 'tsonik';

const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  baseURL: 'https://app.iconik.io' // optional, defaults to this
});
```

## Authentication

You'll need two things from your Iconik account:

1. **App ID** - Your application identifier
2. **Auth Token** - Your authentication token

Set these as environment variables:

```bash
export ICONIK_APP_ID="your-app-id"
export ICONIK_AUTH_TOKEN="your-auth-token"
```

Then use them in your code:

```typescript
const client = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!
});
```

## Your First Request

```typescript
// Get all assets
const assets = await client.assets.listAssets({
  limit: 50,
  offset: 0
});
console.log(`Found ${assets.data.objects.length} assets`);

// Get a specific asset
const asset = await client.assets.getAsset('asset-id-here');
console.log(`Asset title: ${asset.data.title}`);
```

## Error Handling

Tsonik provides detailed error information:

```typescript
try {
  const asset = await client.assets.get('invalid-id');
} catch (error) {
  if (error instanceof IconikAPIError) {
    console.log(`API Error: ${error.message}`);
    console.log(`Status: ${error.status}`);
    console.log(`Details:`, error.details);
  }
}
```

## Next Steps

- [Usage Examples](./examples.html) - See real-world examples
- [API Reference](./api-reference.html) - Complete method documentation
- [Best Practices](./best-practices.html) - Tips and patterns