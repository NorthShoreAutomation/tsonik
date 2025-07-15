# Chainable API Design Document

## Overview

This document outlines a future enhancement to the Tsonik API client library that would provide a more fluent, chainable interface for working with related Iconik resources. The goal is to provide an intuitive way to navigate resource relationships, such as from assets to filesets to files.

## Current API Pattern

Currently, the API follows a traditional resource-based pattern:

```typescript
// Get an asset
const assetResponse = await client.assets.get('asset-123');
const asset = assetResponse.data;

// Get filesets for the asset
const filesetsResponse = await client.filesets.getAssetFilesets(asset.id);
const filesets = filesetsResponse.data;

// Get files for the asset
const filesResponse = await client.files.getAssetFiles(asset.id);
const files = filesResponse.data;

// Get a specific fileset
const filesetResponse = await client.filesets.getAssetFileset(asset.id, 'fileset-456');
const fileset = filesetResponse.data;

// Get files in a fileset
const filesetFilesResponse = await client.filesets.getFileSetFiles(asset.id, fileset.id);
const filesetFiles = filesetFilesResponse.data;
```

## Proposed Chainable API Pattern

The proposed enhancement would allow for a more fluent, chainable API:

```typescript
// Get an asset with enhanced methods
const asset = await client.assets.getEnhanced('asset-123');

// Get filesets for the asset
const filesets = await asset.getFilesets();

// Get files for the asset
const files = await asset.getFiles();

// Get a specific fileset with enhanced methods
const fileset = await asset.getFileset('fileset-456');

// Get files in a fileset
const filesetFiles = await fileset.getFiles();
```

## Implementation Approach

### 1. Enhanced Type Definitions

Create enhanced interfaces for each resource type:

```typescript
interface EnhancedAsset extends Asset {
  // Methods to fetch related resources
  getFilesets(options?: AssetFileSetsListParams): Promise<PaginatedResponse<EnhancedFileSet>>;
  getFileset(filesetId: string): Promise<EnhancedFileSet>;
  getFiles(options?: AssetFilesListParams): Promise<PaginatedResponse<EnhancedFile>>;
  getFile(fileId: string): Promise<EnhancedFile>;
}

interface EnhancedFileSet extends FileSet {
  getFiles(options?: FileSetFilesListParams): Promise<PaginatedResponse<EnhancedFile>>;
  getFile(fileId: string): Promise<EnhancedFile>;
}

interface EnhancedFile extends AssetFile {
  // Additional methods as needed
}
```

### 2. Factory Classes

Implement factory classes to transform API responses into enhanced objects:

```typescript
class AssetFactory {
  private client: Tsonik;
  
  constructor(client: Tsonik) {
    this.client = client;
  }
  
  enhance(asset: Asset): EnhancedAsset {
    const enhancedAsset = asset as EnhancedAsset;
    
    // Add methods for related resources
    enhancedAsset.getFilesets = async (options?: AssetFileSetsListParams) => {
      const response = await this.client.filesets.getAssetFilesets(asset.id, options);
      return {
        ...response,
        data: {
          ...response.data,
          objects: response.data.objects.map(fileset => FileSetFactory.enhance(fileset, this.client))
        }
      };
    };
    
    enhancedAsset.getFileset = async (filesetId: string) => {
      const response = await this.client.filesets.getAssetFileset(asset.id, filesetId);
      return FileSetFactory.enhance(response.data, this.client);
    };
    
    enhancedAsset.getFiles = async (options?: AssetFilesListParams) => {
      const response = await this.client.files.getAssetFiles(asset.id, options);
      return {
        ...response,
        data: {
          ...response.data,
          objects: response.data.objects.map(file => FileFactory.enhance(file, this.client))
        }
      };
    };
    
    enhancedAsset.getFile = async (fileId: string) => {
      const response = await this.client.files.getAssetFile(asset.id, fileId);
      return FileFactory.enhance(response.data, this.client);
    };
    
    return enhancedAsset;
  }
}
```

### 3. Enhanced Client

Create an enhanced client that uses the factory classes:

```typescript
class EnhancedTsonik extends Tsonik {
  private assetFactory: AssetFactory;
  private filesetFactory: FileSetFactory;
  private fileFactory: FileFactory;
  
  constructor(config: IconikConfig) {
    super(config);
    this.assetFactory = new AssetFactory(this);
    this.filesetFactory = new FileSetFactory(this);
    this.fileFactory = new FileFactory(this);
  }
  
  get enhancedAssets() {
    return {
      get: async (id: string): Promise<EnhancedAsset> => {
        const response = await this.assets.get(id);
        return this.assetFactory.enhance(response.data);
      },
      // Other methods...
    };
  }
  
  // Other enhanced resources...
}
```

### 4. Usage Example

```typescript
// Create enhanced client
const client = new EnhancedTsonik({
  baseUrl: 'https://app.iconik.io',
  appId: 'your-app-id',
  authToken: 'your-auth-token'
});

// Use chainable API
const asset = await client.enhancedAssets.get('asset-123');
const filesets = await asset.getFilesets();
const fileset = await asset.getFileset('fileset-456');
const files = await fileset.getFiles();
```

## Benefits and Considerations

### Benefits
1. More intuitive API for working with related resources
2. Reduced code verbosity
3. Better IDE autocomplete support for related resources
4. Makes resource relationships explicit in the API design

### Considerations
1. Backward compatibility with existing API
2. Additional type complexity
3. Potential performance overhead from object enhancement
4. Testing complexity for chainable methods

## Implementation Timeline

This enhancement is planned for a future version of the library. It will be implemented as an optional feature that can be used alongside the existing API pattern.

## Conclusion

The chainable API pattern provides a more intuitive way to work with related resources in the Iconik API. This design document outlines the approach for implementing this pattern while maintaining backward compatibility with the existing API.
