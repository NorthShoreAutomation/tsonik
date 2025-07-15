---
layout: default
title: API Reference
---

# API Reference

Complete reference for all Tsonik client methods with examples.

## Client Configuration

### Tsonik

```typescript
new Tsonik(config: TsonikConfig)
```

**Parameters:**
- `config.appId: string` - Your Iconik App ID
- `config.authToken: string` - Your authentication token  
- `config.baseURL?: string` - Base URL (default: "https://app.iconik.io")
- `config.timeout?: number` - Request timeout in ms (default: 30000)

**Example:**
```typescript
const client = new Tsonik({
  appId: 'my-app-id',
  authToken: 'my-auth-token',
  baseURL: 'https://custom.iconik.instance.com',
  timeout: 60000
});
```

## Assets (`client.assets`)

### `list(params?)`

Get a paginated list of assets.

**Example:**
```typescript
const assets = await client.assets.list({
  limit: 50,
  sort: ["-date_created"],
  metadata: { "custom.project": "Marketing" }
});
```

### `get(id)`

Get a specific asset by ID.

**Example:**
```typescript
const asset = await client.assets.get('asset-123');
console.log(asset.data.title);
```

### `create(data)`

Create a new asset.

**Example:**
```typescript
const asset = await client.assets.create({
  title: "My New Video",
  type: "assets",
  status: "ACTIVE",
  metadata: {
    "custom.category": "Training"
  }
});
```

### `update(id, data)`

Update an existing asset.

**Example:**
```typescript
await client.assets.update('asset-123', {
  title: "Updated Title",
  metadata: {
    "custom.reviewed": true
  }
});
```

### `search(query)`

Search assets using Iconik's search API.

**Example:**
```typescript
const results = await client.assets.search({
  query: "video AND marketing",
  sort: ["-date_created"],
  limit: 25
});
```

## Collections (`client.collections`)

### `list(params?)`

Get a paginated list of collections.

**Example:**
```typescript
const collections = await client.collections.list({
  limit: 20,
  sort: ["-date_modified"]
});
```

### `create(data)`

Create a new collection.

**Example:**
```typescript
const collection = await client.collections.create({
  title: "Marketing Assets Q4",
  description: "All assets for Q4 marketing campaign",
  type: "collections"
});
```

### `addAssets(id, assetIds)`

Add assets to a collection.

**Example:**
```typescript
await client.collections.addAssets('collection-123', [
  'asset-1',
  'asset-2',
  'asset-3'
]);
```

## Jobs (`client.jobs`)

### `list(params?)`

Get a paginated list of jobs.

**Example:**
```typescript
const jobs = await client.jobs.list({
  status: ['FINISHED', 'FAILED'],
  job_type: ['TRANSCODE'],
  limit: 100
});
```

### `create(data)`

Create a new job.

**Example:**
```typescript
const job = await client.jobs.create({
  type: 'TRANSCODE',
  asset_id: 'asset-123',
  priority: 'HIGH',
  metadata: {
    output_format: 'mp4',
    quality: 'high'
  }
});
```

## Error Types

### IconikAPIError

API-specific errors with detailed information.

**Example:**
```typescript
try {
  await client.assets.get('invalid-id');
} catch (error) {
  if (error instanceof IconikAPIError) {
    console.log(`API Error ${error.status}: ${error.message}`);
    if (error.details) {
      console.log('Details:', error.details);
    }
  }
}
```