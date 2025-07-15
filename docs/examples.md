---
layout: default
title: Usage Examples
---

# Usage Examples

Real-world examples of how to use Tsonik for common tasks.

## Assets

### Creating an Asset

```typescript
const newAsset = await client.assets.createAsset({
  title: "My Video File",
  type: "ASSET",
  description: "A sample video file",
  category: "video"
});

console.log(`Created asset: ${newAsset.data.id}`);
```

### Listing Assets

```typescript
// Get all assets with pagination
const assets = await client.assets.listAssets({
  limit: 50,
  offset: 0
});

console.log(`Found ${assets.data.objects.length} assets`);

// List assets with filters
const filteredAssets = await client.assets.listAssets({
  limit: 20,
  offset: 0,
  sort: "date_created",
  filter: { status: "ACTIVE" }
});
```

### Getting a Single Asset

```typescript
const asset = await client.assets.getAsset('asset-id-here');
console.log(`Asset title: ${asset.data.title}`);
console.log(`Asset type: ${asset.data.type}`);
console.log(`Created: ${asset.data.created_date}`);
```

### Updating an Asset

```typescript
await client.assets.updateAsset('asset-id', {
  title: "Updated Title",
  description: "Updated description",
  category: "updated-category",
  tags: ["tag1", "tag2"]
});
```

### Deleting an Asset

```typescript
await client.assets.deleteAsset('asset-id');
console.log('Asset deleted successfully');
```

## Collections

### Creating a Collection

```typescript
const collection = await client.collections.createCollection({
  title: "Q4 Marketing Assets",
  description: "All marketing materials for Q4 campaign"
});

console.log(`Created collection: ${collection.data.id}`);
```

### Listing Collections

```typescript
const collections = await client.collections.listCollections({
  limit: 20,
  offset: 0
});

console.log(`Found ${collections.data.objects.length} collections`);
```

### Getting a Collection

```typescript
const collection = await client.collections.getCollection('collection-id');
console.log(`Collection: ${collection.data.title}`);
```

### Updating a Collection

```typescript
await client.collections.updateCollection('collection-id', {
  title: "Updated Collection Title",
  description: "Updated description"
});
```

### Replacing a Collection (PUT)

```typescript
await client.collections.replaceCollection('collection-id', {
  title: "Completely New Collection",
  description: "This replaces all collection data"
});
```

### Deleting a Collection

```typescript
const result = await client.collections.deleteCollection('collection-id');
console.log('Collection deleted:', result.data);
```

## Jobs

### Listing Jobs

```typescript
const jobs = await client.jobs.listJobs({
  limit: 50,
  offset: 0,
  sort: "date_created"
});

console.log(`Found ${jobs.data.objects.length} jobs`);
```

### Getting a Job

```typescript
const job = await client.jobs.getJob('job-id');
console.log(`Job status: ${job.data.status}`);
console.log(`Job type: ${job.data.type}`);
```

### Creating a Job

```typescript
const job = await client.jobs.createJob({
  title: "Transcoding Job",
  type: "TRANSCODE",
  status: "READY",
  custom_type: "video_encode"
});

console.log(`Created job: ${job.data.id}`);
```

### Updating a Job

```typescript
await client.jobs.updateJob('job-id', {
  title: "Updated Job Title",
  status: "IN_PROGRESS"
});
```

### Deleting a Job

```typescript
await client.jobs.deleteJob('job-id');
console.log('Job deleted successfully');
```

### Bulk Job Operations

```typescript
// Bulk edit jobs
const editResult = await client.jobs.bulkEdit({
  job_ids: ['job-1', 'job-2', 'job-3'],
  updates: {
    status: "CANCELLED"
  }
});

// Bulk delete jobs
const deleteResult = await client.jobs.bulkDelete(['job-1', 'job-2']);
```

## Files

### Getting a File

```typescript
const file = await client.files.getFile('file-id');
console.log(`File: ${file.data.name}`);
console.log(`Size: ${file.data.size} bytes`);
```

### Updating a File

```typescript
await client.files.updateFile('file-id', {
  name: "updated-filename.mp4",
  metadata: {
    "custom.encoding": "H.264"
  }
});
```

### Deleting a File

```typescript
await client.files.deleteFile('file-id');
console.log('File deleted successfully');
```

## FileSets

### Getting a FileSet

```typescript
const fileset = await client.filesets.getFileset('fileset-id');
console.log(`FileSet: ${fileset.data.name}`);
```

### Creating a FileSet

```typescript
const fileset = await client.filesets.createFileset({
  name: "Raw Footage",
  asset_id: "asset-123"
});

console.log(`Created fileset: ${fileset.data.id}`);
```

### Updating a FileSet

```typescript
await client.filesets.updateFileset('fileset-id', {
  name: "Updated FileSet Name"
});
```

### Deleting a FileSet

```typescript
await client.filesets.deleteFileset('fileset-id', {
  delete_files: true
});
```

## Metadata

### Getting Metadata

```typescript
const metadata = await client.metadata.getMetadata({
  object_id: 'asset-123',
  object_type: 'assets'
});

console.log('Metadata:', metadata.data.metadata);
```

### Updating Metadata

```typescript
await client.metadata.putMetadata({
  object_id: 'asset-123',
  object_type: 'assets',
  metadata: {
    title: "New Title",
    description: "Updated description",
    "custom.project": "My Project",
    "custom.status": "Review"
  }
});
```

## Error Handling

### Basic Error Handling

```typescript
try {
  const asset = await client.assets.getAsset('invalid-id');
} catch (error) {
  if (error instanceof IconikAPIError) {
    console.log(`API Error ${error.status}: ${error.message}`);
    console.log('Details:', error.details);
  } else if (error instanceof IconikAuthError) {
    console.log('Authentication failed - check your credentials');
  } else {
    console.log('Unexpected error:', error);
  }
}
```

### Retry Logic for Network Issues

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
  client.assets.getAsset('asset-id')
);
```

## Pagination

### Processing All Results

```typescript
const getAllAssets = async () => {
  const allAssets = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await client.assets.listAssets({
      limit,
      offset
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