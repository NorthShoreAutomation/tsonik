---
layout: default
title: API Reference
---

# API Reference

Complete reference for all Tsonik client methods with examples.

## Client Configuration

### Tsonik

```typescript
new Tsonik(config: IconikConfig)
```

**Parameters:**
- `config.appId: string` - Your Iconik App ID
- `config.authToken: string` - Your authentication token  
- `config.baseUrl?: string` - Base URL (default: "https://app.iconik.io")
- `config.timeout?: number` - Request timeout in ms (default: 30000)

**Example:**
```typescript
const client = new Tsonik({
  appId: 'my-app-id',
  authToken: 'my-auth-token',
  baseUrl: 'https://custom.iconik.instance.com',
  timeout: 60000
});
```

## Assets (`client.assets`)

### `listAssets(params?)`

Get a paginated list of assets.

**Parameters:**
```typescript
interface ListParams {
  limit?: number;        // Max items per page
  offset?: number;       // Number of items to skip
  sort?: string;         // Sort field
  filter?: object;       // Filter criteria
}
```

**Example:**
```typescript
const assets = await client.assets.listAssets({
  limit: 50,
  offset: 0,
  sort: 'date_created',
  filter: { status: 'ACTIVE' }
});
```

### `getAsset(id)`

Get a specific asset by ID.

**Example:**
```typescript
const asset = await client.assets.getAsset('asset-123');
console.log(asset.data.title);
```

### `createAsset(data)`

Create a new asset.

**Parameters:**
```typescript
interface CreateAssetRequest {
  title: string;
  category?: string;
  external_id?: string;
  type?: AssetType;
  description?: string;
  metadata?: MetadataRecord;
  tags?: string[];
  collection_ids?: string[];
  custom_metadata?: MetadataRecord;
}
```

**Example:**
```typescript
const asset = await client.assets.createAsset({
  title: 'My New Video',
  type: 'ASSET',
  description: 'A sample video',
  category: 'video'
});
```

### `updateAsset(id, data)`

Update an existing asset.

**Parameters:**
```typescript
interface UpdateAssetRequest {
  title?: string;
  category?: string;
  status?: AssetStatus;
  description?: string;
  metadata?: MetadataRecord;
  tags?: string[];
  collection_ids?: string[];
  custom_metadata?: MetadataRecord;
}
```

**Example:**
```typescript
await client.assets.updateAsset('asset-123', {
  title: "Updated Title",
  description: "Updated description"
});
```

### `deleteAsset(id)`

Delete an asset.

**Example:**
```typescript
await client.assets.deleteAsset('asset-123');
```

## Collections (`client.collections`)

### `listCollections(params?)`

Get a paginated list of collections.

**Example:**
```typescript
const collections = await client.collections.listCollections({
  limit: 20,
  offset: 0
});
```

### `getCollection(id)`

Get a specific collection.

**Example:**
```typescript
const collection = await client.collections.getCollection('collection-123');
```

### `createCollection(data)`

Create a new collection.

**Parameters:**
```typescript
interface CreateCollectionRequest {
  title: string;
  description?: string;
  // ... other collection properties
}
```

**Example:**
```typescript
const collection = await client.collections.createCollection({
  title: "Marketing Assets Q4",
  description: "All assets for Q4 marketing campaign"
});
```

### `updateCollection(id, data, options?)`

Update a collection.

**Example:**
```typescript
await client.collections.updateCollection('collection-123', {
  title: "Updated Collection Name",
  description: "New description"
});
```

### `replaceCollection(id, data, options?)`

Replace a collection (PUT operation).

**Example:**
```typescript
await client.collections.replaceCollection('collection-123', {
  title: "Completely New Collection",
  description: "This replaces all collection data"
});
```

### `deleteCollection(id)`

Delete a collection.

**Example:**
```typescript
const result = await client.collections.deleteCollection('collection-123');
```

## Jobs (`client.jobs`)

### `listJobs(params?)`

Get a paginated list of jobs.

**Example:**
```typescript
const jobs = await client.jobs.listJobs({
  limit: 100,
  offset: 0,
  sort: "date_created"
});
```

### `getJob(id)`

Get a specific job.

**Example:**
```typescript
const job = await client.jobs.getJob('job-123');
console.log(`Status: ${job.data.status}`);
```

