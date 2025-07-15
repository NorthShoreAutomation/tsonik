---
layout: default
title: Usage Examples
---

# Usage Examples

Real-world examples of how to use Tsonik for common tasks.

## Assets

### Creating an Asset

```typescript
const newAsset = await client.assets.create({
  title: "My Video File",
  type: "assets",
  status: "ACTIVE"
});

console.log(`Created asset: ${newAsset.data.id}`);
```

### Searching Assets

```typescript
// Search by title
const results = await client.assets.search({
  query: "video AND conference",
  sort: ["-date_created"]
});

// Filter by metadata
const filtered = await client.assets.list({
  metadata: {
    "custom.project": "Marketing Campaign"
  }
});
```

### Updating Asset Metadata

```typescript
await client.assets.update('asset-id', {
  title: "Updated Title",
  metadata: {
    "custom.category": "Educational",
    "custom.tags": ["training", "onboarding"]
  }
});
```

## Collections

### Creating a Collection

```typescript
const collection = await client.collections.create({
  title: "Q4 Marketing Assets",
  description: "All marketing materials for Q4 campaign",
  type: "collections"
});
```

### Adding Assets to Collection

```typescript
await client.collections.addAssets('collection-id', [
  'asset-id-1',
  'asset-id-2',
  'asset-id-3'
]);
```

## Jobs

### Creating a Transcription Job

```typescript
const job = await client.jobs.create({
  type: "transcription",
  asset_id: "asset-id",
  priority: "NORMAL",
  metadata: {
    language: "en-US",
    model: "enhanced"
  }
});

console.log(`Job created: ${job.data.id}`);
```

### Monitoring Job Progress

```typescript
const checkJobStatus = async (jobId: string) => {
  const job = await client.jobs.get(jobId);
  
  console.log(`Status: ${job.data.status}`);
  console.log(`Progress: ${job.data.progress}%`);
  
  if (job.data.status === 'FINISHED') {
    console.log('Job completed successfully!');
    return true;
  } else if (job.data.status === 'FAILED') {
    console.log('Job failed:', job.data.error_message);
    return false;
  }
  
  return null; // Still processing
};
```

## Error Handling

### Retry Logic

```typescript
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof IconikAPIError && error.status >= 500) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};

// Usage
const asset = await retryOperation(() => 
  client.assets.get('asset-id')
);
```