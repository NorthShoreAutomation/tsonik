---
layout: default
title: Home
---

# Tsonik

A TypeScript client library for the Iconik API that makes it easy to manage media assets, collections, jobs, and metadata.

## Features

- 🎯 **TypeScript-first** with full type safety
- 🚀 **Promise-based API** with async/await support
- 🛡️ **Comprehensive error handling** with detailed error types
- 📡 **Built on Axios** for reliable HTTP requests
- 🏗️ **Resource-based architecture** (assets, collections, jobs, metadata)
- 📚 **Extensive documentation** with real-world examples

## Installation

```bash
npm install tsonik
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
const assets = await client.assets.listAssets();
console.log(`Found ${assets.data.objects.length} assets`);

// Create a new asset
const newAsset = await client.assets.createAsset({
  title: 'My Video',
  type: 'ASSET',
  description: 'A sample video file'
});
```

## Documentation

📖 **[Getting Started](./docs/getting-started.html)** - Complete setup and first steps

💡 **[Usage Examples](./docs/examples.html)** - Real-world examples for all features

📚 **[API Reference](./docs/api-reference.html)** - Complete method documentation

🛠️ **[Best Practices](./docs/best-practices.html)** - Performance tips and patterns

## Links

- [GitHub Repository](https://github.com/NorthShoreAutomation/tsonik)
- [npm Package](https://www.npmjs.com/package/tsonik)