### `createJob(data)`

Create a new job.

**Example:**
```typescript
const job = await client.jobs.createJob({
  title: "Transcoding Job",
  type: "TRANSCODE",
  status: "READY"
});
```

### `updateJob(id, data)`

Update a job.

**Example:**
```typescript
await client.jobs.updateJob('job-123', {
  title: "Updated Job Title",
  status: "IN_PROGRESS"
});
```

### `deleteJob(id)`

Delete a job.

**Example:**
```typescript
await client.jobs.deleteJob('job-123');
```

### `bulkEdit(data)`

Update multiple jobs at once.

**Example:**
```typescript
await client.jobs.bulkEdit({
  job_ids: ['job-1', 'job-2', 'job-3'],
  updates: {
    status: "CANCELLED"
  }
});
```

### `bulkDelete(jobIds)`

Delete multiple jobs at once.

**Example:**
```typescript
await client.jobs.bulkDelete(['job-1', 'job-2']);
```

## Files (`client.files`)

### `getFile(id)`

Get file details.

**Example:**
```typescript
const file = await client.files.getFile('file-123');
console.log(`${file.data.name} - ${file.data.size} bytes`);
```

### `updateFile(id, data)`

Update file metadata.

**Example:**
```typescript
await client.files.updateFile('file-123', {
  name: "updated-filename.mp4"
});
```

### `deleteFile(id)`

Delete a file.

**Example:**
```typescript
await client.files.deleteFile('file-123');
```

## FileSets (`client.filesets`)

### `getAssetFilesets(assetId, params?)`

Get all file sets for a specific asset.

**Parameters:**
```typescript
interface AssetFileSetsListParams {
  per_page?: number;     // Items per page
  last_id?: string;      // Last item ID for pagination
  file_count?: boolean;  // Include file count in response
}
```

**Example:**
```typescript
const filesets = await client.filesets.getAssetFilesets('asset-123', {
  per_page: 10,
  file_count: true
});
console.log(`Found ${filesets.data.objects.length} filesets`);
```

### `getAssetFileset(assetId, fileSetId)`

Get a specific file set for an asset by ID.

**Example:**
```typescript
const fileset = await client.filesets.getAssetFileset('asset-123', 'fileset-456');
console.log(`Fileset: ${fileset.data.name}`);
```

### `createAssetFileset(assetId, filesetData)`

Create a new file set for an asset.

**Parameters:**
```typescript
interface CreateFileSetRequest {
  base_dir: string;
  component_ids: string[];
  format_id: string;
  name: string;
  archive_file_set_id?: string;
  date_deleted?: string;
  file_dir?: string;
  is_archive?: boolean;
  metadata?: Record<string, string | number | boolean | object>[];
  original_storage_id?: string;
  status?: 'ACTIVE' | 'DELETED' | 'ARCHIVED';
  storage_id?: string;
  version_id?: string;
}
```

**Example:**
```typescript
const fileset = await client.filesets.createAssetFileset('asset-123', {
  name: "Raw Footage",
  base_dir: "/media/raw",
  component_ids: ["comp-1", "comp-2"],
  format_id: "format-123",
  storage_id: "storage-456",
  status: "ACTIVE"
});
```

### `deleteAssetFileset(assetId, fileSetId, options?)`

Delete a file set for an asset.

**Parameters:**
```typescript
interface DeleteFileSetOptions {
  keep_source?: boolean;   // Keep source files when deleting
  immediately?: boolean;   // Delete immediately (returns 204) vs soft delete (returns 200)
}
```

**Example:**
```typescript
// Soft delete (default)
await client.filesets.deleteAssetFileset('asset-123', 'fileset-456');

// Delete immediately
await client.filesets.deleteAssetFileset('asset-123', 'fileset-456', {
  immediately: true
});

// Keep source files
await client.filesets.deleteAssetFileset('asset-123', 'fileset-456', {
  keep_source: true
});
```

### `getFileSetFiles(assetId, fileSetId, options?)`

Get files from a file set.

**Parameters:**
```typescript
interface FileSetFilesListParams {
  per_page?: number;              // Items per page
  last_id?: string;               // Last item ID for pagination
  generate_signed_url?: boolean;  // Generate signed URLs for file access
  file_count?: boolean;           // Include file count in response
}
```

