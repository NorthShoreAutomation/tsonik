---
layout: default
title: Usage Examples  
---

# Usage Examples

Real-world examples of how to use Tsonik for common media asset management tasks.

## 📋 Table of Contents

- [🎬 Assets](#assets) - Create, read, update, delete assets
- [📁 Collections](#collections) - Organize assets into collections  
- [⚙️ Jobs](#jobs) - Manage transcoding and processing jobs
- [📄 Files](#files) - Work with asset files
- [📦 FileSets](#filesets) - Manage file collections
- [🎞️ Formats](#formats) - Handle different media formats
- [🏷️ Metadata](#metadata) - Advanced metadata operations
- [🎯 TypeScript Best Practices](#typescript-best-practices) - Type-safe development
- [⚠️ Error Handling](#error-handling) - Robust error management  
- [📄 Pagination](#pagination) - Handle large result sets

## 🎬 Assets

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
  sort: 'date_created',
  filter: { status: 'ACTIVE' }
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

## 📁 Collections

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

## ⚙️ Jobs

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

## 📄 Files

### Getting Asset Files

```typescript
const files = await client.files.getAssetFiles('asset-id', {
  per_page: 50,
  page: 1
});
console.log(`Found ${files.data.objects.length} files`);
```

### Getting a Specific Asset File

```typescript
const file = await client.files.getAssetFile('asset-id', 'file-id');
console.log(`File: ${file.data.name}`);
console.log(`Size: ${file.data.size} bytes`);
```

### Creating an Asset File

```typescript
const file = await client.files.createAssetFile('asset-id', {
  name: 'video.mp4',
  storage_id: 'storage-123'
});
console.log(`Created file: ${file.data.id}`);
```

## 📦 FileSets

### Getting Asset FileSets

```typescript
const filesets = await client.filesets.getAssetFilesets('asset-id', {
  per_page: 20,
  page: 1
});
console.log(`Found ${filesets.data.objects.length} filesets`);
```

### Getting a Specific FileSet

```typescript
const fileset = await client.filesets.getAssetFileset('asset-id', 'fileset-id');
console.log(`FileSet: ${fileset.data.name}`);
```

### Creating a FileSet

```typescript
const fileset = await client.filesets.createAssetFileset('asset-id', {
  name: 'Raw Footage',
  storage_id: 'storage-123'
});
console.log(`Created fileset: ${fileset.data.id}`);
```

### Deleting a FileSet

```typescript
await client.filesets.deleteAssetFileset('asset-id', 'fileset-id', {
  delete_files: true
});
console.log('FileSet deleted successfully');
```

## 🎞️ Formats

### Getting Asset Formats

```typescript
const formats = await client.formats.getAssetFormats('asset-id', {
  per_page: 20,
  include_all_versions: false
});
console.log(`Found ${formats.data.objects.length} formats`);
```

### Getting a Specific Format

```typescript
const format = await client.formats.getAssetFormat('asset-id', 'format-id');
console.log(`Format: ${format.data.name}`);
console.log(`Status: ${format.data.status}`);
console.log(`Archive Status: ${format.data.archive_status}`);
```

### Creating a Format

```typescript
const newFormat = await client.formats.createAssetFormat('asset-id', {
  name: 'HD Version',
  status: 'ACTIVE',
  components: [{
    name: 'video-component',
    type: 'VIDEO'
  }]
});
console.log(`Created format: ${newFormat.data.id}`);
```

### Updating a Format

```typescript
await client.formats.updateAssetFormat('asset-id', 'format-id', {
  name: 'Updated Format Name',
  status: 'ACTIVE'
});
console.log('Format updated successfully');
```

### Replacing a Format (PUT)

```typescript
await client.formats.replaceAssetFormat('asset-id', 'format-id', {
  name: 'Completely New Format',
  status: 'ACTIVE',
  components: [{
    name: 'new-component',
    type: 'VIDEO'
  }]
});
console.log('Format replaced successfully');
```

## 🏷️ Metadata

### Getting Metadata

```typescript
const metadata = await client.metadata.getMetadata(
  'assets',  // object type
  'asset-123', // object ID
  {
    check_if_subclip: false,
    include_values_for_deleted_fields: false
  }
);

console.log('Metadata:', metadata.data.metadata_values);
console.log('Object ID:', metadata.data.object_id);
console.log('Object Type:', metadata.data.object_type);
```

### Updating Metadata

```typescript
await client.metadata.putMetadata(
  'assets',  // object type
  'asset-123', // object ID
  {
    metadata_values: {
      'title': {
        field_values: [{ value: 'New Title' }],
        mode: 'overwrite'
      },
      'description': {
        field_values: [{ value: 'Updated description' }],
        mode: 'overwrite'
      },
      'custom.project': {
        field_values: [{ value: 'My Project' }],
        mode: 'overwrite'
      }
    }
  },
  {
    ignore_unchanged: true
  }
);
```

## ⚠️ Error Handling

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

## 🎯 TypeScript Best Practices

### Using Interfaces for Type Safety

Instead of inline objects, use TypeScript interfaces for better type safety and maintainability:

```typescript
import { Tsonik } from 'tsonik';
import type { 
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateCollectionRequest,
  JobCreate,
  ListParams
} from 'tsonik';

// ✅ GOOD: Using typed interfaces for complex objects
const assetData: CreateAssetRequest = {
  title: 'Professional Video Asset',
  type: 'ASSET',
  description: 'High-quality marketing video',
  category: 'marketing',
  tags: ['campaign', 'q4', 'video']
};

const newAsset = await client.assets.createAsset(assetData);

// ✅ GOOD: Using interface for list parameters
const listParams: ListParams = {
  limit: 100,
  offset: 0,
  sort: 'date_created',
  filter: {
    category: 'marketing',
    status: 'ACTIVE'
  }
};

const assets = await client.assets.listAssets(listParams);
```

### Custom Business Logic Interfaces

```typescript
interface MarketingAssetConfig {
  campaignName: string;
  quarter: string;
  targetAudience: string[];
  budget: number;
}

async function createMarketingAsset(
  client: Tsonik, 
  config: MarketingAssetConfig
): Promise<string> {
  const assetData: CreateAssetRequest = {
    title: `${config.campaignName} Asset`,
    type: 'ASSET',
    category: 'marketing',
    description: `Marketing asset for ${config.quarter} campaign`,
    metadata: {
      'campaign.name': config.campaignName,
      'campaign.quarter': config.quarter,
      'campaign.budget': config.budget.toString(),
      'campaign.audience': config.targetAudience.join(',')
    }
  };

  const result = await client.assets.createAsset(assetData);
  return result.data.id;
}
```

### Complex Job Creation with Types

```typescript
const jobData: JobCreate = {
  title: 'Transcode Marketing Video',
  type: 'TRANSCODE',
  status: 'READY',
  custom_type: 'marketing_workflow',
  object_id: assetId,
  object_type: 'assets',
  metadata: {
    'encoding.preset': 'high_quality',
    'workflow.priority': 'high'
  }
};

const job = await client.jobs.createJob(jobData);
```

## 📄 Pagination

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