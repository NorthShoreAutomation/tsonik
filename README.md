# Tsonik

[![npm version](https://img.shields.io/npm/v/tsonik.svg)](https://www.npmjs.com/package/tsonik)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/NorthShoreAutomation/tsonik/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/NorthShoreAutomation/tsonik/actions/workflows/unit-tests.yml)
[![Lint Status](https://github.com/NorthShoreAutomation/tsonik/actions/workflows/lint.yml/badge.svg)](https://github.com/NorthShoreAutomation/tsonik/actions/workflows/lint.yml)

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

### Getting Started

First, you'll need to obtain your Iconik API credentials:

1. Log in to your Iconik instance
2. Go to Settings → API Keys
3. Create a new API key to get your `appId` and `authToken`

```typescript
import { Tsonik } from "tsonik";

const client = new Tsonik({
  appId: "your-app-id",
  authToken: "your-auth-token",
  baseUrl: "https://app.iconik.io", // optional, defaults to https://app.iconik.io
  debug: true, // optional
});

// Example usage
async function exampleUsage() {
  try {
    // Get a single asset
    const asset = await client.assets.getAsset("asset-id");
    console.log("Asset:", asset.data);

    // List assets with filters
    const assets = await client.assets.listAssets({
      per_page: 10,
      sort: "date_created",
    });
    console.log("Assets:", assets.data);

    // Create a new asset
    const newAsset = await client.assets.createAsset({
      title: "My New Asset",
      description: "Asset description",
    });
    console.log("New asset:", newAsset.data);

    // Get a collection
    const collection = await client.collections.getCollection("collection-id");
    console.log("Collection:", collection.data);

    // List collections
    const collections = await client.collections.listCollections({ per_page: 5 });
    console.log("Collections:", collections.data);

    // Create a collection
    const newCollection = await client.collections.createCollection({
      title: "My Collection",
      category: "project",
    });
    console.log("New collection:", newCollection.data);

    // Direct HTTP methods are also available
    const response = await client.get("/custom-endpoint");
    console.log("Custom response:", response.data);

    // Get client info
    const clientInfo = client.getClientInfo();
    console.log("Client info:", clientInfo);

  } catch (error) {
    console.error("API Error:", error);
  }
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