**Example:**
```typescript
const files = await client.filesets.getFileSetFiles('asset-123', 'fileset-456', {
  per_page: 20,
  generate_signed_url: true
});

files.data.objects.forEach(file => {
  console.log(`File: ${file.name} (${file.size} bytes)`);
  if (file.url) {
    console.log(`Download URL: ${file.url}`);
  }
});
```

## Metadata (`client.metadata`)

### `getMetadata(objectType, objectId, params?)`

Get metadata for an object.

**Parameters:**
- `objectType: string` - Object type ('assets', 'collections', etc.)
- `objectId: string` - Object ID
- `params?: GetMetadataParams` - Optional parameters

```typescript
interface GetMetadataParams {
  check_if_subclip?: boolean;
  include_values_for_deleted_fields?: boolean;
}
```

**Example:**
```typescript
const metadata = await client.metadata.getMetadata(
  'assets',
  'asset-123',
  {
    check_if_subclip: false,
    include_values_for_deleted_fields: false
  }
);

console.log(metadata.data.metadata_values);
```

### `putMetadata(objectType, objectId, metadataData, params?)`

Update metadata for an object.

**Parameters:**
- `objectType: string` - Object type ('assets', 'collections', etc.)
- `objectId: string` - Object ID
- `metadataData: UpdateMetadataRequest` - Metadata to update
- `params?: PutMetadataParams` - Optional parameters

```typescript
interface UpdateMetadataRequest {
  metadata_values: MetadataValuesForUpdate;
  date_created?: string;
  date_modified?: string;
  job_id?: string;
  object_id?: string;
  object_type?: string;
  version_id?: string;
}

interface MetadataValuesForUpdate {
  [fieldName: string]: {
    field_values: Array<{ [key: string]: unknown }>;
    mode?: 'overwrite' | 'append';
    date_created?: string;
  };
}
```

**Example:**
```typescript
await client.metadata.putMetadata(
  'assets',
  'asset-123',
  {
    metadata_values: {
      'title': {
        field_values: [{ value: 'New Title' }],
        mode: 'overwrite'
      },
      'custom.category': {
        field_values: [{ value: 'Educational' }],
        mode: 'overwrite'
      }
    }
  },
  {
    ignore_unchanged: true
  }
);
```

## Formats (`client.formats`)

### Format-related operations

The formats resource provides access to format information and management.

## Low-Level HTTP Methods

The client also provides direct HTTP methods for custom API calls:

### `get<T>(path, config?)`

Make a GET request.

**Example:**
```typescript
const response = await client.get('/API/assets/v1/custom-endpoint');
```

### `post<T>(path, data?, config?)`

Make a POST request.

**Example:**
```typescript
const response = await client.post('/API/assets/v1/custom-endpoint', {
  custom: 'data'
});
```

### `put<T>(path, data?, config?)`

Make a PUT request.

### `patch<T>(path, data?, config?)`

Make a PATCH request.

### `delete<T>(path, config?)`

Make a DELETE request.

## Error Types

### IconikError

Base error class for all Tsonik errors.

### IconikAPIError

API-specific errors with detailed information.

**Properties:**
- `message: string` - Error description
- `status: number` - HTTP status code
- `details?: any` - Additional error details from API

**Example:**
```typescript
try {
  await client.assets.getAsset('invalid-id');
} catch (error) {
  if (error instanceof IconikAPIError) {
    console.log(`API Error ${error.status}: ${error.message}`);
    if (error.details) {
      console.log('Details:', error.details);
    }
  }
}
```

### IconikAuthError

Authentication-specific errors (401 responses).

**Example:**
```typescript
try {
  await client.assets.listAssets();
} catch (error) {
  if (error instanceof IconikAuthError) {
    console.log('Authentication failed - check your credentials');
  }
}
```

## Response Types

### ApiResponse<T>

Standard response wrapper for all API calls.

```typescript
interface ApiResponse<T> {
  data: T;           // The response data
  status: number;    // HTTP status code  
  headers: object;   // Response headers
}
```

### PaginatedResponse<T>

Response format for paginated results.

```typescript
interface PaginatedResponse<T> {
  objects: T[];      // Array of items
  count: number;     // Total item count
  next: string;      // Next page URL
  previous: string;  // Previous page URL
}
```