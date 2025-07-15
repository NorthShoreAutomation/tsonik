---
layout: default
title: Best Practices
---

# Best Practices

Guidelines for using Tsonik effectively and efficiently.

## Authentication & Security

### Environment Variables
Always use environment variables for credentials:

```typescript
// ✅ Good
const client = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!
});

// ❌ Bad
const client = new Tsonik({
  appId: 'hardcoded-app-id',
  authToken: 'hardcoded-token'
});
```

## Error Handling

### Specific Error Types
Handle different error types appropriately:

```typescript
import { IconikAPIError, IconikAuthError } from 'tsonik';

try {
  const asset = await client.assets.get('asset-id');
} catch (error) {
  if (error instanceof IconikAuthError) {
    console.log('Please check your credentials');
  } else if (error instanceof IconikAPIError) {
    if (error.status === 404) {
      console.log('Asset not found');
    } else if (error.status >= 500) {
      console.log('Server error - retry later');
    }
  }
}
```

## Performance Optimization

### Pagination
Always handle pagination properly:

```typescript
const getAllAssets = async () => {
  const allAssets = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await client.assets.list({
      limit,
      offset,
      sort: ['-date_created']
    });
    
    allAssets.push(...response.data.objects);
    
    if (response.data.objects.length < limit) {
      break; // No more pages
    }
    
    offset += limit;
  }
  
  return allAssets;
};
```

### Concurrent Operations
Use Promise.all for independent operations:

```typescript
// ✅ Good - Concurrent requests
const [assets, collections, jobs] = await Promise.all([
  client.assets.list({ limit: 50 }),
  client.collections.list({ limit: 20 }),
  client.jobs.list({ limit: 10 })
]);

// ❌ Bad - Sequential requests
const assets = await client.assets.list({ limit: 50 });
const collections = await client.collections.list({ limit: 20 });
const jobs = await client.jobs.list({ limit: 10 });
```

## TypeScript Best Practices

### Type Safety
Use proper TypeScript types:

```typescript
interface AssetMetadata {
  title: string;
  description?: string;
  'custom.project': string;
  'custom.category': 'video' | 'image' | 'audio';
  'custom.tags': string[];
}

const createAssetWithMetadata = async (metadata: AssetMetadata) => {
  return await client.assets.create({
    title: metadata.title,
    type: 'assets',
    metadata
  });
};
```