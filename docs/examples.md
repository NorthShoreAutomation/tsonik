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
- [🔄 Retry Configuration](#retry-configuration) - Automatic retry examples
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
// Basic listing
const filesets = await client.filesets.getAssetFilesets('asset-id');
console.log(`Found ${filesets.data.objects.length} filesets`);

// With pagination and options
const paginatedFilesets = await client.filesets.getAssetFilesets('asset-id', {
  per_page: 20,
  file_count: true
});
console.log(`Found ${paginatedFilesets.data.objects.length} filesets with file counts`);
```

### Getting a Specific FileSet

```typescript
const fileset = await client.filesets.getAssetFileset('asset-id', 'fileset-id');
console.log(`FileSet: ${fileset.data.name}`);
console.log(`Status: ${fileset.data.status}`);
console.log(`File Count: ${fileset.data.file_count}`);
```

### Creating a FileSet

```typescript
const fileset = await client.filesets.createAssetFileset('asset-id', {
  name: 'Raw Footage',
  base_dir: '/media/raw',
  component_ids: ['comp-1', 'comp-2'],
  format_id: 'format-123',
  storage_id: 'storage-456',
  status: 'ACTIVE'
});
console.log(`Created fileset: ${fileset.data.id}`);

// Creating an archive fileset
const archiveFileset = await client.filesets.createAssetFileset('asset-id', {
  name: 'Archived Raw Footage',
  base_dir: '/archive/raw',
  component_ids: ['comp-1'],
  format_id: 'format-123',
  storage_id: 'archive-storage',
  is_archive: true,
  archive_file_set_id: 'original-fileset-id',
  original_storage_id: 'original-storage'
});
```

### Deleting a FileSet

```typescript
// Soft delete (default - returns fileset with DELETED status)
await client.filesets.deleteAssetFileset('asset-id', 'fileset-id');
console.log('FileSet soft deleted successfully');

// Delete immediately (returns 204 No Content)
await client.filesets.deleteAssetFileset('asset-id', 'fileset-id', {
  immediately: true
});
console.log('FileSet deleted immediately');

// Delete but keep source files
await client.filesets.deleteAssetFileset('asset-id', 'fileset-id', {
  keep_source: true
});
console.log('FileSet deleted, source files preserved');

// Combine options
await client.filesets.deleteAssetFileset('asset-id', 'fileset-id', {
  keep_source: true,
  immediately: true
});
```

### Getting Files from a FileSet

```typescript
// Get files from a fileset
const files = await client.filesets.getFileSetFiles('asset-id', 'fileset-id', {
  per_page: 50,
  generate_signed_url: true
});

console.log(`Found ${files.data.objects.length} files in fileset`);
files.data.objects.forEach(file => {
  console.log(`File: ${file.name} (${file.size} bytes)`);
  if (file.url) {
    console.log(`Download URL: ${file.url}`);
  }
});
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

### Automatic Retry Handling

Tsonik includes automatic retry functionality, but you can still customize it:

```typescript
const clientWithRetry = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: {
    attempts: 5,
    retryOnStatus: [500, 502, 503, 504], // Retry on server errors
    maxDelay: 10000, // Max 10 second delay
  },
});

// This will automatically retry on server errors
const asset = await clientWithRetry.assets.getAsset('asset-id');
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

## 🔄 Retry Configuration

Tsonik includes automatic retry functionality with intelligent defaults. The examples below show different retry configurations.

### Basic Retry Configuration

```typescript
// Default retry behavior - already enabled
const client = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  debug: true, // Enable debug logging to see retry attempts
});

// This will automatically retry on failures
const assets = await client.assets.listAssets({ limit: 10 });
console.log(`✅ Successfully retrieved ${assets.data.objects.length} assets`);
```

### Custom Retry Settings

```typescript
const customClient = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: {
    attempts: 5,           // More attempts
    minDelay: 200,         // Start with 200ms delay
    maxDelay: 10000,       // Max 10 second delay
    factor: 1.5,           // Gentler backoff
    randomize: 0.2,        // More jitter
    retryOnMethods: ['GET', 'HEAD', 'OPTIONS'], // Safe methods only
  },
});

const asset = await customClient.assets.getAsset('some-asset-id');
console.log(`✅ Retrieved asset: ${asset.data.title}`);
```

### Using Retry Presets

```typescript
import { Tsonik, RetryPresets } from 'tsonik';

// Conservative preset: 2 attempts, read-only methods
const conservativeClient = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: RetryPresets.conservative(),
});

// Aggressive preset: 5 attempts, includes write methods
const aggressiveClient = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: RetryPresets.aggressive(),
});

// Rate limit preset: Only retry on 429 responses
const rateLimitClient = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: RetryPresets.rateLimit(),
});
```

### Disabling Retry

```typescript
// Disable retry for specific scenarios
const noRetryClient = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: {
    enabled: false, // No retries
  },
});

const collections = await noRetryClient.collections.listCollections();
console.log(`✅ Got ${collections.data.objects.length} collections (no retry)`);
```

### Custom Retry Logic

```typescript
const smartRetryClient = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: {
    attempts: 3,
    shouldRetry: (error: unknown, attemptNumber: number) => {
      // Custom logic: only retry on specific errors
      if (attemptNumber >= 2) return false;
      
      // Check if it's a rate limit error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 429) {
          console.log('💤 Rate limited, will retry...');
          return true;
        }
      }
      
      // Check for network errors
      if (error && typeof error === 'object' && 'code' in error) {
        const networkError = error as any;
        if (networkError.code === 'ECONNRESET') {
          console.log('🔌 Connection reset, will retry...');
          return true;
        }
      }
      
      return false; // Don't retry other errors
    },
  },
});

const jobs = await smartRetryClient.jobs.listJobs();
console.log(`✅ Got ${jobs.data.objects.length} jobs (smart retry)`);
```

### Method-Specific Retry

```typescript
// Different retry behavior for read vs write operations
const readClient = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: {
    attempts: 5,
    retryOnMethods: ['GET', 'HEAD', 'OPTIONS'], // Only safe methods
    maxDelay: 30000,
  },
});

const writeClient = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
  retry: {
    attempts: 2, // Fewer attempts for write operations
    retryOnMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH'],
    retryOnStatus: [500, 502, 503, 504], // Only server errors
    maxDelay: 5000, // Shorter delays
  },
});

// Read operations with aggressive retry
const assets = await readClient.assets.listAssets();
console.log(`✅ Read ${assets.data.objects.length} assets with aggressive retry`);

// Write operations with conservative retry
const newAsset = await writeClient.assets.createAsset({
  title: 'Test Asset',
  type: 'ASSET',
});
console.log(`✅ Created asset: ${newAsset.data.id}`);
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