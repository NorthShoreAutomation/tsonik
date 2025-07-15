# Tsonik

[![npm version](https://img.shields.io/npm/v/tsonik.svg)](https://www.npmjs.com/package/tsonik)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/NorthShoreAutomation/tsonik/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/NorthShoreAutomation/tsonik/actions/workflows/unit-tests.yml)
[![Lint Status](https://github.com/NorthShoreAutomation/tsonik/actions/workflows/lint.yml/badge.svg)](https://github.com/NorthShoreAutomation/tsonik/actions/workflows/lint.yml)

A TypeScript client library for the Iconik API that makes it easy to manage media assets, collections, jobs, and metadata. Named after the original Python `nsa-pythonik` library, this is the TypeScript version.

## Features

- 🎯 **TypeScript-first** with full type safety
- 🚀 **Promise-based API** with async/await support
- 🛡️ **Comprehensive error handling** with detailed error types
- 📡 **Built on Axios** for reliable HTTP requests
- 🏗️ **Resource-based architecture** (assets, collections, jobs, metadata)
- 📚 **Extensive documentation** with real-world examples
- ⚡ **Modern ES6+** JavaScript practices

## Installation

```bash
npm install tsonik
# or
yarn add tsonik
```

## Quick Start

```typescript
import { Tsonik } from 'tsonik';

// Initialize the client
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token'
});

// Get all assets
const assets = await client.assets.list();
console.log(`Found ${assets.data.objects.length} assets`);

// Create a new asset
const newAsset = await client.assets.create({
  title: 'My Video',
  type: 'assets'
});

// Search for assets
const results = await client.assets.search({
  query: 'video AND conference'
});

// Work with collections
const collection = await client.collections.create({
  title: 'Marketing Assets',
  type: 'collections'
});

// Add assets to collection
await client.collections.addAssets(collection.data.id, [
  newAsset.data.id
]);
```

## Documentation

📖 **[Getting Started](https://northshoreautomation.github.io/tsonik/docs/getting-started.html)** - Complete setup and first steps

💡 **[Usage Examples](https://northshoreautomation.github.io/tsonik/docs/examples.html)** - Real-world examples for all features

📚 **[API Reference](https://northshoreautomation.github.io/tsonik/docs/api-reference.html)** - Complete method documentation

🛠️ **[Best Practices](https://northshoreautomation.github.io/tsonik/docs/best-practices.html)** - Performance tips and patterns

🌐 **[Full Documentation Site](https://northshoreautomation.github.io/tsonik/)** - Complete hosted documentation

## Authentication

You'll need your Iconik App ID and Auth Token:

```typescript
// From environment variables (recommended)
const client = new Tsonik({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!
});

// Or directly (not recommended for production)
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  baseURL: 'https://app.iconik.io' // optional
});
```

## Error Handling

```typescript
import { IconikAPIError, IconikAuthError } from 'tsonik';

try {
  const asset = await client.assets.get('asset-id');
} catch (error) {
  if (error instanceof IconikAPIError) {
    console.log(`API Error ${error.status}: ${error.message}`);
  } else if (error instanceof IconikAuthError) {
    console.log('Authentication failed');
  }
}
```

## Available Resources

- **`client.assets`** - Asset management (create, read, update, delete, search)
- **`client.collections`** - Collection management and asset organization
- **`client.jobs`** - Job monitoring and management (transcoding, analysis, etc.)
- **`client.files`** - File operations and metadata
- **`client.filesets`** - Fileset management
- **`client.metadata`** - Metadata operations for any object type
- **`client.formats`** - Format information and management

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

For more detailed instructions, see [the full release guide](dev-docs/RELEASE_GUIDE.md).

## License

MIT