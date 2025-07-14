# Tsonik

[![npm version](https://img.shields.io/npm/v/tsonik.svg)](https://www.npmjs.com/package/tsonik)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/brantg/tsonik/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/brantg/tsonik/actions/workflows/unit-tests.yml)
[![Lint Status](https://github.com/brantg/tsonik/actions/workflows/lint.yml/badge.svg)](https://github.com/brantg/tsonik/actions/workflows/lint.yml)

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
  baseUrl: "https://app.iconik.io/v1", // optional
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

## Releasing New Versions

This project uses semantic-release for automated versioning and publishing. When adding new features or fixing bugs:

### Automated Release Process

1. Make changes and write tests
2. Use [Conventional Commits](https://www.conventionalcommit.org/) format for your commit messages:
   - `feat: add new feature` - for features (minor version bump)
   - `fix: resolve bug` - for bug fixes (patch version bump)
   - Add `BREAKING CHANGE:` in commit body for breaking changes (major version bump)
3. Create a pull request to the `main` branch
4. After merging to `main`, semantic-release will automatically:
   - Determine the next version number based on your commits
   - Generate/update CHANGELOG.md
   - Create a GitHub Release
   - Publish to npm

### Manual Release Process

If needed, trigger a manual release:

1. Go to GitHub Actions → "Version and Release" workflow
2. Click "Run workflow" and select the version type (patch/minor/major)

For more detailed instructions, see [the full release guide](docs/RELEASE_GUIDE.md).
# Pre-commit hooks configured
