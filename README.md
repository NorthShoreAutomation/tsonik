# Tsonik

A TypeScript client library for the Iconik API based on its Swagger documentation. Named after the original Python `nsa-pythonik` library, this is the TypeScript version.

## Features

- TypeScript-first with full type safety
- Promise-based API with async/await support
- Comprehensive error handling
- Built on Axios for reliable HTTP requests
- Auto-generated types from Swagger/OpenAPI specification
- Modern ES6+ JavaScript practices

## Installation

```bash
npm install tsonik
# or
yarn add tsonik
```

## Usage

```typescript
import { IconikClient } from "tsonik";

const client = new IconikClient({
  apiKey: "your-api-key",
  baseUrl: "https://api.iconik.io/v1", // optional
  debug: true, // optional
});

// ORM-like usage with Assets
try {
  // Get a single asset
  const asset = await client.assets.getAsset("asset-id");
  console.log("Asset:", asset.data);

  // List assets with filters
  const assets = await client.assets.listAssets({
    limit: 10,
    sort: "created_date",
    filter: { status: "active" },
  });
  console.log("Assets:", assets.data.objects);

  // Create a new asset
  const newAsset = await client.assets.createAsset({
    title: "My New Asset",
    description: "Asset description",
  });

  // Search assets
  const searchResults = await client.assets.search({
    query: "video files",
    limit: 20,
  });
} catch (error) {
  console.error("API Error:", error);
}

// ORM-like usage with Collections
try {
  // Get a collection
  const collection = await client.collections.getCollection("collection-id");

  // List collections
  const collections = await client.collections.listCollections({ limit: 5 });

  // Create a collection
  const newCollection = await client.collections.createCollection({
    title: "My Collection",
    description: "Collection of related assets",
  });

  // Get assets in a collection
  const collectionAssets = await client.collections.getAssets("collection-id");

  // Add assets to a collection
  await client.collections.addAssets("collection-id", ["asset-1", "asset-2"]);
} catch (error) {
  console.error("Collection Error:", error);
}

// Direct HTTP methods are also available
try {
  const response = await client.get("/custom-endpoint");
  console.log(response.data);
} catch (error) {
  console.error("API Error:", error);
}
```

## Development

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Run tests:

```bash
npm test
```

4. Run tests in watch mode:

```bash
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
